<?php
/**
 * Header Template
 * Common header for all pages
 */

require_once __DIR__ . '/../includes/session.php';
require_once __DIR__ . '/../includes/functions.php';

$currentPage = basename($_SERVER['PHP_SELF'], '.php');
$user = Session::getUser();
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="PaperCraft - Professional Question Paper Generator with AI Assistance">
    <title>
        <?= $pageTitle ?? 'PaperCraft' ?> | Question Paper Generator
    </title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet">

    <!-- Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/lucide/0.263.1/lucide.min.css">

    <!-- Bootstrap CSS (only grid and utilities, custom styling preserved) -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Custom CSS -->
    <link rel="stylesheet" href="<?= APP_URL ?>/assets/css/style.css">

    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
</head>

<body>
    <!-- Toast Container -->
    <div class="toast-container" id="toastContainer"></div>

    <header class="header">
        <div class="header-container">
            <a href="<?= APP_URL ?>" class="logo">
                <div class="logo-icon">
                    <i data-lucide="file-text" style="width: 20px; height: 20px;"></i>
                </div>
                <div class="logo-text">
                    <h1>PaperCraft</h1>
                    <p>Question Paper Generator</p>
                </div>
            </a>

            <nav class="header-nav">
                <a href="<?= APP_URL ?>/pricing.php"
                    class="nav-link hide-mobile <?= $currentPage === 'pricing' ? 'active' : '' ?>">
                    Pricing
                </a>

                <?php if ($user): ?>
                    <a href="<?= APP_URL ?>/dashboard.php"
                        class="nav-link hide-mobile <?= $currentPage === 'dashboard' ? 'active' : '' ?>">
                        Dashboard
                    </a>

                    <div class="dropdown" id="userDropdown">
                        <div class="user-menu" onclick="toggleDropdown('userDropdown')">
                            <div class="user-avatar">
                                <?= strtoupper(substr($user['name'] ?? $user['email'], 0, 1)) ?>
                            </div>
                            <div class="hide-mobile">
                                <p style="font-size: 0.75rem; font-weight: 700; line-height: 1;">
                                    <?= htmlspecialchars($user['name'] ?? 'User') ?>
                                </p>
                                <p
                                    style="font-size: 0.625rem; color: var(--slate-400); text-transform: uppercase; letter-spacing: 0.15em; margin-top: 2px;">
                                    <?= $user['plan'] ?>
                                </p>
                            </div>
                        </div>
                        <div class="dropdown-menu">
                            <a href="<?= APP_URL ?>/dashboard.php" class="dropdown-item">Dashboard</a>
                            <a href="<?= APP_URL ?>/pricing.php" class="dropdown-item">Upgrade Plan</a>
                            <div class="dropdown-divider"></div>
                            <a href="<?= APP_URL ?>/api/auth/logout.php" class="dropdown-item"
                                style="color: var(--red-500);">Sign Out</a>
                        </div>
                    </div>
                <?php else: ?>
                    <a href="<?= APP_URL ?>/login.php" class="btn btn-outline btn-sm">
                        Sign In
                    </a>
                    <a href="<?= APP_URL ?>/register.php" class="btn btn-sm">
                        Get Started
                    </a>
                <?php endif; ?>
            </nav>
        </div>
    </header>

    <main>