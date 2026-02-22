<?php
/**
 * Paper Builder Page
 * Main workspace for creating and editing question papers
 */

require_once __DIR__ . '/includes/session.php';
require_once __DIR__ . '/includes/functions.php';

Session::requireLogin();

$user = Session::getUser();
$userId = $user['id'];

// Check if editing existing paper
$paperId = $_GET['id'] ?? null;
$paper = null;
$paperData = null;

if ($paperId) {
    $paper = db()->fetch("SELECT * FROM papers WHERE id = ? AND user_id = ?", [$paperId, $userId]);
    if ($paper) {
        $paperData = json_decode($paper['data'], true);
    }
}

// If no paper, create new one
if (!$paperData) {
    $paperId = generateUUID();
    $paperData = [
        'id' => $paperId,
        'metadata' => [
            'examName' => 'Untitled Paper',
            'subject' => '',
            'classOrCourse' => '',
            'institutionName' => '',
            'duration' => '3 Hours',
            'totalMarks' => 100,
            'date' => date('Y-m-d'),
        ],
        'sections' => [],
        'isAIAssisted' => false,
    ];
}

$pageTitle = 'Paper Builder';
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>
        <?= htmlspecialchars($paperData['metadata']['examName'] ?? 'Paper Builder') ?> | PaperCraft
    </title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="<?= APP_URL ?>/assets/css/style.css">
    <link rel="stylesheet" href="<?= APP_URL ?>/assets/css/builder.css">
    <script src="https://unpkg.com/lucide@latest"></script>

    <!-- Quill Editor for Rich Text -->
    <link href="https://cdn.quilljs.com/1.3.7/quill.snow.css" rel="stylesheet">
    <script src="https://cdn.quilljs.com/1.3.7/quill.min.js"></script>

    <!-- SortableJS for Drag & Drop -->
    <script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js"></script>
</head>

<body>
    <div id="app" class="builder-layout">
        <!-- Header -->
        <header class="builder-header">
            <div class="header-left">
                <a href="<?= APP_URL ?>/dashboard.php" class="back-btn" title="Return to Dashboard">
                    <i data-lucide="arrow-left"></i>
                </a>
                <div class="paper-info">
                    <div class="paper-icon">
                        <i data-lucide="file-text"></i>
                    </div>
                    <div>
                        <h1 id="paperTitle" contenteditable="true" class="paper-title">
                            <?= htmlspecialchars($paperData['metadata']['examName'] ?? 'Untitled Paper') ?>
                        </h1>
                        <p class="paper-meta">
                            <span id="subjectDisplay">
                                <?= htmlspecialchars($paperData['metadata']['subject'] ?: 'GENERAL') ?>
                            </span> •
                            <span id="classDisplay">
                                <?= htmlspecialchars($paperData['metadata']['classOrCourse'] ?: 'ALL CLASSES') ?>
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            <div class="header-right">
                <button id="translateBtn" class="btn btn-outline btn-sm">
                    <i data-lucide="languages"></i>
                    Translate
                </button>
                <div class="h-6 w-[2px] bg-slate-200 mx-2"></div>
                <button id="pyqBankBtn" class="btn btn-outline btn-sm">
                    <i data-lucide="database"></i>
                    PYQ Bank
                </button>
                <button id="toBankBtn" class="btn btn-outline btn-sm">
                    <i data-lucide="arrow-up-right"></i>
                    TO BANK
                </button>
                <div class="h-6 w-[2px] bg-slate-200 mx-2"></div>
                <button id="metadataBtn" class="btn btn-outline btn-sm">
                    <i data-lucide="settings"></i>
                    Settings
                </button>
                <button id="previewBtn" class="btn btn-outline btn-sm">
                    <i data-lucide="eye"></i>
                    Preview
                </button>
                <button id="saveBtn" class="btn btn-sm">
                    <i data-lucide="save"></i>
                    Save
                </button>
            </div>

        </header>

        <!-- Main Builder Area -->
        <div class="builder-main">
            <!-- Question Types Sidebar -->
            <aside class="sidebar-left">
                <div class="sidebar-header">
                    <h3>Question Library</h3>
                </div>
                <div class="sidebar-scroll">
                    <div class="sidebar-category">Objective</div>
                    <div class="question-types">
                        <button class="q-type-btn" data-type="mcq-single">
                            <div class="q-type-icon"><i data-lucide="circle-dot"></i></div>
                            <span>MCQ (Single)</span>
                        </button>
                        <button class="q-type-btn" data-type="mcq-multiple">
                            <div class="q-type-icon"><i data-lucide="check-square"></i></div>
                            <span>MCQ (Multiple)</span>
                        </button>
                        <button class="q-type-btn" data-type="true-false">
                            <div class="q-type-icon"><i data-lucide="check-circle"></i></div>
                            <span>True/False</span>
                        </button>
                        <button class="q-type-btn" data-type="match-following">
                            <div class="q-type-icon"><i data-lucide="git-merge"></i></div>
                            <span>Match</span>
                        </button>
                    </div>

                    <div class="sidebar-category">Short Answer</div>
                    <div class="question-types">
                        <button class="q-type-btn" data-type="fill-blanks">
                            <div class="q-type-icon"><i data-lucide="text-cursor-input"></i></div>
                            <span>Fill Blanks</span>
                        </button>
                        <button class="q-type-btn" data-type="one-sentence">
                            <div class="q-type-icon"><i data-lucide="align-left"></i></div>
                            <span>One Sentence</span>
                        </button>
                        <button class="q-type-btn" data-type="short-answer">
                            <div class="q-type-icon"><i data-lucide="align-justify"></i></div>
                            <span>Short Answer</span>
                        </button>
                    </div>

                    <div class="sidebar-category">Descriptive</div>
                    <div class="question-types">
                        <button class="q-type-btn" data-type="long-answer">
                            <div class="q-type-icon"><i data-lucide="file-text"></i></div>
                            <span>Long Answer</span>
                        </button>
                        <button class="q-type-btn" data-type="essay">
                            <div class="q-type-icon"><i data-lucide="book-open"></i></div>
                            <span>Essay</span>
                        </button>
                        <button class="q-type-btn" data-type="short-notes">
                            <div class="q-type-icon"><i data-lucide="sticky-note"></i></div>
                            <span>Short Notes</span>
                        </button>
                    </div>
                </div>
                <div class="sidebar-footer">
                    <button id="addSectionBtn" class="btn btn-black w-full">
                        <i data-lucide="plus"></i>
                        Add Section
                    </button>
                </div>
            </aside>

            <!-- Canvas Area -->
            <main class="builder-canvas">
                <div id="sectionsContainer">
                    <!-- Sections will be rendered here -->
                </div>
                <div id="emptyState" class="empty-state">
                    <div class="empty-icon">
                        <i data-lucide="layers"></i>
                    </div>
                    <h3>No sections yet</h3>
                    <p>Click "Add Section" to start building your paper</p>
                    <button id="addFirstSection" class="btn">Add First Section</button>
                </div>
            </main>

            <!-- Properties Panel -->
            <aside class="sidebar-right" id="propertiesPanel">
                <div class="properties-empty">
                    <i data-lucide="mouse-pointer-click"></i>
                    <p>Select a question to edit its properties</p>
                </div>
            </aside>
        </div>
    </div>

    <!-- Metadata Modal -->
    <div class="modal-overlay" id="metadataModal">
        <div class="modal" style="max-width: 600px;">
            <div class="modal-header">
                <h2 class="modal-title">Paper Settings</h2>
                <button class="btn btn-icon btn-sm" onclick="closeModal('metadataModal')">✕</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label class="form-label">Exam Name</label>
                    <input type="text" id="metaExamName" class="form-input" placeholder="Final Examination 2024">
                </div>
                <div class="form-group">
                    <label class="form-label">Subject</label>
                    <input type="text" id="metaSubject" class="form-input" placeholder="Mathematics">
                </div>
                <div class="form-group">
                    <label class="form-label">Class / Course</label>
                    <input type="text" id="metaClass" class="form-input" placeholder="Class 10 / B.Tech">
                </div>
                <div class="form-group">
                    <label class="form-label">Institution Name</label>
                    <input type="text" id="metaInstitution" class="form-input" placeholder="Your School/College Name">
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label class="form-label">Duration</label>
                        <input type="text" id="metaDuration" class="form-input" placeholder="3 Hours">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Total Marks</label>
                        <input type="number" id="metaTotalMarks" class="form-input" placeholder="100">
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline" onclick="closeModal('metadataModal')">Cancel</button>
                <button class="btn" onclick="saveMetadata()">Save Settings</button>
            </div>
        </div>
    </div>

    <!-- Preview Modal -->
    <div class="modal-overlay" id="previewModal">
        <div class="modal" style="max-width: 900px; max-height: 90vh; display: flex; flex-direction: column;">
            <div class="modal-header">
                <h2 class="modal-title">Paper Preview</h2>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-outline btn-sm" onclick="exportPDF()">
                        <i data-lucide="download"></i> PDF
                    </button>
                    <button class="btn btn-icon btn-sm" onclick="closeModal('previewModal')">✕</button>
                </div>
            </div>
            <div class="modal-body" style="flex: 1; overflow: auto; padding: 0;">
                <div id="previewContent" class="preview-paper">
                    <!-- Preview will be rendered here -->
                </div>
            </div>
        </div>
    </div>

    <!-- Translate Modal -->
    <div class="modal-overlay" id="translateModal">
        <div class="modal" style="max-width: 400px;">
            <div class="modal-header">
                <h2 class="modal-title">Linguistic Module</h2>
                <button class="btn btn-icon btn-sm" onclick="closeModal('translateModal')">✕</button>
            </div>
            <div class="modal-body space-y-4">
                <div class="form-group">
                    <label class="form-label">Target Language</label>
                    <select id="targetLangSelect" class="form-input">
                        <option value="hi">Hindi</option>
                        <option value="mr">Marathi</option>
                        <option value="gu">Gujarati</option>
                        <option value="bn">Bengali</option>
                        <option value="ta">Tamil</option>
                        <option value="te">Telugu</option>
                        <option value="kn">Kannada</option>
                        <option value="ml">Malayalam</option>
                        <option value="pa">Punjabi</option>
                        <option value="en">English</option>
                    </select>
                </div>
                <p class="text-xs text-slate-500 font-bold uppercase tracking-widest">AI will translate all text blocks
                    while maintaining structure.</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline" onclick="closeModal('translateModal')">Cancel</button>
                <button id="confirmTranslateBtn" class="btn">Start Translation</button>
            </div>
        </div>
    </div>


    <div class="toast-container" id="toastContainer"></div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="<?= APP_URL ?>/assets/js/app.js"></script>
    <script>
        // Paper data
        let paperData = <?= json_encode($paperData) ?>;
        const paperId = '<?= $paperId ?>';
        const apiUrl = '<?= APP_URL ?>';
        let selectedQuestionId = null;
        let selectedSectionId = null;

        // Initialize
        document.addEventListener('DOMContentLoaded', function () {
            lucide.createIcons();
            renderSections();
            bindEvents();
        });

        function bindEvents() {
            // Add section buttons
            document.getElementById('addSectionBtn').addEventListener('click', addSection);
            document.getElementById('addFirstSection').addEventListener('click', addSection);

            // Question type buttons
            document.querySelectorAll('.q-type-btn').forEach(btn => {
                btn.addEventListener('click', () => addQuestion(btn.dataset.type));
            });

            // Save button
            document.getElementById('saveBtn').addEventListener('click', savePaper);

            // Utility buttons
            document.getElementById('translateBtn').addEventListener('click', () => openModal('translateModal'));
            document.getElementById('confirmTranslateBtn').addEventListener('click', translatePaper);

            document.getElementById('pyqBankBtn').addEventListener('click', () => {
                showToast('Retrieving historical data from SSC Repository...', 'warning');
                // Potential integration point for AI-assisted search
            });

            document.getElementById('toBankBtn').addEventListener('click', async () => {
                showToast('Packaging blocks for Global Bank...', 'warning');
                try {
                    const response = await fetch(`${apiUrl}/api/bank/export.php`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ paperId, questions: paperData.sections.flatMap(s => s.questions) })
                    });
                    if (response.ok) showToast('Sync complete: Knowledge base updated');
                    else showToast('Sync failed: Network congestion', 'error');
                } catch (e) {
                    showToast('Persistence connection lost', 'error');
                }
            });

            // Metadata button
            document.getElementById('metadataBtn').addEventListener('click', () => {
                populateMetadataModal();
                openModal('metadataModal');
            });

            // Preview button
            document.getElementById('previewBtn').addEventListener('click', () => {
                renderPreview();
                openModal('previewModal');
            });

            // Paper title editing
            document.getElementById('paperTitle').addEventListener('blur', function () {
                paperData.metadata.examName = this.textContent.trim() || 'Untitled Paper';
            });
        }

        async function translatePaper() {
            const targetLang = document.getElementById('targetLangSelect').value;
            const btn = document.getElementById('confirmTranslateBtn');
            const originalText = btn.textContent;

            btn.disabled = true;
            btn.innerHTML = '<i data-lucide="loader-2" class="spin"></i> Translating...';
            lucide.createIcons();

            try {
                // We'll iterate through sections and questions to translate
                for (let section of paperData.sections) {
                    section.title = await translateText(section.title, targetLang);
                    if (section.description) section.description = await translateText(section.description, targetLang);
                    if (section.instructions) section.instructions = await translateText(section.instructions, targetLang);

                    for (let q of section.questions) {
                        q.text = await translateText(q.text, targetLang);
                        if (q.instructions) q.instructions = await translateText(q.instructions, targetLang);
                        if (q.options) {
                            for (let i = 0; i < q.options.length; i++) {
                                q.options[i] = await translateText(q.options[i], targetLang);
                            }
                        }
                        if (q.matchPairs) {
                            for (let pair of q.matchPairs) {
                                pair.left = await translateText(pair.left, targetLang);
                                pair.right = await translateText(pair.right, targetLang);
                            }
                        }
                    }
                }

                renderSections();
                closeModal('translateModal');
                showToast('Multi-linguistic conversion successful');
            } catch (error) {
                showToast('Translation error', 'error');
            } finally {
                btn.disabled = false;
                btn.textContent = originalText;
                lucide.createIcons();
            }
        }

        async function translateText(text, targetLang) {
            if (!text || text.trim() === '') return text;
            try {
                const response = await fetch(`${apiUrl}/api/ai/translate.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text, targetLanguage: targetLang })
                });
                const result = await response.json();
                return result.translatedText || text;
            } catch (e) {
                return text;
            }
        }


        function addSection() {
            const sectionId = 'section_' + Date.now();
            const sectionNumber = paperData.sections.length + 1;

            paperData.sections.push({
                id: sectionId,
                title: `Section ${String.fromCharCode(64 + sectionNumber)}`,
                instructions: '',
                questions: []
            });

            renderSections();
            showToast('Section added');
        }

        function deleteSection(sectionId) {
            if (!confirm('Delete this section and all its questions?')) return;
            paperData.sections = paperData.sections.filter(s => s.id !== sectionId);
            renderSections();
            showToast('Section deleted');
        }

        function addQuestion(type, targetSectionId = null) {
            const sectionId = targetSectionId || (paperData.sections.length > 0 ? paperData.sections[0].id : null);
            if (!sectionId) {
                showToast('Please add a section first', 'error');
                return;
            }

            const section = paperData.sections.find(s => s.id === sectionId);
            if (!section) return;

            const questionId = 'q_' + Date.now();
            const question = {
                id: questionId,
                type: type,
                text: '<p>Enter your question here...</p>',
                marks: 1,
                difficulty: 'medium',
                language: 'english',
                instructions: '',
                options: (type === 'mcq-single' || type === 'mcq-multiple') ? ['Option 1', 'Option 2', 'Option 3', 'Option 4'] : [],
                correctAnswer: type === 'true-false' ? 'true' : (type === 'mcq-multiple' ? [] : ''),
                matchPairs: type === 'match-following' ? [{ left: 'Item 1', right: 'Answer A' }, { left: 'Item 2', right: 'Answer B' }] : [],
                blanks: type === 'fill-blanks' ? [''] : []
            };

            section.questions.push(question);
            renderSections();
            selectQuestion(sectionId, questionId);
            showToast(`${type.replace('-', ' ').toUpperCase()} added`);
        }


        function deleteQuestion(sectionId, questionId) {
            const section = paperData.sections.find(s => s.id === sectionId);
            if (!section) return;
            section.questions = section.questions.filter(q => q.id !== questionId);
            renderSections();
            showToast('Question deleted');

            if (selectedQuestionId === questionId) {
                selectedQuestionId = null;
                selectedSectionId = null;
                renderPropertiesPanel();
            }
        }

        function selectQuestion(sectionId, questionId) {
            selectedSectionId = sectionId;
            selectedQuestionId = questionId;

            // Update visual selection
            document.querySelectorAll('.question-card').forEach(card => card.classList.remove('selected'));
            document.querySelectorAll('.section-card').forEach(card => card.classList.remove('selected'));

            const selectedCard = document.querySelector(`[data-question-id="${questionId}"]`);
            if (selectedCard) selectedCard.classList.add('selected');

            // Auto-open properties on mobile/small screens
            document.getElementById('propertiesPanel').classList.add('open');
            renderPropertiesPanel();
        }

        function selectSection(sectionId) {
            selectedSectionId = sectionId;
            selectedQuestionId = null;

            // Update visual selection
            document.querySelectorAll('.section-card').forEach(card => card.classList.remove('selected'));
            document.querySelectorAll('.question-card').forEach(card => card.classList.remove('selected'));

            const selectedCard = document.querySelector(`[data-section-id="${sectionId}"]`);
            if (selectedCard) selectedCard.classList.add('selected');

            // Auto-open properties
            document.getElementById('propertiesPanel').classList.add('open');
            renderPropertiesPanel();
        }

        function closeProperties() {
            document.getElementById('propertiesPanel').classList.remove('open');
            selectedQuestionId = null;
            selectedSectionId = null;
            renderSections();
            renderPropertiesPanel();
        }

        function renderSections() {
            const container = document.getElementById('sectionsContainer');
            const emptyState = document.getElementById('emptyState');

            if (paperData.sections.length === 0) {
                container.innerHTML = '';
                emptyState.style.display = 'flex';
                return;
            }

            emptyState.style.display = 'none';

            container.innerHTML = paperData.sections.map((section, sIndex) => {
                const totalMarks = section.questions.reduce((sum, q) => sum + (parseInt(q.marks) || 0), 0);
                return `
                <div class="section-card ${selectedSectionId === section.id && !selectedQuestionId ? 'selected' : ''}" data-section-id="${section.id}" onclick="event.stopPropagation(); selectSection('${section.id}')">
                    <div class="section-header">
                        <div class="section-title-row">
                            <input type="text" class="section-title-input" value="${escapeHtml(section.title)}" 
                                   onchange="updateSectionTitle('${section.id}', this.value)" onclick="event.stopPropagation()">
                            <div class="flex gap-2">
                                <span class="section-badge">${section.questions.length} Q</span>
                                <span class="section-badge bg-black text-white">${totalMarks} PK</span>
                            </div>
                        </div>
                        <div class="section-actions">
                            <button class="btn btn-icon btn-sm" onclick="event.stopPropagation(); moveSection('${section.id}', -1)" title="Move Up">
                                <i data-lucide="chevron-up"></i>
                            </button>
                            <button class="btn btn-icon btn-sm" onclick="event.stopPropagation(); moveSection('${section.id}', 1)" title="Move Down">
                                <i data-lucide="chevron-down"></i>
                            </button>
                            <button class="btn btn-icon btn-sm" onclick="event.stopPropagation(); deleteSection('${section.id}')" title="Delete Section">
                                <i data-lucide="trash-2"></i>
                            </button>
                        </div>
                    </div>
                    </div>
                    <div class="section-questions" data-section-id="${section.id}">
                        ${section.questions.length === 0 ? `
                            <div class="questions-empty">
                                <p>[ NO BLOCKS DETECTED ]</p>
                            </div>
                        ` : section.questions.map((q, qIndex) => renderQuestionCard(section.id, q, qIndex + 1)).join('')}
                    </div>
                </div>
                `;
            }).join('');

            lucide.createIcons();
            initSortable();
        }

        function initSortable() {
            document.querySelectorAll('.section-questions').forEach(el => {
                if (el.dataset.sortable) return; // Already initialized

                new Sortable(el, {
                    animation: 150,
                    handle: '.drag-handle',
                    ghostClass: 'bg-slate-50',
                    onEnd: function (evt) {
                        const sectionId = el.dataset.sectionId;
                        const section = paperData.sections.find(s => s.id === sectionId);
                        if (!section) return;

                        // Reorder questions in data
                        const [movedItem] = section.questions.splice(evt.oldIndex, 1);
                        section.questions.splice(evt.newIndex, 0, movedItem);

                        renderSections(); // Re-render to update numbers and total logic
                    }
                });

                el.dataset.sortable = "true";
            });
        }

        function renderQuestionCard(sectionId, question, number) {
            const isSelected = selectedQuestionId === question.id;

            return `
                <div class="question-card ${isSelected ? 'selected' : ''}" 
                     data-question-id="${question.id}" 
                     onclick="event.stopPropagation(); selectQuestion('${sectionId}', '${question.id}')">
                    
                    <div class="card-header">
                        <div class="drag-handle">
                            <i data-lucide="grip-vertical"></i>
                        </div>
                        <div class="card-index">Q${number}</div>
                        <div class="flex gap-2">
                             <span class="badge badge-sm uppercase tracking-widest text-[8px] bg-black text-white px-2 py-0.5 border-none">${question.type.replace('-', ' ')}</span>
                             ${question.difficulty ? `<span class="badge badge-sm uppercase tracking-widest text-[8px] bg-white border-2 border-black">${question.difficulty}</span>` : ''}
                        </div>

                        <div class="marks-input-wrapper">
                            <input type="number" class="marks-input" value="${question.marks}" 
                                   onclick="event.stopPropagation()"
                                   onchange="updateQuestionMarks(this.value, '${sectionId}', '${question.id}')">
                            <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">PK</span>
                        </div>

                        <div class="flex items-center gap-1 ml-4 border-l-2 border-slate-200 pl-4">
                            <button class="btn btn-icon btn-xs opacity-30 hover:opacity-100" onclick="event.stopPropagation(); duplicateQuestion('${sectionId}', '${question.id}')">
                                <i data-lucide="copy" class="w-3.5 h-3.5"></i>
                            </button>
                            <button class="btn btn-icon btn-xs opacity-30 hover:opacity-100 hover:text-red-500" onclick="event.stopPropagation(); deleteQuestion('${sectionId}', '${question.id}')">
                                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                            </button>
                        </div>
                    </div>

                    <div class="card-body">
                        <div id="inlineEditor_${question.id}" class="question-text ql-editor-minimal" 
                             contenteditable="true" 
                             oninput="updateInlineText('${sectionId}', '${question.id}', this.innerHTML)"
                             onclick="event.stopPropagation()"
                             onfocus="selectQuestion('${sectionId}', '${question.id}')"
                             placeholder="ENTER QUESTION CONTENT...">
                            ${question.text || ''}
                        </div>

                        <div class="mt-6">
                            ${renderCardOptions(sectionId, question)}
                        </div>
                    </div>
                </div>
            `;
        }

        function renderCardOptions(sectionId, question) {
            if (question.type === 'mcq-single' || question.type === 'mcq-multiple') {
                const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
                return `
                    <div class="space-y-3">
                        ${(question.options || []).map((opt, i) => {
                    const isCorrect = Array.isArray(question.correctAnswer) ? question.correctAnswer.includes(i) : String(question.correctAnswer) === String(i);
                    return `
                            <div class="flex items-center gap-3 group/opt">
                                <div class="relative flex items-center justify-center w-5 h-5 flex-shrink-0">
                                    <input type="${question.type === 'mcq-single' ? 'radio' : 'checkbox'}" 
                                           name="card_ans_${question.id}" 
                                           ${isCorrect ? 'checked' : ''}
                                           class="w-5 h-5 border-2 border-black rounded-none appearance-none checked:bg-black cursor-pointer"
                                           onclick="event.stopPropagation()"
                                           onchange="updateCardCorrectOption('${sectionId}', '${question.id}', ${i}, this.checked)">
                                    ${isCorrect ? '<i data-lucide="check" class="absolute text-white w-3 h-3 pointer-events-none"></i>' : ''}
                                </div>
                                <span class="text-[10px] font-black text-slate-400 w-4">${labels[i]}.</span>
                                <div class="flex-1 text-sm font-bold border-b-2 border-transparent hover:border-slate-100 focus:border-black outline-none py-1"
                                     contenteditable="true"
                                     onclick="event.stopPropagation()"
                                     oninput="updateInlineOption('${sectionId}', '${question.id}', ${i}, this.textContent)"
                                     placeholder="Option ${labels[i]}">
                                    ${escapeHtml(opt)}
                                </div>
                                <button class="btn btn-icon btn-xs opacity-0 group-hover/opt:opacity-30 hover:!opacity-100" 
                                        onclick="event.stopPropagation(); removeCardOption('${sectionId}', '${question.id}', ${i})">
                                    <i data-lucide="x"></i>
                                </button>
                            </div>
                        `;
                }).join('')}
                        <button class="btn btn-sm border-2 border-dashed border-slate-200 hover:border-black text-[9px] font-black uppercase tracking-widest w-full py-2 mt-2" 
                                onclick="event.stopPropagation(); addCardOption('${sectionId}', '${question.id}')">
                            + Add Option
                        </button>
                    </div>
                `;
            }

            if (question.type === 'true-false') {
                return `
                    <div class="flex gap-4">
                        <button class="btn px-6 py-2 border-2 ${question.correctAnswer === 'true' ? 'bg-black text-white border-black' : 'bg-white text-slate-400 border-slate-100'} text-[10px] font-black uppercase tracking-widest"
                                onclick="event.stopPropagation(); updateCardCorrectAnswer('${sectionId}', '${question.id}', 'true')">
                            TRUE
                        </button>
                        <button class="btn px-6 py-2 border-2 ${question.correctAnswer === 'false' ? 'bg-black text-white border-black' : 'bg-white text-slate-400 border-slate-100'} text-[10px] font-black uppercase tracking-widest"
                                onclick="event.stopPropagation(); updateCardCorrectAnswer('${sectionId}', '${question.id}', 'false')">
                            FALSE
                        </button>
                    </div>
                `;
            }

            if (question.type === 'match-following') {
                return `
                    <div class="grid grid-cols-2 gap-x-12 gap-y-3">
                        ${(question.matchPairs || []).map((pair, i) => `
                            <div class="flex items-center gap-3">
                                <span class="text-[10px] font-black text-slate-300">${i + 1}.</span>
                                <input type="text" class="flex-1 bg-transparent border-b-2 border-slate-100 focus:border-black outline-none py-1 text-sm font-bold" 
                                       value="${escapeHtml(pair.left)}" 
                                       onclick="event.stopPropagation()"
                                       oninput="updateCardMatchPair('${sectionId}', '${question.id}', ${i}, 'left', this.value)">
                            </div>
                            <div class="flex items-center gap-3 group/opt">
                                <span class="text-[10px] font-black text-slate-300">${String.fromCharCode(65 + i)}.</span>
                                <input type="text" class="flex-1 bg-transparent border-b-2 border-slate-100 focus:border-black outline-none py-1 text-sm font-bold" 
                                       value="${escapeHtml(pair.right)}" 
                                       onclick="event.stopPropagation()"
                                       oninput="updateCardMatchPair('${sectionId}', '${question.id}', ${i}, 'right', this.value)">
                                <button class="btn btn-icon btn-xs opacity-0 group-hover/opt:opacity-30 hover:!opacity-100" 
                                        onclick="event.stopPropagation(); removeCardMatchPair('${sectionId}', '${question.id}', ${i})">
                                    <i data-lucide="trash-2"></i>
                                </button>
                            </div>
                        `).join('')}
                        <button class="btn btn-sm border-2 border-dashed border-slate-200 hover:border-black text-[9px] font-black uppercase tracking-widest col-span-2 py-2 mt-4" 
                                onclick="event.stopPropagation(); addCardMatchPair('${sectionId}', '${question.id}')">
                            + Add Logic Pair
                        </button>
                    </div>
                `;
            }

            if (question.type === 'fill-blanks') {
                return `
                    <div class="space-y-2">
                        <label class="text-[9px] font-black uppercase tracking-widest text-slate-400">Expected Answer</label>
                        <div class="flex items-center gap-3">
                            <input type="text" class="flex-1 bg-slate-50 border-2 border-black px-3 py-2 text-sm font-bold focus:bg-white outline-none" 
                                   value="${escapeHtml(question.correctAnswer || '')}" 
                                   placeholder="ENTER BLANK VALUE..."
                                   onclick="event.stopPropagation()"
                                   oninput="updateCardCorrectAnswer('${sectionId}', '${question.id}', this.value)">
                            <div class="w-10 h-10 border-2 border-black flex items-center justify-center bg-yellow-400">
                                <i data-lucide="type" class="w-5 h-5"></i>
                            </div>
                        </div>
                    </div>
                `;
            }

            return `
                <div class="p-8 border-2 border-dashed border-slate-100 text-center text-slate-300 font-black uppercase tracking-widest text-[10px]">
                    [ ${question.type.replace('-', ' ')} block ]
                </div>
            `;
        }

        function updateInlineText(sectionId, questionId, val) {
            const section = paperData.sections.find(s => s.id === sectionId);
            const question = section?.questions.find(q => q.id === questionId);
            if (question) {
                question.text = val;
                // Sync with sidebar if this is the selected question
                if (selectedQuestionId === questionId) {
                    const editor = document.querySelector('#questionEditor .ql-editor');
                    if (editor && editor.innerHTML !== val) {
                        editor.innerHTML = val;
                    }
                }
            }
        }

        function updateInlineOption(sectionId, questionId, index, val) {
            const section = paperData.sections.find(s => s.id === sectionId);
            const question = section?.questions.find(q => q.id === questionId);
            if (question && question.options) {
                question.options[index] = val;
                // Sync with sidebar
                if (selectedQuestionId === questionId) {
                    renderPropertiesPanel();
                }
            }
        }

        function updateQuestionMarks(val, sectionId = null, questionId = null) {
            const marks = parseInt(val) || 0;
            const targetSectionId = sectionId || selectedSectionId;
            const targetQuestionId = questionId || selectedQuestionId;

            const section = paperData.sections.find(s => s.id === targetSectionId);
            const question = section?.questions.find(q => q.id === targetQuestionId);

            if (question) {
                question.marks = marks;
                renderSections();
                if (selectedQuestionId === targetQuestionId) renderPropertiesPanel();
            }
        }

        function updateCardCorrectOption(sectionId, questionId, index, checked) {
            const section = paperData.sections.find(s => s.id === sectionId);
            const question = section?.questions.find(q => q.id === questionId);
            if (!question) return;

            if (question.type === 'mcq-single') {
                question.correctAnswer = index;
            } else {
                if (!Array.isArray(question.correctAnswer)) question.correctAnswer = [];
                if (checked) {
                    if (!question.correctAnswer.includes(index)) question.correctAnswer.push(index);
                } else {
                    question.correctAnswer = question.correctAnswer.filter(i => i !== index);
                }
            }
            renderSections();
            if (selectedQuestionId === questionId) renderPropertiesPanel();
        }

        function removeCardOption(sectionId, questionId, index) {
            const section = paperData.sections.find(s => s.id === sectionId);
            const question = section?.questions.find(q => q.id === questionId);
            if (question && question.options) {
                question.options.splice(index, 1);
                renderSections();
                if (selectedQuestionId === questionId) renderPropertiesPanel();
            }
        }

        function addCardOption(sectionId, questionId) {
            const section = paperData.sections.find(s => s.id === sectionId);
            const question = section?.questions.find(q => q.id === questionId);
            if (question && question.options) {
                question.options.push('New Option');
                renderSections();
                if (selectedQuestionId === questionId) renderPropertiesPanel();
            }
        }

        function updateCardCorrectAnswer(sectionId, questionId, val) {
            const section = paperData.sections.find(s => s.id === sectionId);
            const question = section?.questions.find(q => q.id === questionId);
            if (question) {
                question.correctAnswer = val;
                renderSections();
                if (selectedQuestionId === questionId) renderPropertiesPanel();
            }
        }

        function updateCardMatchPair(sectionId, questionId, index, side, val) {
            const section = paperData.sections.find(s => s.id === sectionId);
            const question = section?.questions.find(q => q.id === questionId);
            if (question && question.matchPairs) {
                question.matchPairs[index][side] = val;
            }
        }

        function removeCardMatchPair(sectionId, questionId, index) {
            const section = paperData.sections.find(s => s.id === sectionId);
            const question = section?.questions.find(q => q.id === questionId);
            if (question && question.matchPairs) {
                question.matchPairs.splice(index, 1);
                renderSections();
            }
        }

        function addCardMatchPair(sectionId, questionId) {
            const section = paperData.sections.find(s => s.id === sectionId);
            const question = section?.questions.find(q => q.id === questionId);
            if (question) {
                if (!question.matchPairs) question.matchPairs = [];
                question.matchPairs.push({ left: '', right: '' });
                renderSections();
            }
        }


        const LANGUAGE_LABELS = {
            english: 'English',
            hindi: 'हिन्दी (Hindi)',
            bengali: 'বাংলা (Bengali)',
            telugu: 'తెలుగు (Telugu)',
            marathi: 'मराठी (Marathi)',
            tamil: 'தமிழ் (Tamil)',
            urdu: 'اردو (Urdu)',
            gujarati: 'ગુજરાતી (Gujarati)',
            kannada: 'ಕನ್ನಡ (Kannada)',
            malayalam: 'മലയാളം (Malayalam)',
            odia: 'ଓଡ଼ିଆ (Odia)',
            punjabi: 'ਪੰਜਾਬੀ (Punjabi)',
            assamese: 'অসমীয়া (Assamese)',
            maithili: 'मैथिली (Maithili)',
            sanskrit: 'संस्कृतम् (Sanskrit)',
            santali: 'ᱥᱟᱱᱛᱟᱲᱤ (Santali)',
            kashmiri: 'कॉशुर (Kashmiri)',
            nepali: 'नेपाली (Nepali)',
            sindhi: 'سنڌي (Sindhi)',
            konkani: 'कोंकणी (Konkani)',
            dogri: 'डोगरी (Dogri)',
            manipuri: 'মৈতৈলোন্ (Manipuri)',
            bodo: 'बड़ो (Bodo)',
        };

        function renderPropertiesPanel() {
            const panel = document.getElementById('propertiesPanel');

            if (!selectedQuestionId && !selectedSectionId) {
                panel.innerHTML = `
                    <div class="properties-empty">
                        <i data-lucide="mouse-pointer-click"></i>
                        <p>Select a component to edit</p>
                    </div>
                `;
                lucide.createIcons();
                return;
            }

            if (selectedQuestionId) {
                const section = paperData.sections.find(s => s.id === selectedSectionId);
                const question = section?.questions.find(q => q.id === selectedQuestionId);
                if (!question) return;

                panel.innerHTML = `
                    <div class="p-6 border-b-2 border-black bg-slate-50 flex justify-between items-center sticky top-0 z-10">
                        <h2 class="font-black text-xs uppercase tracking-[0.2em] text-black">Configuration</h2>
                        <button class="btn btn-icon btn-sm lg:hidden" onclick="closeProperties()">
                            <i data-lucide="chevrons-right"></i>
                        </button>
                    </div>
                    <div class="properties-body space-y-6">
                        <div class="form-group">
                            <label class="form-label text-[10px] font-black uppercase tracking-widest text-slate-400">Block Type</label>
                            <select class="form-input font-bold" onchange="changeQuestionType(this.value)">
                                <optgroup label="Objective">
                                    <option value="mcq-single" ${question.type === 'mcq-single' ? 'selected' : ''}>MCQ (Single)</option>
                                    <option value="mcq-multiple" ${question.type === 'mcq-multiple' ? 'selected' : ''}>MCQ (Multiple)</option>
                                    <option value="true-false" ${question.type === 'true-false' ? 'selected' : ''}>True/False</option>
                                    <option value="match-following" ${question.type === 'match-following' ? 'selected' : ''}>Match</option>
                                </optgroup>
                                <optgroup label="Short Answer">
                                    <option value="fill-blanks" ${question.type === 'fill-blanks' ? 'selected' : ''}>Fill Blanks</option>
                                    <option value="one-sentence" ${question.type === 'one-sentence' ? 'selected' : ''}>One Sentence</option>
                                    <option value="short-answer" ${question.type === 'short-answer' ? 'selected' : ''}>Short Answer</option>
                                </optgroup>
                                <optgroup label="Descriptive">
                                    <option value="long-answer" ${question.type === 'long-answer' ? 'selected' : ''}>Long Answer</option>
                                    <option value="essay" ${question.type === 'essay' ? 'selected' : ''}>Essay</option>
                                    <option value="short-notes" ${question.type === 'short-notes' ? 'selected' : ''}>Short Notes</option>
                                </optgroup>
                                <option value="custom" ${question.type === 'custom' ? 'selected' : ''}>Custom</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label class="form-label text-[10px] font-black uppercase tracking-widest text-slate-400">Weightage (Marks)</label>
                            <input type="number" class="form-input font-bold" value="${question.marks}" onchange="updateQuestionMarks(this.value)">
                        </div>

                        <div class="form-group">
                            <label class="form-label text-[10px] font-black uppercase tracking-widest text-slate-400">Complexity</label>
                            <select class="form-input font-bold" onchange="updateQuestionDifficulty(this.value)">
                                <option value="easy" ${question.difficulty === 'easy' ? 'selected' : ''}>Easy</option>
                                <option value="medium" ${question.difficulty === 'medium' ? 'selected' : ''}>Medium</option>
                                <option value="hard" ${question.difficulty === 'hard' ? 'selected' : ''}>Hard</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label class="form-label text-[10px] font-black uppercase tracking-widest text-slate-400">Linguistic Module</label>
                            <select class="form-input font-bold" onchange="updateQuestionLanguage(this.value)">
                                ${Object.entries(LANGUAGE_LABELS).map(([key, label]) => `
                                    <option value="${key}" ${question.language === key ? 'selected' : ''}>${label}</option>
                                `).join('')}
                            </select>
                        </div>

                        <div class="form-group">
                            <label class="form-label text-[10px] font-black uppercase tracking-widest text-slate-400">Question Content</label>
                            <div id="questionEditor" class="quill-editor border-2 border-black"></div>
                        </div>

                        <div class="form-group">
                            <label class="form-label text-[10px] font-black uppercase tracking-widest text-slate-400">Supplemental Guidance</label>
                            <textarea class="form-input font-bold resize-none" rows="3" placeholder="Answer any 3..." onchange="updateQuestionInstructions(this.value)">${escapeHtml(question.instructions || '')}</textarea>
                        </div>

                        ${renderQuestionOptions(question)}
                    </div>
                `;

                // Initialize Quill with auto-focus
                setTimeout(() => {
                    const quill = new Quill('#questionEditor', {
                        theme: 'snow',
                        placeholder: 'System ready for input...',
                        modules: { toolbar: [['bold', 'italic'], [{ 'list': 'ordered' }, { 'list': 'bullet' }], ['clean']] }
                    });
                    quill.root.innerHTML = question.text;
                    quill.on('text-change', () => {
                        question.text = quill.root.innerHTML;
                        const cardText = document.querySelector(`[data-question-id="${question.id}"] .question-text`);
                        if (cardText) {
                            const plain = stripHtml(question.text);
                            cardText.textContent = plain.length > 150 ? plain.substring(0, 150) + '...' : (plain || 'No content defined for this block');
                        }
                    });

                    // Force focus for immediate editing
                    if (window.innerWidth > 1024) {
                        quill.focus();
                    }
                }, 100);

            } else if (selectedSectionId) {
                const section = paperData.sections.find(s => s.id === selectedSectionId);
                if (!section) return;

                panel.innerHTML = `
                    <div class="p-6 border-b-2 border-black bg-slate-50 flex justify-between items-center sticky top-0 z-10">
                        <h2 class="font-black text-xs uppercase tracking-[0.2em] text-black">Section Logistics</h2>
                        <button class="btn btn-icon btn-sm lg:hidden" onclick="closeProperties()">
                            <i data-lucide="chevrons-right"></i>
                        </button>
                    </div>
                    <div class="properties-body space-y-6">
                        <div class="form-group">
                            <label class="form-label text-[10px] font-black uppercase tracking-widest text-slate-400">Division Title</label>
                            <input type="text" class="form-input font-bold" value="${escapeHtml(section.title)}" onchange="updateSectionTitle('${section.id}', this.value)">
                        </div>
                        <div class="form-group">
                            <label class="form-label text-[10px] font-black uppercase tracking-widest text-slate-400">Internal Description</label>
                            <textarea class="form-input font-bold resize-none" rows="3" placeholder="Objective type questions" onchange="updateSectionDescription('${section.id}', this.value)">${escapeHtml(section.description || '')}</textarea>
                        </div>
                        <div class="form-group">
                            <label class="form-label text-[10px] font-black uppercase tracking-widest text-slate-400">Public Instructions</label>
                            <textarea class="form-input font-bold resize-none" rows="4" placeholder="Attempt all questions" onchange="updateSectionInstructions('${section.id}', this.value)">${escapeHtml(section.instructions || '')}</textarea>
                        </div>
                        <div class="pt-6 border-t-2 border-black space-y-4">
                            <div class="flex items-center justify-between">
                                <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Blocks</span>
                     <span class="font-black text-sm">${section.questions.length}</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Section Weightage</span>
                                <span class="font-black text-sm">${section.questions.reduce((sum, q) => sum + (parseInt(q.marks) || 0), 0)} PK</span>
                            </div>
                        </div>
                    </div>
                `;
            }

            lucide.createIcons();
        }

        function updateSectionDescription(id, val) {
            const section = paperData.sections.find(s => s.id === id);
            if (section) section.description = val;
        }

        function updateSectionInstructions(id, val) {
            const section = paperData.sections.find(s => s.id === id);
            if (section) section.instructions = val;
        }

        function updateQuestionDifficulty(val) {
            const section = paperData.sections.find(s => s.id === selectedSectionId);
            const question = section?.questions.find(q => q.id === selectedQuestionId);
            if (question) {
                question.difficulty = val;
                renderSections();
            }
        }

        function updateQuestionLanguage(val) {
            const section = paperData.sections.find(s => s.id === selectedSectionId);
            const question = section?.questions.find(q => q.id === selectedQuestionId);
            if (question) question.language = val;
        }

        function updateQuestionInstructions(val) {
            const section = paperData.sections.find(s => s.id === selectedSectionId);
            const question = section?.questions.find(q => q.id === selectedQuestionId);
            if (question) question.instructions = val;
        }

        function changeQuestionType(newType) {
            const section = paperData.sections.find(s => s.id === selectedSectionId);
            const question = section?.questions.find(q => q.id === selectedQuestionId);
            if (question) {
                question.type = newType;
                // Initialize type-specific data if missing
                if (newType === 'mcq-single' || newType === 'mcq-multiple') {
                    if (!question.options) question.options = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
                } else if (newType === 'match-following') {
                    if (!question.matchPairs) question.matchPairs = [{ left: '', right: '' }, { left: '', right: '' }];
                }
                renderSections();
                renderPropertiesPanel();
            }
        }

        function moveSection(id, dir) {
            const index = paperData.sections.findIndex(s => s.id === id);
            if (index === -1) return;
            const newIndex = index + dir;
            if (newIndex < 0 || newIndex >= paperData.sections.length) return;

            const temp = paperData.sections[index];
            paperData.sections[index] = paperData.sections[newIndex];
            paperData.sections[newIndex] = temp;
            renderSections();
        }

        function moveQuestion(sId, qId, dir) {
            const section = paperData.sections.find(s => s.id === sId);
            if (!section) return;
            const index = section.questions.findIndex(q => q.id === qId);
            if (index === -1) return;
            const newIndex = index + dir;
            if (newIndex < 0 || newIndex >= section.questions.length) return;

            const temp = section.questions[index];
            section.questions[index] = section.questions[newIndex];
            section.questions[newIndex] = temp;
            renderSections();
        }

        function updateSectionTitle(sectionId, title) {
            const section = paperData.sections.find(s => s.id === sectionId);
            if (section) {
                section.title = title;
                renderSections();
            }
        }

        function updateQuestionMarks(marks) {
            const section = paperData.sections.find(s => s.id === selectedSectionId);
            const question = section?.questions.find(q => q.id === selectedQuestionId);
            if (question) {
                question.marks = parseInt(marks) || 1;
                renderSections();
            }
        }


        function updateOption(i, val) {
            const section = paperData.sections.find(s => s.id === selectedSectionId);
            const question = section?.questions.find(q => q.id === selectedQuestionId);
            if (question && question.options) {
                question.options[i] = val;
                renderSections();
            }
        }

        function addOption() {
            const section = paperData.sections.find(s => s.id === selectedSectionId);
            const question = section?.questions.find(q => q.id === selectedQuestionId);
            if (question && question.options) {
                question.options.push(`Option ${question.options.length + 1}`);
                renderPropertiesPanel();
            }
        }

        function removeOption(i) {
            const section = paperData.sections.find(s => s.id === selectedSectionId);
            const question = section?.questions.find(q => q.id === selectedQuestionId);
            if (question && question.options) {
                question.options.splice(i, 1);
                renderPropertiesPanel();
                renderSections();
            }
        }

        function updateCorrectOption(i, checked) {
            const section = paperData.sections.find(s => s.id === selectedSectionId);
            const question = section?.questions.find(q => q.id === selectedQuestionId);
            if (question) {
                if (question.type === 'mcq-single') {
                    question.correctAnswer = checked ? i : null;
                } else {
                    if (!Array.isArray(question.correctAnswer)) question.correctAnswer = [];
                    if (checked) {
                        if (!question.correctAnswer.includes(i)) question.correctAnswer.push(i);
                    } else {
                        question.correctAnswer = question.correctAnswer.filter(idx => idx !== i);
                    }
                }
                renderPropertiesPanel();
            }
        }

        function updateCorrectAnswer(val) {
            const section = paperData.sections.find(s => s.id === selectedSectionId);
            const question = section?.questions.find(q => q.id === selectedQuestionId);
            if (question) {
                question.correctAnswer = val;
                renderPropertiesPanel();
            }
        }

        function updateMatchPair(i, side, val) {
            const section = paperData.sections.find(s => s.id === selectedSectionId);
            const question = section?.questions.find(q => q.id === selectedQuestionId);
            if (question && question.matchPairs) {
                question.matchPairs[i][side] = val;
                renderSections();
            }
        }

        function addMatchPair() {
            const section = paperData.sections.find(s => s.id === selectedSectionId);
            const question = section?.questions.find(q => q.id === selectedQuestionId);
            if (question) {
                if (!question.matchPairs) question.matchPairs = [];
                question.matchPairs.push({ left: '', right: '' });
                renderPropertiesPanel();
            }
        }

        function removeMatchPair(i) {
            const section = paperData.sections.find(s => s.id === selectedSectionId);
            const question = section?.questions.find(q => q.id === selectedQuestionId);
            if (question && question.matchPairs) {
                question.matchPairs.splice(i, 1);
                renderPropertiesPanel();
                renderSections();
            }
        }

        function duplicateQuestion(sectionId, questionId) {
            const section = paperData.sections.find(s => s.id === sectionId);
            const question = section?.questions.find(q => q.id === questionId);
            if (!question) return;

            const duplicate = JSON.parse(JSON.stringify(question));
            duplicate.id = 'q_' + Date.now();
            section.questions.push(duplicate);
            renderSections();
            showToast('Logic Block Duplicated');
        }

        function populateMetadataModal() {
            document.getElementById('metaExamName').value = paperData.metadata.examName || '';
            document.getElementById('metaSubject').value = paperData.metadata.subject || '';
            document.getElementById('metaClass').value = paperData.metadata.classOrCourse || '';
            document.getElementById('metaInstitution').value = paperData.metadata.institutionName || '';
            document.getElementById('metaDuration').value = paperData.metadata.duration || '';
            document.getElementById('metaTotalMarks').value = paperData.metadata.totalMarks || 100;
        }

        function saveMetadata() {
            paperData.metadata.examName = document.getElementById('metaExamName').value || 'Untitled Paper';
            paperData.metadata.subject = document.getElementById('metaSubject').value;
            paperData.metadata.classOrCourse = document.getElementById('metaClass').value;
            paperData.metadata.institutionName = document.getElementById('metaInstitution').value;
            paperData.metadata.duration = document.getElementById('metaDuration').value;
            paperData.metadata.totalMarks = parseInt(document.getElementById('metaTotalMarks').value) || 100;

            // Update display
            document.getElementById('paperTitle').textContent = paperData.metadata.examName;
            document.getElementById('subjectDisplay').textContent = paperData.metadata.subject || 'GENERAL';
            document.getElementById('classDisplay').textContent = paperData.metadata.classOrCourse || 'ALL CLASSES';

            closeModal('metadataModal');
            showToast('System variables updated');
        }

        async function savePaper() {
            const btn = document.getElementById('saveBtn');
            btn.disabled = true;
            btn.innerHTML = '<i data-lucide="loader-2" class="spin"></i> Syncing...';
            lucide.createIcons();

            try {
                const response = await fetch(`${apiUrl}/api/papers/save.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: paperId,
                        examName: paperData.metadata.examName,
                        subject: paperData.metadata.subject,
                        class: paperData.metadata.classOrCourse,
                        data: paperData
                    })
                });

                const result = await response.json();
                if (response.ok) {
                    showToast('Paper persistence successful');
                } else {
                    showToast(result.error || 'Failed to sync', 'error');
                }
            } catch (error) {
                showToast('Persistence error', 'error');
            } finally {
                btn.disabled = false;
                btn.innerHTML = '<i data-lucide="save"></i> Save';
                lucide.createIcons();
            }
        }

        function toRoman(num) {
            const map = { m: 1000, cm: 900, d: 500, cd: 400, c: 100, xc: 90, l: 50, xl: 40, x: 10, ix: 9, v: 5, iv: 4, i: 1 };
            let roman = '';
            for (let i in map) {
                while (num >= map[i]) {
                    roman += i;
                    num -= map[i];
                }
            }
            return roman;
        }

        function renderPreview() {
            const container = document.getElementById('previewContent');
            container.innerHTML = '<div class="p-20 text-center font-black animate-pulse">COMPILING A4 VIRTUAL PAGES...</div>';

            let grandTotal = 0;
            paperData.sections.forEach(s => s.questions.forEach(q => grandTotal += (parseInt(q.marks) || 0)));

            const blocks = [];
            blocks.push(`
                <div class="preview-header">
                    <h2>${escapeHtml(paperData.metadata.institutionName || 'INSTITUTION NAME')}</h2>
                    <h1>${escapeHtml(paperData.metadata.examName || 'EXAMINATION')}</h1>
                    <div class="preview-meta">
                        <span>Subject: ${escapeHtml(paperData.metadata.subject || 'N/A')}</span>
                        <span>Class: ${escapeHtml(paperData.metadata.classOrCourse || 'N/A')}</span>
                    </div>
                    <div class="preview-meta">
                        <span>Duration: ${escapeHtml(paperData.metadata.duration || '3 Hours')}</span>
                        <span>Max Marks: ${grandTotal}</span>
                    </div>
                </div>
            `);

            paperData.sections.forEach((section, si) => {
                const sectionTotal = section.questions.reduce((sum, q) => sum + (parseInt(q.marks) || 0), 0);
                blocks.push(`
                    <div class="preview-section-header mt-8">
                        <div class="preview-section-title">Q. ${si + 1}. ${escapeHtml(section.title)}</div>
                        <div class="preview-section-marks">[${sectionTotal}]</div>
                    </div>
                    ${section.description ? `<p class="section-desc">${escapeHtml(section.description)}</p>` : ''}
                    ${section.instructions ? `<p class="section-instr">${escapeHtml(section.instructions)}</p>` : ''}
                `);

                section.questions.forEach((q, qi) => {
                    let questionHtml = `
                        <div class="preview-question">
                            <div class="preview-q-main">
                                <span class="preview-q-number">(${toRoman(qi + 1)})</span>
                                <div class="preview-q-text">
                                    <div class="preview-q-type-label font-bold text-[10px] uppercase text-slate-500 mb-1">${q.type.replace('-', ' ')}</div>
                                    ${q.text}
                                    ${q.instructions ? `<div class="q-instr italic mt-1">(${escapeHtml(q.instructions)})</div>` : ''}
                                </div>
                            </div>
                            <div class="preview-q-marks-col">(${q.marks})</div>
                    `;
                    if ((q.type === 'mcq-single' || q.type === 'mcq-multiple') && q.options) {
                        questionHtml += `<div class="preview-options-grid">${q.options.map((opt, oi) => `<div class="preview-option">(${String.fromCharCode(97 + oi)}) ${escapeHtml(opt)}</div>`).join('')}</div>`;
                    }
                    if (q.type === 'true-false') {
                        questionHtml += `<div class="preview-options-grid"><div class="preview-option">(a) True</div><div class="preview-option">(b) False</div></div>`;
                    }
                    if (q.type === 'match-following' && q.matchPairs) {
                        questionHtml += `<div class="preview-match-grid">${q.matchPairs.map((pair, mi) => `
                            <div class="match-row">
                                <span>${mi + 1}. ${escapeHtml(pair.left)}</span>
                                <span>${String.fromCharCode(65 + mi)}. ${escapeHtml(pair.right)}</span>
                            </div>
                        `).join('')}</div>`;
                    }
                    if (q.type === 'fill-blanks') {
                        questionHtml += `<div class="mt-2 pl-14 italic text-sm text-slate-500">[ Ans: ____________________ ]</div>`;
                    }
                    questionHtml += `</div>`;
                    blocks.push(questionHtml);
                });
            });

            setTimeout(() => {
                container.innerHTML = '';
                let currentPageNum = 1;
                let currentHeight = 0;
                const PAGE_LIMIT = 980;

                const createPage = (num) => {
                    const page = document.createElement('div');
                    page.className = 'preview-page';
                    page.innerHTML = `<div class="page-content flex-1"></div><div class="mt-8 flex justify-center items-end border-t-2 border-black pt-4"><div class="font-bold text-sm">Page ${num}</div></div>`;
                    return page;
                };

                let currentPage = createPage(currentPageNum);
                container.appendChild(currentPage);
                let pageBody = currentPage.querySelector('.page-content');

                const scratch = document.createElement('div');
                scratch.style.cssText = "position:absolute; visibility:hidden; width:170mm; font-family:'Times New Roman',Times,serif; line-height:1.4;";
                document.body.appendChild(scratch);

                blocks.forEach(html => {
                    scratch.innerHTML = html;
                    const h = scratch.offsetHeight;
                    if (currentHeight + h > PAGE_LIMIT && currentHeight > 0) {
                        currentPageNum++;
                        currentPage = createPage(currentPageNum);
                        container.appendChild(currentPage);
                        pageBody = currentPage.querySelector('.page-content');
                        currentHeight = 0;
                    }
                    const blockEl = document.createElement('div');
                    blockEl.innerHTML = html;
                    pageBody.appendChild(blockEl);
                    currentHeight += h;
                });
                document.body.removeChild(scratch);
            }, 100);
        }

        function exportPDF() {
            showToast('PDF compilation in progress...', 'warning');
        }

        // Utility functions
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text || '';
            return div.innerHTML;
        }

        function stripHtml(html) {
            const div = document.createElement('div');
            div.innerHTML = html;
            return div.textContent || div.innerText || '';
        }

        function openModal(id) {
            document.getElementById(id).classList.add('active');
        }

        function closeModal(id) {
            document.getElementById(id).classList.remove('active');
        }

    </script>
</body>

</html>