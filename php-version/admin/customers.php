<?php
/**
 * Admin Customers Page
 * Manage all registered users
 */

require_once __DIR__ . '/../includes/session.php';
require_once __DIR__ . '/../includes/functions.php';

Session::requireLogin();
Session::requireAdmin();

// Handle plan update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $action = $_POST['action'];
    $targetUserId = $_POST['user_id'] ?? '';

    if ($action === 'update_plan' && $targetUserId) {
        $newPlan = sanitize($_POST['plan'] ?? 'FREE');
        db()->query("UPDATE users SET plan = ? WHERE id = ?", [$newPlan, $targetUserId]);
        Session::setFlash('success', 'User plan updated successfully');
        header('Location: ' . APP_URL . '/admin/customers.php');
        exit;
    }
}

// Get all users with pagination
$page = max(1, intval($_GET['page'] ?? 1));
$perPage = 20;
$offset = ($page - 1) * $perPage;

$totalUsers = db()->fetch("SELECT COUNT(*) as count FROM users WHERE role != 'ADMIN'")['count'] ?? 0;
$totalPages = ceil($totalUsers / $perPage);

$users = db()->fetchAll(
    "SELECT * FROM users WHERE role != 'ADMIN' ORDER BY created_at DESC LIMIT ? OFFSET ?",
    [$perPage, $offset]
);

$pageTitle = 'Customers';
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Customers | Creator Panel</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="<?= APP_URL ?>/assets/css/style.css">
    <script src="https://unpkg.com/lucide@latest"></script>

    <style>
        .admin-layout {
            display: flex;
            min-height: 100vh;
        }

        .admin-sidebar {
            width: 260px;
            background: var(--black);
            color: var(--white);
            padding: 1.5rem;
            flex-shrink: 0;
        }

        .admin-logo {
            font-size: 1.5rem;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: -0.05em;
            margin-bottom: 0.5rem;
        }

        .admin-subtitle {
            font-size: 0.625rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            opacity: 0.5;
            margin-bottom: 2rem;
        }

        .admin-nav {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .admin-nav-item {
            margin-bottom: 0.5rem;
        }

        .admin-nav-link {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem 1rem;
            color: rgba(255, 255, 255, 0.7);
            text-decoration: none;
            font-size: 0.875rem;
            font-weight: 600;
            transition: all 0.2s ease;
        }

        .admin-nav-link:hover,
        .admin-nav-link.active {
            background: rgba(255, 255, 255, 0.1);
            color: var(--white);
        }

        .admin-main {
            flex: 1;
            background: var(--slate-50);
            overflow-y: auto;
        }

        .admin-header {
            background: var(--white);
            padding: 1.5rem 2rem;
            border-bottom: 1px solid var(--slate-100);
        }

        .admin-title {
            font-size: 1.5rem;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: -0.05em;
        }

        .admin-content {
            padding: 2rem;
        }

        .data-section {
            background: var(--white);
            border: 2px solid var(--slate-100);
        }

        .data-table {
            width: 100%;
        }

        .data-table th {
            font-size: 0.625rem;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            color: var(--slate-400);
            padding: 1rem 1.5rem;
            text-align: left;
            border-bottom: 1px solid var(--slate-100);
        }

        .data-table td {
            padding: 1rem 1.5rem;
            border-bottom: 1px solid var(--slate-50);
            font-size: 0.875rem;
        }

        .data-table tr:hover {
            background: var(--slate-50);
        }

        .plan-badge {
            display: inline-block;
            padding: 0.25rem 0.5rem;
            font-size: 0.625rem;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }

        .plan-badge.free {
            background: var(--slate-100);
            color: var(--slate-600);
        }

        .plan-badge.monthly {
            background: var(--black);
            color: var(--white);
        }

        .plan-badge.annual {
            background: var(--black);
            color: var(--white);
        }

        .plan-badge.payg {
            background: var(--slate-200);
            color: var(--black);
        }

        .pagination {
            display: flex;
            gap: 0.5rem;
            justify-content: center;
            padding: 1.5rem;
        }

        .pagination a,
        .pagination span {
            padding: 0.5rem 1rem;
            border: 2px solid var(--slate-100);
            font-size: 0.875rem;
            font-weight: 700;
        }

        .pagination a:hover {
            border-color: var(--black);
        }

        .pagination .active {
            background: var(--black);
            color: var(--white);
            border-color: var(--black);
        }

        .plan-select {
            padding: 0.25rem 0.5rem;
            font-size: 0.75rem;
            font-weight: 700;
            border: 2px solid var(--slate-200);
        }
    </style>
</head>

<body>
    <div class="admin-layout">
        <aside class="admin-sidebar">
            <div class="admin-logo">PaperCraft</div>
            <div class="admin-subtitle">Creator Panel</div>

            <nav>
                <ul class="admin-nav">
                    <li class="admin-nav-item">
                        <a href="<?= APP_URL ?>/admin/index.php" class="admin-nav-link">
                            <i data-lucide="layout-dashboard" style="width: 18px; height: 18px;"></i>
                            Dashboard
                        </a>
                    </li>
                    <li class="admin-nav-item">
                        <a href="<?= APP_URL ?>/admin/customers.php" class="admin-nav-link active">
                            <i data-lucide="users" style="width: 18px; height: 18px;"></i>
                            Customers
                        </a>
                    </li>
                    <li class="admin-nav-item">
                        <a href="<?= APP_URL ?>/admin/offers.php" class="admin-nav-link">
                            <i data-lucide="ticket" style="width: 18px; height: 18px;"></i>
                            Offers
                        </a>
                    </li>
                    <li class="admin-nav-item">
                        <a href="<?= APP_URL ?>/dashboard.php" class="admin-nav-link">
                            <i data-lucide="arrow-left" style="width: 18px; height: 18px;"></i>
                            Back to App
                        </a>
                    </li>
                </ul>
            </nav>
        </aside>

        <main class="admin-main">
            <header class="admin-header">
                <h1 class="admin-title">Customers (
                    <?= $totalUsers ?>)
                </h1>
            </header>

            <div class="admin-content">
                <?php if (Session::getFlash('success')): ?>
                    <div
                        style="background: #d4edda; color: #155724; padding: 1rem; margin-bottom: 1rem; border: 1px solid #c3e6cb;">
                        <?= Session::getFlash('success') ?>
                    </div>
                <?php endif; ?>

                <div class="data-section">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Plan</th>
                                <th>Papers</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($users as $user): ?>
                                <?php
                                $paperCount = db()->fetch("SELECT COUNT(*) as count FROM papers WHERE user_id = ?", [$user['id']])['count'] ?? 0;
                                ?>
                                <tr>
                                    <td>
                                        <?= htmlspecialchars($user['name'] ?: 'Unknown') ?>
                                    </td>
                                    <td>
                                        <?= htmlspecialchars($user['email']) ?>
                                    </td>
                                    <td>
                                        <span class="plan-badge <?= strtolower($user['plan'] ?: 'free') ?>">
                                            <?= htmlspecialchars($user['plan'] ?: 'FREE') ?>
                                        </span>
                                    </td>
                                    <td>
                                        <?= $paperCount ?>
                                    </td>
                                    <td>
                                        <?= formatDate($user['created_at']) ?>
                                    </td>
                                    <td>
                                        <form method="POST" style="display: inline-flex; gap: 0.5rem;">
                                            <input type="hidden" name="action" value="update_plan">
                                            <input type="hidden" name="user_id" value="<?= $user['id'] ?>">
                                            <select name="plan" class="plan-select">
                                                <option value="FREE" <?= $user['plan'] === 'FREE' ? 'selected' : '' ?>>FREE
                                                </option>
                                                <option value="PAYG" <?= $user['plan'] === 'PAYG' ? 'selected' : '' ?>>PAYG
                                                </option>
                                                <option value="MONTHLY" <?= $user['plan'] === 'MONTHLY' ? 'selected' : '' ?>
                                                    >MONTHLY</option>
                                                <option value="ANNUAL" <?= $user['plan'] === 'ANNUAL' ? 'selected' : '' ?>
                                                    >ANNUAL</option>
                                            </select>
                                            <button type="submit" class="btn btn-sm">Update</button>
                                        </form>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>

                    <?php if ($totalPages > 1): ?>
                        <div class="pagination">
                            <?php for ($i = 1; $i <= $totalPages; $i++): ?>
                                <?php if ($i === $page): ?>
                                    <span class="active">
                                        <?= $i ?>
                                    </span>
                                <?php else: ?>
                                    <a href="?page=<?= $i ?>">
                                        <?= $i ?>
                                    </a>
                                <?php endif; ?>
                            <?php endfor; ?>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </main>
    </div>

    <script>
        lucide.createIcons();
    </script>
</body>

</html>