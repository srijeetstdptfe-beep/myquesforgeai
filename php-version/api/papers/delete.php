<?php
/**
 * Delete Paper API
 */

require_once __DIR__ . '/../../includes/functions.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

if (!Session::isLoggedIn()) {
    jsonResponse(['error' => 'Unauthorized'], 401);
}

$input = getJsonInput();
$paperId = sanitize($input['id'] ?? $_GET['id'] ?? '');

if (empty($paperId)) {
    jsonResponse(['error' => 'Paper ID required'], 400);
}

$userId = Session::getUserId();

// Verify ownership
$paper = db()->fetch("SELECT id FROM papers WHERE id = ? AND user_id = ?", [$paperId, $userId]);
if (!$paper) {
    jsonResponse(['error' => 'Paper not found'], 404);
}

// Delete
db()->query("DELETE FROM papers WHERE id = ?", [$paperId]);

// Update paper count
db()->query("UPDATE users SET paper_count = GREATEST(0, paper_count - 1) WHERE id = ?", [$userId]);

jsonResponse([
    'success' => true,
    'message' => 'Paper deleted successfully'
]);
