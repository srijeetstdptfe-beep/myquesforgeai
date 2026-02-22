<?php
/**
 * Newsletter Subscribe API
 */

require_once __DIR__ . '/../../includes/functions.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

$input = getJsonInput();
$email = sanitize($input['email'] ?? '');

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['error' => 'Valid email is required'], 400);
}

// Check if already subscribed
$existing = db()->fetch("SELECT id FROM newsletter_subscribers WHERE email = ?", [$email]);
if ($existing) {
    jsonResponse(['error' => 'Already subscribed'], 400);
}

// Add subscriber
db()->insert('newsletter_subscribers', [
    'id' => generateUUID(),
    'email' => $email
]);

jsonResponse([
    'success' => true,
    'message' => 'Successfully subscribed to newsletter'
]);
