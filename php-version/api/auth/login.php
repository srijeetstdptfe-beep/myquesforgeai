<?php
/**
 * Login API Endpoint
 * Handles user authentication
 */

require_once __DIR__ . '/../../includes/functions.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

$input = getJsonInput();

// Validate input
if (empty($input['email']) || empty($input['password'])) {
    jsonResponse(['error' => 'Email and password are required'], 400);
}

$email = filter_var($input['email'], FILTER_SANITIZE_EMAIL);
$password = $input['password'];

// Find user
$user = getUserByEmail($email);

if (!$user) {
    jsonResponse(['error' => 'Invalid email or password'], 401);
}

// Verify password
if (!verifyPassword($password, $user['password'])) {
    jsonResponse(['error' => 'Invalid email or password'], 401);
}

// Login user
Session::login($user);

jsonResponse([
    'success' => true,
    'message' => 'Login successful',
    'user' => [
        'id' => $user['id'],
        'name' => $user['name'],
        'email' => $user['email'],
        'plan' => $user['plan']
    ]
]);
