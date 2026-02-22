<?php
/**
 * Admin Offers Page
 * Manage discount offers and coupons
 */

require_once __DIR__ . '/../includes/session.php';
require_once __DIR__ . '/../includes/functions.php';

Session::requireLogin();
Session::requireAdmin();

// Handle form submissions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    if ($action === 'create') {
        $code = strtoupper(sanitize($_POST['code'] ?? ''));
        $discount = intval($_POST['discount'] ?? 0);
        $validUntil = sanitize($_POST['valid_until'] ?? '');
        $maxUses = intval($_POST['max_uses'] ?? 0);

        if ($code && $discount > 0) {
            db()->insert('offers', [
                'id' => generateUUID(),
                'code' => $code,
                'discount_percent' => $discount,
                'valid_until' => $validUntil ?: null,
                'max_uses' => $maxUses ?: null,
                'used_count' => 0,
                'is_active' => 1
            ]);
            Session::setFlash('success', 'Offer created successfully');
        }
        header('Location: ' . APP_URL . '/admin/offers.php');
        exit;
    }

    if ($action === 'toggle' && isset($_POST['offer_id'])) {
        $offerId = $_POST['offer_id'];
        db()->query("UPDATE offers SET is_active = NOT is_active WHERE id = ?", [$offerId]);
        Session::setFlash('success', 'Offer status updated');
        header('Location: ' . APP_URL . '/admin/offers.php');
        exit;
    }

    if ($action === 'delete' && isset($_POST['offer_id'])) {
        $offerId = $_POST['offer_id'];
        db()->query("DELETE FROM offers WHERE id = ?", [$offerId]);
        Session::setFlash('success', 'Offer deleted');
        header('Location: ' . APP_URL . '/admin/offers.php');
        exit;
    }
}

// Get all offers
$offers = db()->fetchAll("SELECT * FROM offers ORDER BY created_at DESC");

$pageTitle = 'Offers';
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Offers | Creator Panel</title>

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

        .create-form {
            background: var(--white);
            border: 2px solid var(--slate-100);
            padding: 1.5rem;
            margin-bottom: 2rem;
        }

        .form-row {
            display: grid;
            grid-template-columns: repeat(4, 1fr) auto;
            gap: 1rem;
            align-items: end;
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

        .status-badge {
            display: inline-block;
            padding: 0.25rem 0.5rem;
            font-size: 0.625rem;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }

        .status-badge.active {
            background: #d4edda;
            color: #155724;
        }

        .status-badge.inactive {
            background: #f8d7da;
            color: #721c24;
        }

        .offer-code {
            font-family: monospace;
            font-size: 1rem;
            font-weight: 900;
            background: var(--slate-100);
            padding: 0.25rem 0.5rem;
        }

        @media (max-width: 768px) {
            .form-row {
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
                        <a href="<?= APP_URL ?>/admin/offers.php" class="admin-nav-link active">
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
                <h1 class="admin-title">Offers & Coupons</h1>
            </header>

            <div class="admin-content">
                <?php if (Session::getFlash('success')): ?>
                    <div
                        style="background: #d4edda; color: #155724; padding: 1rem; margin-bottom: 1rem; border: 1px solid #c3e6cb;">
                        <?= Session::getFlash('success') ?>
                    </div>
                <?php endif; ?>

                <form method="POST" class="create-form">
                    <input type="hidden" name="action" value="create">
                    <h3 style="font-size: 1rem; font-weight: 900; text-transform: uppercase; margin-bottom: 1rem;">
                        Create New Offer</h3>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Coupon Code</label>
                            <input type="text" name="code" class="form-input" placeholder="SUMMER20" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Discount %</label>
                            <input type="number" name="discount" class="form-input" min="1" max="100" placeholder="20"
                                required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Valid Until</label>
                            <input type="date" name="valid_until" class="form-input">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Max Uses (0=unlimited)</label>
                            <input type="number" name="max_uses" class="form-input" value="0" min="0">
                        </div>
                        <button type="submit" class="btn">Create</button>
                    </div>
                </form>

                <div class="data-section">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Discount</th>
                                <th>Valid Until</th>
                                <th>Usage</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($offers as $offer): ?>
                                <tr>
                                    <td><span class="offer-code">
                                            <?= htmlspecialchars($offer['code']) ?>
                                        </span></td>
                                    <td>
                                        <?= $offer['discount_percent'] ?>%
                                    </td>
                                    <td>
                                        <?= $offer['valid_until'] ? formatDate($offer['valid_until']) : 'No expiry' ?>
                                    </td>
                                    <td>
                                        <?= $offer['used_count'] ?>
                                        <?= $offer['max_uses'] ? '/' . $offer['max_uses'] : '' ?>
                                    </td>
                                    <td>
                                        <span class="status-badge <?= $offer['is_active'] ? 'active' : 'inactive' ?>">
                                            <?= $offer['is_active'] ? 'Active' : 'Inactive' ?>
                                        </span>
                                    </td>
                                    <td>
                                        <form method="POST" style="display: inline;">
                                            <input type="hidden" name="action" value="toggle">
                                            <input type="hidden" name="offer_id" value="<?= $offer['id'] ?>">
                                            <button type="submit" class="btn btn-sm btn-outline">
                                                <?= $offer['is_active'] ? 'Disable' : 'Enable' ?>
                                            </button>
                                        </form>
                                        <form method="POST" style="display: inline;"
                                            onsubmit="return confirm('Delete this offer?')">
                                            <input type="hidden" name="action" value="delete">
                                            <input type="hidden" name="offer_id" value="<?= $offer['id'] ?>">
                                            <button type="submit" class="btn btn-sm"
                                                style="background: #dc3545; border-color: #dc3545;">Delete</button>
                                        </form>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                            <?php if (empty($offers)): ?>
                                <tr>
                                    <td colspan="6" style="text-align: center; color: var(--slate-400);">No offers yet</td>
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