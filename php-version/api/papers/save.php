<?php
/**
 * Save Paper API
 * Saves or updates a paper in the database
 */

require_once __DIR__ . '/../../includes/functions.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

// Check authentication
if (!Session::isLoggedIn()) {
    jsonResponse(['error' => 'Unauthorized'], 401);
}

$userId = Session::getUserId();
$input = getJsonInput();

// Validate input
if (empty($input['id']) || empty($input['data'])) {
    jsonResponse(['error' => 'Paper ID and data are required'], 400);
}

$paperId = $input['id'];
$examName = sanitize($input['examName'] ?? 'Untitled Paper');
$subject = sanitize($input['subject'] ?? '');
$class = sanitize($input['class'] ?? '');
$data = json_encode($input['data']);

// Check if paper exists
$existingPaper = db()->fetch("SELECT id FROM papers WHERE id = ? AND user_id = ?", [$paperId, $userId]);

try {
    if ($existingPaper) {
        // Update existing paper
        db()->query(
            "UPDATE papers SET exam_name = ?, subject = ?, class = ?, data = ?, updated_at = NOW() WHERE id = ? AND user_id = ?",
            [$examName, $subject, $class, $data, $paperId, $userId]
        );
        jsonResponse(['success' => true, 'message' => 'Paper updated successfully']);
    } else {
        // Create new paper
        db()->insert('papers', [
            'id' => $paperId,
            'user_id' => $userId,
            'exam_name' => $examName,
            'subject' => $subject,
            'class' => $class,
            'data' => $data
        ]);

        // Increment paper count
        db()->query("UPDATE users SET manual_paper_count = manual_paper_count + 1 WHERE id = ?", [$userId]);

        jsonResponse(['success' => true, 'message' => 'Paper created successfully'], 201);
    }
} catch (Exception $e) {
    error_log("Paper save error: " . $e->getMessage());
    jsonResponse(['error' => 'Failed to save paper'], 500);
}
