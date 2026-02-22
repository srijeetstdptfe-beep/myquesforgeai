<?php
/**
 * Send OTP API
 * Generates and sends OTP to email
 */

require_once __DIR__ . '/../../includes/functions.php';
require_once __DIR__ . '/../../includes/mail.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

$input = getJsonInput();
$email = sanitize($input['email'] ?? '');

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['error' => 'Valid email is required'], 400);
}

// Check if user exists, if not create one
$user = getUserByEmail($email);
if (!$user) {
    // Create a new user with OTP login
    $userId = generateUUID();
    db()->insert('users', [
        'id' => $userId,
        'email' => $email,
        'password' => '', // No password for OTP-only users
        'name' => explode('@', $email)[0],
        'role' => 'USER',
        'plan' => 'FREE'
    ]);
    $user = getUserByEmail($email);
}

// Generate OTP
$otp = generateOTP();
$expiresAt = date('Y-m-d H:i:s', strtotime('+10 minutes'));

// Delete old OTPs for this email
db()->query("DELETE FROM email_otps WHERE email = ?", [$email]);

// Store new OTP
db()->insert('email_otps', [
    'id' => generateUUID(),
    'email' => $email,
    'code' => $otp,
    'expires_at' => $expiresAt
]);

// Send OTP via email
$emailSent = sendOtpEmail($email, $otp);

// Log for debugging
error_log("OTP for $email: $otp (Email sent: " . ($emailSent ? 'yes' : 'no') . ")");

$response = [
    'success' => true,
    'message' => $emailSent ? 'OTP sent successfully' : 'OTP generated (check toast for code)'
];

// Include OTP in response for development/testing
if (!$emailSent) {
    $response['debug_otp'] = $otp;
}

jsonResponse($response);
