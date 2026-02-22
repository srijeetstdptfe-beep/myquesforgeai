<?php
/**
 * Verify OTP API
 * Validates OTP and logs user in
 */

require_once __DIR__ . '/../../includes/functions.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

$input = getJsonInput();
$email = sanitize($input['email'] ?? '');
$otp = sanitize($input['otp'] ?? '');

if (empty($email) || empty($otp)) {
    jsonResponse(['error' => 'Email and OTP are required'], 400);
}

if (strlen($otp) !== 6) {
    jsonResponse(['error' => 'OTP must be 6 digits'], 400);
}

// Find valid OTP
$otpRecord = db()->fetch(
    "SELECT * FROM email_otps WHERE email = ? AND code = ? AND expires_at > NOW() LIMIT 1",
    [$email, $otp]
);

if (!$otpRecord) {
    jsonResponse(['error' => 'Invalid or expired OTP'], 400);
}

// Delete used OTP
db()->query("DELETE FROM email_otps WHERE email = ?", [$email]);

// Get user
$user = getUserByEmail($email);
if (!$user) {
    jsonResponse(['error' => 'User not found'], 404);
}

// Login user
Session::login($user);

jsonResponse([
    'success' => true,
    'message' => 'Login successful',
    'user' => [
        'id' => $user['id'],
        'email' => $user['email'],
        'name' => $user['name'],
        'plan' => $user['plan']
    ]
]);
