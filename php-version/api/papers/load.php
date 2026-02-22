<?php
/**
 * Load Paper API
 * Fetches paper data by ID
 */

require_once __DIR__ . '/../../includes/functions.php';

header('Content-Type: application/json');

if (!Session::isLoggedIn()) {
    jsonResponse(['error' => 'Unauthorized'], 401);
}

$paperId = $_GET['id'] ?? null;
if (!$paperId) {
    jsonResponse(['error' => 'Paper ID required'], 400);
}

$userId = Session::getUserId();
$paper = db()->fetch(
    "SELECT * FROM papers WHERE id = ? AND user_id = ?",
    [$paperId, $userId]
);

if (!$paper) {
    jsonResponse(['error' => 'Paper not found'], 404);
}

$paperData = json_decode($paper['data'], true);

jsonResponse([
    'success' => true,
    'paper' => [
        'id' => $paper['id'],
        'examName' => $paper['exam_name'],
        'subject' => $paper['subject'],
        'class' => $paper['class'],
        'data' => $paperData,
        'createdAt' => $paper['created_at'],
        'updatedAt' => $paper['updated_at']
    ]
]);
