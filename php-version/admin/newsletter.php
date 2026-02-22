<?php
/**
 * Admin Newsletter Management
 * View subscribers and send newsletters
 */

require_once __DIR__ . '/../includes/session.php';
require_once __DIR__ . '/../includes/functions.php';

Session::requireLogin();
Session::requireAdmin();

// Handle actions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    if ($action === 'delete' && isset($_POST['id'])) {
        db()->query("DELETE FROM newsletter_subscribers WHERE id = ?", [$_POST['id']]);
        Session::setFlash('success', 'Subscriber removed');
        header('Location: ' . APP_URL . '/admin/newsletter.php');
        exit;
    }
}

// Get all subscribers
$subscribers = db()->fetchAll("SELECT * FROM newsletter_subscribers ORDER BY created_at DESC");
$totalSubscribers = count($subscribers);

$pageTitle = 'Newsletter';
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Newsletter | Creator Panel</title>

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
            display: flex;
            justify-content: space-between;
            align-items: center;
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

        .stat-box {
            background: var(--white);
            border: 2px solid var(--slate-100);
            padding: 2rem;
            margin-bottom: 2rem;
            display: flex;
            align-items: center;
            gap: 2rem;
        }

        .stat-icon {
            width: 4rem;
            height: 4rem;
            background: var(--black);
            color: var(--white);
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 0.5rem;
        }

        .stat-value {
            font-size: 3rem;
            font-weight: 900;
            letter-spacing: -0.05em;
        }

        .stat-label {
            font-size: 0.625rem;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            color: var(--slate-400);
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
                        <a href="<?= APP_URL ?>/admin/customers.php" class="admin-nav-link">
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
                        <a href="<?= APP_URL ?>/admin/newsletter.php" class="admin-nav-link active">
                            <i data-lucide="mail" style="width: 18px; height: 18px;"></i>
                            Newsletter
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
                <h1 class="admin-title">Newsletter Subscribers</h1>
            </header>

            <div class="admin-content">
                <?php if (Session::getFlash('success')): ?>
                    <div
                        style="background: #d4edda; color: #155724; padding: 1rem; margin-bottom: 1rem; border: 1px solid #c3e6cb;">
                        <?= Session::getFlash('success') ?>
                    </div>
                <?php endif; ?>

                <div class="stat-box">
                    <div class="stat-icon">
                        <i data-lucide="users" style="width: 24px; height: 24px;"></i>
                    </div>
                    <div>
                        <div class="stat-label">Total Subscribers</div>
                        <div class="stat-value">
                            <?= $totalSubscribers ?>
                        </div>
                    </div>
                </div>

                <div class="data-section">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Subscribed</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($subscribers as $sub): ?>
                                <tr>
                                    <td>
                                        <?= htmlspecialchars($sub['email']) ?>
                                    </td>
                                    <td>
                                        <?= formatDate($sub['created_at']) ?>
                                    </td>
                                    <td>
                                        <form method="POST" style="display: inline;"
                                            onsubmit="return confirm('Remove this subscriber?')">
                                            <input type="hidden" name="action" value="delete">
                                            <input type="hidden" name="id" value="<?= $sub['id'] ?>">
                                            <button type="submit" class="btn btn-sm"
                                                style="background: #dc3545; border-color: #dc3545;">Remove</button>
                                        </form>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                            <?php if (empty($subscribers)): ?>
                                <tr>
                                    <td colspan="3" style="text-align: center; color: var(--slate-400);">No subscribers yet
                                    </td>
                                </tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    </div>

    <script>
        lucide.createIcons();
    </script>
</body>

</html>