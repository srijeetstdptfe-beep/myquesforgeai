<?php
/**
 * AI Paper Generation Page
 * Generate papers using Groq AI
 */

require_once __DIR__ . '/includes/session.php';
require_once __DIR__ . '/includes/functions.php';

Session::requireLogin();

$user = Session::getUser();
$userId = $user['id'];

$pageTitle = 'AI Generator';
require_once __DIR__ . '/templates/header.php';
?>

<style>
    .ai-page {
        padding: 3rem 1.5rem;
        min-height: calc(100vh - 200px);
    }

    .ai-header {
        text-align: center;
        margin-bottom: 3rem;
    }

    .ai-icon {
        width: 5rem;
        height: 5rem;
        background: var(--black);
        color: var(--white);
        border-radius: 0.75rem;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1.5rem;
    }

    .ai-title {
        font-size: 2.5rem;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: -0.05em;
        margin-bottom: 1rem;
    }

    .ai-subtitle {
        color: var(--slate-500);
        font-weight: 500;
        max-width: 500px;
        margin: 0 auto;
    }

    .ai-form {
        max-width: 700px;
        margin: 0 auto;
        background: var(--white);
        border: 2px solid var(--slate-100);
        padding: 2.5rem;
    }

    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }

    .question-types-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.75rem;
        margin-top: 0.5rem;
    }

    .question-type-chip {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem;
        border: 2px solid var(--slate-100);
        background: var(--white);
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .question-type-chip:hover {
        border-color: var(--black);
    }

    .question-type-chip.selected {
        background: var(--black);
        color: var(--white);
        border-color: var(--black);
    }

    .question-type-chip input {
        display: none;
    }

    .difficulty-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.75rem;
        margin-top: 0.5rem;
    }

    .difficulty-btn {
        padding: 1rem;
        border: 2px solid var(--slate-100);
        background: var(--white);
        cursor: pointer;
        transition: all 0.2s ease;
        text-align: center;
    }

    .difficulty-btn:hover {
        border-color: var(--black);
    }

    .difficulty-btn.selected {
        background: var(--black);
        color: var(--white);
        border-color: var(--black);
    }

    .difficulty-name {
        font-size: 0.875rem;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: -0.05em;
        margin-bottom: 0.25rem;
    }

    .difficulty-desc {
        font-size: 0.625rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        opacity: 0.6;
    }

    .generate-btn {
        height: 4rem;
        font-size: 1rem;
        margin-top: 2rem;
    }

    .loading-state {
        text-align: center;
        padding: 4rem 2rem;
        display: none;
    }

    .loading-state.active {
        display: block;
    }

    .loading-spinner {
        width: 4rem;
        height: 4rem;
        border: 4px solid var(--slate-100);
        border-top-color: var(--black);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1.5rem;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    .loading-text {
        font-size: 1.25rem;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: -0.05em;
        margin-bottom: 0.5rem;
    }

    .loading-subtext {
        color: var(--slate-400);
        font-size: 0.875rem;
        font-weight: 500;
    }

    @media (max-width: 768px) {
        .form-row {
            grid-template-columns: 1fr;
        }

        .question-types-grid {
            grid-template-columns: repeat(2, 1fr);
        }

        .difficulty-grid {
            grid-template-columns: 1fr;
        }
    }
</style>

<div class="ai-page">
    <div class="container">
        <div class="ai-header">
            <div class="ai-icon">
                <i data-lucide="sparkles" style="width: 32px; height: 32px;"></i>
            </div>
            <h1 class="ai-title">AI Generator</h1>
            <p class="ai-subtitle">Generate complete question papers instantly using AI. Just describe what you need.
            </p>
        </div>

        <form id="aiForm" class="ai-form">
            <?= csrfField() ?>

            <div class="form-group">
                <label class="form-label">Subject / Topic</label>
                <input type="text" name="subject" class="form-input" placeholder="e.g., Mathematics, Physics, History"
                    required>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Class / Grade Level</label>
                    <input type="text" name="classLevel" class="form-input"
                        placeholder="e.g., Class 10, B.Tech 2nd Year" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Total Question Count</label>
                    <input type="number" name="questionCount" class="form-input" value="20" min="5" max="50" required>
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">Specific Topics (Optional)</label>
                <textarea name="topics" class="form-input" rows="3"
                    placeholder="List specific chapters or topics to cover..."></textarea>
            </div>

            <div class="form-group">
                <label class="form-label">Question Types</label>
                <div class="question-types-grid">
                    <label class="question-type-chip selected">
                        <input type="checkbox" name="types[]" value="MCQ" checked>
                        MCQ
                    </label>
                    <label class="question-type-chip selected">
                        <input type="checkbox" name="types[]" value="TRUE_FALSE" checked>
                        True/False
                    </label>
                    <label class="question-type-chip">
                        <input type="checkbox" name="types[]" value="FILL_BLANK">
                        Fill Blank
                    </label>
                    <label class="question-type-chip selected">
                        <input type="checkbox" name="types[]" value="SHORT_ANSWER" checked>
                        Short Answer
                    </label>
                    <label class="question-type-chip">
                        <input type="checkbox" name="types[]" value="LONG_ANSWER">
                        Long Answer
                    </label>
                    <label class="question-type-chip">
                        <input type="checkbox" name="types[]" value="MATCH">
                        Match
                    </label>
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">Difficulty Level</label>
                <div class="difficulty-grid">
                    <div class="difficulty-btn" data-value="easy" onclick="selectDifficulty('easy')">
                        <div class="difficulty-name">Easy</div>
                        <div class="difficulty-desc">Basic concepts</div>
                    </div>
                    <div class="difficulty-btn selected" data-value="medium" onclick="selectDifficulty('medium')">
                        <div class="difficulty-name">Medium</div>
                        <div class="difficulty-desc">Standard exam</div>
                    </div>
                    <div class="difficulty-btn" data-value="hard" onclick="selectDifficulty('hard')">
                        <div class="difficulty-name">Hard</div>
                        <div class="difficulty-desc">Competitive</div>
                    </div>
                </div>
                <input type="hidden" name="difficulty" id="difficulty" value="medium">
            </div>

            <button type="submit" class="btn w-full generate-btn">
                <i data-lucide="sparkles" style="width: 20px; height: 20px; margin-right: 8px;"></i>
                Generate Paper
            </button>
        </form>

        <div id="loadingState" class="loading-state">
            <div class="loading-spinner"></div>
            <div class="loading-text">Generating Paper</div>
            <div class="loading-subtext">AI is crafting your questions. This may take a moment...</div>
        </div>
    </div>
</div>

<script>
    let selectedDifficulty = 'medium';

    // Question type toggle
    document.querySelectorAll('.question-type-chip').forEach(chip => {
        chip.addEventListener('click', function (e) {
            if (e.target.tagName !== 'INPUT') {
                const checkbox = this.querySelector('input');
                checkbox.checked = !checkbox.checked;
            }
            this.classList.toggle('selected', this.querySelector('input').checked);
        });
    });

    function selectDifficulty(value) {
        selectedDifficulty = value;
        document.getElementById('difficulty').value = value;
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.toggle('selected', btn.dataset.value === value);
        });
    }

    document.getElementById('aiForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const form = this;
        const formData = new FormData(form);

        // Get selected types
        const types = [];
        form.querySelectorAll('input[name="types[]"]:checked').forEach(cb => {
            types.push(cb.value);
        });

        if (types.length === 0) {
            showToast('Please select at least one question type', 'error');
            return;
        }

        // Show loading state
        form.style.display = 'none';
        document.getElementById('loadingState').classList.add('active');

        try {
            const response = await fetch('<?= APP_URL ?>/api/ai/generate-paper.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject: formData.get('subject'),
                    classLevel: formData.get('classLevel'),
                    questionCount: parseInt(formData.get('questionCount')),
                    topics: formData.get('topics'),
                    types: types,
                    difficulty: formData.get('difficulty'),
                    csrf_token: formData.get('csrf_token')
                })
            });

            const data = await response.json();

            if (response.ok && data.paperId) {
                showToast('Paper generated successfully!');
                window.location.href = '<?= APP_URL ?>/builder.php?id=' + data.paperId;
            } else {
                throw new Error(data.error || 'Generation failed');
            }
        } catch (error) {
            showToast(error.message || 'Failed to generate paper', 'error');
            form.style.display = 'block';
            document.getElementById('loadingState').classList.remove('active');
        }
    });
</script>

<?php require_once __DIR__ . '/templates/footer.php'; ?>