<?php
/**
 * DOCX Export API
 * Generates Word document from paper data
 * Note: Requires PHPWord library - install via: composer require phpoffice/phpword
 */

require_once __DIR__ . '/../../includes/functions.php';

if (!Session::isLoggedIn()) {
    header('Location: ' . APP_URL . '/login.php');
    exit;
}

$paperId = $_GET['id'] ?? null;
if (!$paperId) {
    die('Paper ID required');
}

$userId = Session::getUserId();
$paper = db()->fetch("SELECT * FROM papers WHERE id = ? AND user_id = ?", [$paperId, $userId]);

if (!$paper) {
    die('Paper not found');
}

$paperData = json_decode($paper['data'], true);
$metadata = $paperData['metadata'] ?? [];
$sections = $paperData['sections'] ?? [];

// Calculate total marks
$totalMarks = 0;
foreach ($sections as $section) {
    foreach ($section['questions'] ?? [] as $q) {
        $totalMarks += $q['marks'] ?? 0;
    }
}

// Check if PHPWord is available
$phpWordAvailable = class_exists('PhpOffice\PhpWord\PhpWord');

if (!$phpWordAvailable) {
    // Fallback: Generate as RTF (Rich Text Format) which Word can open
    header('Content-Type: application/rtf');
    header('Content-Disposition: attachment; filename="' . sanitize($metadata['examName'] ?? 'Paper') . '.rtf"');

    $rtf = "{\\rtf1\\ansi\\deff0\n";
    $rtf .= "{\\fonttbl{\\f0 Times New Roman;}}\n";

    // Header
    $rtf .= "\\pard\\qc\\b\\fs32 " . ($metadata['institutionName'] ?? 'Institution') . "\\par\n";
    $rtf .= "\\pard\\qc\\b\\fs28 " . ($metadata['examName'] ?? 'Examination') . "\\par\n";
    $rtf .= "\\pard\\qc\\fs20 Subject: " . ($metadata['subject'] ?? 'N/A') .
        " | Class: " . ($metadata['classOrCourse'] ?? 'N/A') .
        " | Duration: " . ($metadata['duration'] ?? '3 Hours') .
        " | Max Marks: " . $totalMarks . "\\par\n";
    $rtf .= "\\par\n";

    $qCounter = 1;
    foreach ($sections as $section) {
        $rtf .= "\\pard\\b\\fs24 " . ($section['title'] ?? 'Section') . "\\b0\\par\n";
        $rtf .= "\\par\n";

        foreach ($section['questions'] ?? [] as $question) {
            $text = strip_tags($question['text'] ?? '');
            $marks = $question['marks'] ?? 1;

            $rtf .= "\\pard Q$qCounter. $text [$marks marks]\\par\n";

            if ($question['type'] === 'MCQ' && !empty($question['options'])) {
                foreach ($question['options'] as $i => $opt) {
                    $rtf .= "\\pard\\li720 " . chr(65 + $i) . ") $opt\\par\n";
                }
            }

            $rtf .= "\\par\n";
            $qCounter++;
        }
    }

    $rtf .= "}";
    echo $rtf;
    exit;
}

// If PHPWord is available, use it
use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\IOFactory;

$phpWord = new PhpWord();
$phpWord->setDefaultFontName('Times New Roman');
$phpWord->setDefaultFontSize(12);

$section = $phpWord->addSection();

// Header
$section->addText($metadata['institutionName'] ?? 'Institution', ['bold' => true, 'size' => 16], ['alignment' => 'center']);
$section->addText($metadata['examName'] ?? 'Examination', ['bold' => true, 'size' => 14], ['alignment' => 'center']);
$section->addText(
    "Subject: " . ($metadata['subject'] ?? 'N/A') .
    " | Class: " . ($metadata['classOrCourse'] ?? 'N/A') .
    " | Duration: " . ($metadata['duration'] ?? '3 Hours') .
    " | Max Marks: " . $totalMarks,
    ['size' => 10],
    ['alignment' => 'center']
);
$section->addTextBreak(2);

$qCounter = 1;
foreach ($sections as $sec) {
    $section->addText($sec['title'] ?? 'Section', ['bold' => true, 'size' => 12]);
    $section->addTextBreak();

    foreach ($sec['questions'] ?? [] as $question) {
        $text = strip_tags($question['text'] ?? '');
        $marks = $question['marks'] ?? 1;

        $section->addText("Q$qCounter. $text [$marks marks]");

        if ($question['type'] === 'MCQ' && !empty($question['options'])) {
            foreach ($question['options'] as $i => $opt) {
                $section->addText("    " . chr(65 + $i) . ") $opt");
            }
        }

        $section->addTextBreak();
        $qCounter++;
    }
}

// Save and output
$filename = sanitize($metadata['examName'] ?? 'Paper') . '.docx';
header('Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document');
header('Content-Disposition: attachment; filename="' . $filename . '"');

$writer = IOFactory::createWriter($phpWord, 'Word2007');
$writer->save('php://output');
