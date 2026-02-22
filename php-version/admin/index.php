<?php
/**
 * Admin Dashboard
 * Creator panel for managing customers and offers
 */

require_once __DIR__ . '/../includes/session.php';
require_once __DIR__ . '/../includes/functions.php';

Session::requireLogin();
Session::requireAdmin();

// Get statistics
$stats = [
    'totalUsers' => db()->fetch("SELECT COUNT(*) as count FROM users WHERE role != 'ADMIN'")['count'] ?? 0,
    'totalPapers' => db()->fetch("SELECT COUNT(*) as count FROM papers")['count'] ?? 0,
    'activeSubscriptions' => db()->fetch("SELECT COUNT(*) as count FROM users WHERE plan IN ('MONTHLY', 'ANNUAL')")['count'] ?? 0,
    'todaySignups' => db()->fetch("SELECT COUNT(*) as count FROM users WHERE DATE(created_at) = CURDATE()")['count'] ?? 0,
];

// Get recent users
$recentUsers = db()->fetchAll("SELECT id, name, email, plan, created_at FROM users WHERE role != 'ADMIN' ORDER BY created_at DESC LIMIT 10");

// Get recent papers
$recentPapers = db()->fetchAll("SELECT p.*, u.name as user_name FROM papers p JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC LIMIT 10");

$pageTitle = 'Admin Dashboard';
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Creator Panel | PaperCraft</title>

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

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1.5rem;
            margin-bottom: 2rem;
        }

        .stat-card {
            background: var(--white);
            border: 2px solid var(--slate-100);
            padding: 1.5rem;
        }

        .stat-label {
            font-size: 0.625rem;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            color: var(--slate-400);
            margin-bottom: 0.5rem;
        }

        .stat-value {
            font-size: 2.5rem;
            font-weight: 900;
            letter-spacing: -0.05em;
        }

        .data-section {
            background: var(--white);
            border: 2px solid var(--slate-100);
            margin-bottom: 1.5rem;
        }

        .data-header {
            padding: 1rem 1.5rem;
            border-bottom: 1px solid var(--slate-100);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .data-title {
            font-size: 1rem;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: -0.05em;
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

        @media (max-width: 1024px) {
            .stats-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media (max-width: 768px) {
            .admin-sidebar {
                display: none;
            }

            .stats-grid {
                grid-template-columns: 1fr;
            }
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
                        <a href="<?= APP_URL ?>/admin/index.php" class="admin-nav-link active">
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
                <h1 class="admin-title">Dashboard</h1>
                <span style="font-size: 0.75rem; color: var(--slate-400);">
                    <?= date('l, F j, Y') ?>
                </span>
            </header>

            <div class="admin-content">
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-label">Total Users</div>
                        <div class="stat-value">
                            <?= $stats['totalUsers'] ?>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Total Papers</div>
                        <div class="stat-value">
                            <?= $stats['totalPapers'] ?>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Active Subscriptions</div>
                        <div class="stat-value">
                            <?= $stats['activeSubscriptions'] ?>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Today's Signups</div>
                        <div class="stat-value">
                            <?= $stats['todaySignups'] ?>
                        </div>
                    </div>
                </div>

                <div class="data-section">
                    <div class="data-header">
                        <h2 class="data-title">Recent Users</h2>
                        <a href="<?= APP_URL ?>/admin/customers.php" class="btn btn-sm btn-outline">View All</a>
                    </div>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Plan</th>
                                <th>Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($recentUsers as $user): ?>
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
                                        <?= formatDate($user['created_at']) ?>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                            <?php if (empty($recentUsers)): ?>
                                <tr>
                                    <td colspan="4" style="text-align: center; color: var(--slate-400);">No users yet</td>
                                </tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>

                <div class="data-section">
                    <div class="data-header">
                        <h2 class="data-title">Recent Papers</h2>
                    </div>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Paper Name</th>
                                <th>Created By</th>
                                <th>Subject</th>
                                <th>Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($recentPapers as $paper): ?>
                                <tr>
                                    <td>
                                        <?= htmlspecialchars($paper['exam_name'] ?: 'Untitled') ?>
                                    </td>
                                    <td>
                                        <?= htmlspecialchars($paper['user_name']) ?>
                                    </td>
                                    <td>
                                        <?= htmlspecialchars($paper['subject'] ?: 'N/A') ?>
                                    </td>
                                    <td>
                                        <?= formatDate($paper['created_at']) ?>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                            <?php if (empty($recentPapers)): ?>
                                <tr>
                                    <td colspan="4" style="text-align: center; color: var(--slate-400);">No papers yet</td>
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