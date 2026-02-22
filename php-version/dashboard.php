<?php
/**
 * Dashboard Page
 * User's main workspace showing papers
 */

require_once __DIR__ . '/includes/session.php';
require_once __DIR__ . '/includes/functions.php';

Session::requireLogin();

$user = Session::getUser();
$userId = $user['id'];

// Fetch user's full data from database
$userData = getUserById($userId);

// Fetch user's saved papers
$papers = db()->fetchAll("SELECT * FROM papers WHERE user_id = ? ORDER BY created_at DESC", [$userId]);

$pageTitle = 'Dashboard';
require_once __DIR__ . '/templates/header.php';
?>

<style>
    .dashboard-header {
        padding: 3rem 0;
    }

    .dashboard-title {
        font-size: 2.5rem;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: -0.05em;
        margin-bottom: 1rem;
    }

    .dashboard-subtitle {
        color: var(--slate-500);
        font-weight: 500;
    }

    .create-cards {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
        margin-bottom: 4rem;
    }

    .create-card {
        padding: 2rem;
        display: flex;
        align-items: center;
        gap: 1.5rem;
        cursor: pointer;
        border: 2px solid var(--slate-100);
        background: var(--white);
        transition: all 0.3s ease;
    }

    .create-card:hover {
        background: var(--black);
        color: var(--white);
        border-color: var(--black);
    }

    .create-card:hover .create-icon {
        background: var(--white);
        color: var(--black);
    }

    .create-icon {
        width: 4rem;
        height: 4rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--black);
        color: var(--white);
        border-radius: 0.5rem;
        transition: all 0.3s ease;
    }

    .create-title {
        font-size: 1.5rem;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: -0.05em;
    }

    .create-desc {
        font-size: 0.875rem;
        font-weight: 500;
        opacity: 0.6;
        margin-top: 0.25rem;
    }

    .tabs-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        padding-bottom: 1rem;
        margin-bottom: 2rem;
    }

    .tabs-nav {
        display: flex;
        gap: 2rem;
    }

    .tab-btn {
        background: none;
        border: none;
        padding: 0;
        font-size: 0.875rem;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        color: var(--slate-400);
        cursor: pointer;
        position: relative;
        transition: color 0.2s ease;
    }

    .tab-btn.active {
        color: var(--black);
    }

    .tab-btn.active::after {
        content: '';
        position: absolute;
        bottom: -1rem;
        left: 0;
        right: 0;
        height: 2px;
        background: var(--black);
    }

    .papers-empty {
        padding: 6rem 2rem;
        text-align: center;
        border: 2px dashed var(--slate-100);
    }

    .papers-empty-icon {
        width: 4rem;
        height: 4rem;
        background: var(--slate-50);
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1.5rem;
        color: var(--slate-300);
    }

    .papers-empty h3 {
        font-size: 1.25rem;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: -0.05em;
        margin-bottom: 0.5rem;
    }

    .papers-empty p {
        color: var(--slate-400);
        font-weight: 500;
        margin-bottom: 2rem;
    }

    .paper-card {
        padding: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        border: 2px solid var(--slate-100);
        background: var(--white);
        margin-bottom: 1rem;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .paper-card:hover {
        border-color: var(--black);
    }

    .paper-title {
        font-size: 1.25rem;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: -0.05em;
        margin-bottom: 0.5rem;
    }

    .paper-meta {
        display: flex;
        gap: 1.5rem;
        font-size: 0.625rem;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        color: var(--slate-400);
    }

    .paper-stats {
        display: flex;
        gap: 2rem;
        text-align: right;
    }

    .paper-stat-value {
        font-size: 1.125rem;
        font-weight: 900;
    }

    .paper-stat-label {
        font-size: 0.625rem;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        color: var(--slate-300);
        margin-bottom: 0.25rem;
    }

    .ai-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
        padding: 0.125rem 0.5rem;
        border: 1px solid rgba(0, 0, 0, 0.1);
        font-size: 0.625rem;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        background: var(--slate-50);
    }

    @media (max-width: 768px) {
        .create-cards {
            grid-template-columns: 1fr;
        }

        .paper-card {
            flex-direction: column;
            align-items: flex-start;
        }

        .paper-stats {
            width: 100%;
            justify-content: flex-start;
            margin-top: 1rem;
        }
    }
</style>

<div class="container">
    <div class="dashboard-header">
        <h1 class="dashboard-title">Dashboard</h1>
        <p class="dashboard-subtitle">Manage your educational assessments with editorial precision.</p>
    </div>

    <!-- Create Cards -->
    <div class="create-cards">
        <a href="<?= APP_URL ?>/builder.php" class="create-card">
            <div class="create-icon">
                <i data-lucide="plus" style="width: 32px; height: 32px;"></i>
            </div>
            <div>
                <h3 class="create-title">New Paper</h3>
                <p class="create-desc">Manual design with full control</p>
            </div>
        </a>

        <a href="<?= APP_URL ?>/create-ai.php" class="create-card">
            <div class="create-icon">
                <i data-lucide="sparkles" style="width: 32px; height: 32px;"></i>
            </div>
            <div>
                <h3 class="create-title">AI Assist</h3>
                <p class="create-desc">Generate papers instantly</p>
            </div>
        </a>
    </div>

    <!-- Papers Tabs -->
    <div class="tabs-header">
        <div class="tabs-nav">
            <button class="tab-btn active" data-tab="saved">
                Question Bank (
                <?= count($papers) ?>)
            </button>
        </div>
        <button class="btn btn-outline btn-sm" onclick="location.reload()">
            <i data-lucide="refresh-cw" style="width: 12px; height: 12px; margin-right: 6px;"></i>
            Sync
        </button>
    </div>

    <!-- Papers List -->
    <div id="papers-list">
        <?php if (empty($papers)): ?>
            <div class="papers-empty">
                <div class="papers-empty-icon">
                    <i data-lucide="library" style="width: 32px; height: 32px;"></i>
                </div>
                <h3>No papers yet</h3>
                <p>Start your first transformation from the sections above.</p>
                <a href="<?= APP_URL ?>/builder.php" class="btn">Create Paper</a>
            </div>
        <?php else: ?>
            <?php foreach ($papers as $paper):
                $paperData = json_decode($paper['data'], true);
                $sectionCount = count($paperData['sections'] ?? []);
                $totalMarks = 0;
                foreach (($paperData['sections'] ?? []) as $section) {
                    foreach (($section['questions'] ?? []) as $q) {
                        $totalMarks += $q['marks'] ?? 0;
                    }
                }
                ?>
                <div class="paper-card" onclick="window.location.href='<?= APP_URL ?>/builder.php?id=<?= $paper['id'] ?>'">
                    <div>
                        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
                            <h3 class="paper-title">
                                <?= htmlspecialchars($paper['exam_name'] ?: 'Untitled Paper') ?>
                            </h3>
                            <?php if (!empty($paperData['isAIAssisted'])): ?>
                                <span class="ai-badge">
                                    <i data-lucide="sparkles" style="width: 10px; height: 10px;"></i>
                                    AI
                                </span>
                            <?php endif; ?>
                        </div>
                        <div class="paper-meta">
                            <?php if ($paper['subject']): ?>
                                <span>
                                    <?= htmlspecialchars($paper['subject']) ?>
                                </span>
                            <?php endif; ?>
                            <?php if ($paper['class']): ?>
                                <span>
                                    <?= htmlspecialchars($paper['class']) ?>
                                </span>
                            <?php endif; ?>
                            <span style="display: flex; align-items: center; gap: 0.5rem;">
                                <i data-lucide="clock" style="width: 12px; height: 12px;"></i>
                                <?= formatDate($paper['created_at']) ?>
                            </span>
                        </div>
                    </div>
                    <div class="paper-stats hide-mobile">
                        <div>
                            <div class="paper-stat-label">Sections</div>
                            <div class="paper-stat-value">
                                <?= $sectionCount ?>
                            </div>
                        </div>
                        <div>
                            <div class="paper-stat-label">Marks</div>
                            <div class="paper-stat-value">
                                <?= $totalMarks ?>
                            </div>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>
</div>

<?php require_once __DIR__ . '/templates/footer.php'; ?>