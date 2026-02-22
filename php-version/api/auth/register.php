<?php
/**
 * Register API Endpoint
 * Handles user registration
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

$name = sanitize($input['name'] ?? '');
$email = filter_var($input['email'], FILTER_SANITIZE_EMAIL);
$password = $input['password'];

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['error' => 'Invalid email format'], 400);
}

// Validate password length
if (strlen($password) < 6) {
    jsonResponse(['error' => 'Password must be at least 6 characters'], 400);
}

// Check if user exists
$existingUser = getUserByEmail($email);
if ($existingUser) {
    jsonResponse(['error' => 'An account with this email already exists. Please login or use a different email.'], 400);
}

// Create user
$userId = generateUUID();
$hashedPassword = hashPassword($password);

try {
    db()->insert('users', [
        'id' => $userId,
        'name' => $name,
        'email' => $email,
        'password' => $hashedPassword,
        'role' => 'USER',
        'plan' => 'UNSET'
    ]);

    jsonResponse([
        'success' => true,
        'message' => 'Account created successfully'
    ], 201);

} catch (Exception $e) {
    error_log("Registration error: " . $e->getMessage());
    jsonResponse(['error' => 'Failed to create account. Please try again.'], 500);
}
