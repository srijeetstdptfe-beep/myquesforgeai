<?php
/**
 * PDF Export API
 * Generates PDF from paper data
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

// Helper for Roman numerals
function roman($num)
{
    if ($num <= 0)
        return $num;
    $res = '';
    $romanArr = [
        'm' => 1000,
        'cm' => 900,
        'd' => 500,
        'cd' => 400,
        'c' => 100,
        'xc' => 90,
        'l' => 50,
        'xl' => 40,
        'x' => 10,
        'ix' => 9,
        'v' => 5,
        'iv' => 4,
        'i' => 1
    ];
    foreach ($romanArr as $roman => $value) {
        $matches = intval($num / $value);
        $res .= str_repeat($roman, $matches);
        $num = $num % $value;
    }
    return $res;
}

// Calculate total marks
$totalMarks = 0;
foreach ($sections as $section) {
    foreach ($section['questions'] ?? [] as $q) {
        $totalMarks += intval($q['marks'] ?? 0);
    }
}

// Generate HTML for PDF - SSC Style
$html = '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: "Times New Roman", Times, serif;
            font-size: 12pt;
            line-height: 1.4;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
            color: #000;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .institution {
            font-size: 14pt;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 5px;
        }
        .exam-name {
            font-size: 18pt;
            font-weight: bold;
            margin: 10px 0;
        }
        .meta-container {
            margin-top: 15px;
            font-weight: bold;
        }
        .meta-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
        }
        .section {
            margin-top: 40px;
        }
        .section-header {
            display: flex;
            justify-content: space-between;
            font-weight: bold;
            margin-bottom: 15px;
        }
        .section-title {
            font-size: 13pt;
            text-transform: none;
        }
        .section-marks {
            font-size: 13pt;
        }
        .question {
            margin-bottom: 25px;
            display: flex;
            page-break-inside: avoid;
        }
        .q-main {
            flex: 1;
            display: flex;
        }
        .q-number {
            font-weight: bold;
            width: 40px;
            flex-shrink: 0;
        }
        .q-content {
            flex: 1;
        }
        .q-marks-col {
            width: 50px;
            text-align: right;
            font-weight: bold;
            flex-shrink: 0;
        }
        .q-type-label {
            font-size: 9pt;
            font-weight: bold;
            text-transform: uppercase;
            color: #666;
            margin-bottom: 3px;
        }
        .options-grid {
            margin-top: 10px;
            margin-left: 40px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-gap: 5px 20px;
        }
        .option {
            font-size: 12pt;
        }
        .match-grid {
            margin-top: 15px;
            margin-left: 40px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-gap: 10px 40px;
        }
        .match-row {
            display: flex;
            justify-content: space-between;
        }
        .footer {
            margin-top: 50px;
            display: flex;
            justify-content: space-between;
            border-top: 1px solid #000;
            padding-top: 10px;
            font-weight: bold;
        }
        .box-code {
            border: 2px solid #000;
            padding: 2px 5px;
            font-size: 10pt;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="institution">' . htmlspecialchars($metadata['institutionName'] ?? 'INSTITUTION NAME') . '</div>
        <div class="exam-name">' . htmlspecialchars($metadata['examName'] ?? 'EXAMINATION') . '</div>
        <div class="meta-container">
            <div class="meta-row">
                <span>Subject: ' . htmlspecialchars($metadata['subject'] ?? 'N/A') . '</span>
                <span>Class: ' . htmlspecialchars($metadata['classOrCourse'] ?? 'N/A') . '</span>
            </div>
            <div class="meta-row">
                <span>Duration: ' . htmlspecialchars($metadata['duration'] ?? '3 Hours') . '</span>
                <span>Max Marks: ' . $totalMarks . '</span>
            </div>
        </div>
    </div>';

foreach ($sections as $si => $section) {
    $sectionMarks = 0;
    foreach ($section['questions'] ?? [] as $sq) {
        $sectionMarks += intval($sq['marks'] ?? 0);
    }

    $html .= '<div class="section">
        <div class="section-header">
            <div class="section-title">Q. ' . ($si + 1) . '. ' . htmlspecialchars($section['title'] ?? 'Section') . '</div>
            <div class="section-marks">[' . $sectionMarks . ']</div>
        </div>';

    foreach ($section['questions'] ?? [] as $qi => $question) {
        $html .= '<div class="question">
            <div class="q-main">
                <div class="q-number">(' . roman($qi + 1) . ')</div>
                <div class="q-content">
                    <div class="q-type-label">' . str_replace('-', ' ', strtoupper($question['type'])) . '</div>
                    <div class="q-text">' . ($question['text'] ?? '') . '</div>';

        if (($question['type'] === 'mcq-single' || $question['type'] === 'mcq-multiple') && !empty($question['options'])) {
            $html .= '<div class="options-grid">';
            foreach ($question['options'] as $oi => $opt) {
                $html .= '<div class="option">(' . chr(97 + $oi) . ') ' . htmlspecialchars($opt) . '</div>';
            }
            $html .= '</div>';
        }

        if ($question['type'] === 'true-false') {
            $html .= '<div class="options-grid">';
            $html .= '<div class="option">(a) True</div>';
            $html .= '<div class="option">(b) False</div>';
            $html .= '</div>';
        }

        if ($question['type'] === 'match-following' && !empty($question['matchPairs'])) {
            $html .= '<div class="match-grid">';
            foreach ($question['matchPairs'] as $mi => $pair) {
                $html .= '<div class="match-row">
                    <span>' . ($mi + 1) . '. ' . htmlspecialchars($pair['left'] ?? '') . '</span>
                    <span>' . chr(65 + $mi) . '. ' . htmlspecialchars($pair['right'] ?? '') . '</span>
                </div>';
            }
            $html .= '</div>';
        }

        if ($question['type'] === 'fill-blanks') {
            $html .= '<div style="margin-top: 5px; margin-left: 40px; font-style: italic; color: #666;">
                [ Ans: ____________________ ]
            </div>';
        }

        $html .= '</div>
            </div>
            <div class="q-marks-col">(' . ($question['marks'] ?? 1) . ')</div>
        </div>';
    }

    $html .= '</div>';
}

$html .= '<div class="footer" style="justify-content: center;">
    <div>Page 1</div>
</div>';

$html .= '</body></html>';

// Check user plan for watermark
$user = getUserById($userId);
$needsWatermark = !in_array($user['plan'] ?? 'FREE', ['MONTHLY', 'ANNUAL', 'PAYG']);

if ($needsWatermark) {
    $html .= '<div class="watermark">Generated with PaperCraft</div>';
}

$html .= '</body></html>';

// For now, output as HTML (PDF library can be added later)
// In production, use mPDF or TCPDF

header('Content-Type: text/html; charset=utf-8');
header('Content-Disposition: inline; filename="' . sanitize($metadata['examName'] ?? 'Paper') . '.html"');

echo $html;

// To convert to actual PDF, install mPDF via Composer:
// composer require mpdf/mpdf
// Then use:
// $mpdf = new \Mpdf\Mpdf();
// $mpdf->WriteHTML($html);
// $mpdf->Output('paper.pdf', 'D');
