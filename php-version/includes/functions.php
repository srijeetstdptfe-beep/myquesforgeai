<?php
/**
 * Utility Functions
 * Helper functions used throughout the application
 */

require_once __DIR__ . '/session.php';
require_once __DIR__ . '/db.php';

/**
 * Generate a UUID v4
 */
function generateUUID()
{
    return sprintf(
        '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0xffff)
    );
}

/**
 * Sanitize input data
 */
function sanitize($data)
{
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

/**
 * Get JSON request body
 */
function getJsonInput()
{
    $input = file_get_contents('php://input');
    return json_decode($input, true) ?? [];
}

/**
 * Send JSON response
 */
function jsonResponse($data, $statusCode = 200)
{
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

/**
 * Get user by ID
 */
function getUserById($id)
{
    return db()->fetch("SELECT * FROM users WHERE id = ?", [$id]);
}

/**
 * Get user by email
 */
function getUserByEmail($email)
{
    return db()->fetch("SELECT * FROM users WHERE email = ?", [$email]);
}

/**
 * Update user data
 */
function updateUser($id, $data)
{
    $set = [];
    $params = [];
    foreach ($data as $key => $value) {
        $set[] = "$key = ?";
        $params[] = $value;
    }
    $params[] = $id;
    $sql = "UPDATE users SET " . implode(', ', $set) . " WHERE id = ?";
    return db()->query($sql, $params);
}

/**
 * Get plan limits for a user plan
 */
function getPlanLimits($plan)
{
    $limits = PLAN_LIMITS[$plan] ?? PLAN_LIMITS['FREE'];
    return $limits;
}

/**
 * Check if user can use AI features
 */
function canUseAI($user, $type = 'PAPER')
{
    $limits = getPlanLimits($user['plan']);

    if ($type === 'PAPER') {
        $usage = $user['ai_full_paper_usage'] ?? 0;
        $limit = $limits['aiFullPapers'];
        $extra = $user['extra_ai_full_papers'] ?? 0;
        return ($limit - $usage) + $extra > 0;
    } else {
        $usage = $user['ai_question_usage'] ?? 0;
        $limit = $limits['aiQuestions'];
        $extra = $user['extra_ai_questions'] ?? 0;
        return ($limit - $usage) + $extra > 0;
    }
}

/**
 * Check if user can export (clean PDF/DOCX)
 */
function canExport($user)
{
    $limits = getPlanLimits($user['plan']);
    if ($limits['exports']) {
        return true;
    }
    return ($user['extra_exports'] ?? 0) > 0;
}

/**
 * Format date for display
 */
function formatDate($date, $format = 'M d, Y')
{
    if (!$date)
        return 'N/A';
    return date($format, strtotime($date));
}

/**
 * Hash password
 */
function hashPassword($password)
{
    return password_hash($password, PASSWORD_BCRYPT, ['cost' => 10]);
}

/**
 * Verify password
 */
function verifyPassword($password, $hash)
{
    return password_verify($password, $hash);
}

/**
 * Generate OTP code
 */
function generateOTP()
{
    return str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
}

/**
 * Log audit action
 */
function logAudit($adminEmail, $action, $targetId, $details)
{
    db()->insert('audit_logs', [
        'id' => generateUUID(),
        'admin_email' => $adminEmail,
        'action' => $action,
        'target_id' => $targetId,
        'details' => $details
    ]);
}

/**
 * Check if request is AJAX
 */
function isAjax()
{
    return !empty($_SERVER['HTTP_X_REQUESTED_WITH']) &&
        strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
}

/**
 * Redirect with flash message
 */
function redirect($url, $message = null, $type = 'success')
{
    if ($message) {
        Session::flash('message', ['text' => $message, 'type' => $type]);
    }
    header("Location: $url");
    exit;
}

/**
 * Asset URL helper
 */
function asset($path)
{
    return APP_URL . '/assets/' . ltrim($path, '/');
}

/**
 * CSRF Token generation and validation
 */
function csrfToken()
{
    if (!Session::has('csrf_token')) {
        Session::set('csrf_token', bin2hex(random_bytes(32)));
    }
    return Session::get('csrf_token');
}

function csrfField()
{
    return '<input type="hidden" name="csrf_token" value="' . csrfToken() . '">';
}

function validateCsrf()
{
    $token = $_POST['csrf_token'] ?? $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    return hash_equals(Session::get('csrf_token', ''), $token);
}

/**
 * Universal HTTP Request Helper with cURL fallback
 */
function httpRequest($url, $method = 'GET', $headers = [], $data = null)
{
    $content = is_array($data) ? json_encode($data) : $data;

    // Add default headers if missing
    $hasUA = false;
    foreach ($headers as $h) {
        if (stripos($h, 'User-Agent') !== false)
            $hasUA = true;
    }
    if (!$hasUA)
        $headers[] = 'User-Agent: PaperCraft/1.0';

    if (function_exists('curl_init')) {
        $ch = curl_init();
        $options = [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_TIMEOUT => 60,
            CURLOPT_SSL_VERIFYPEER => false // Added for compatibility
        ];
        if ($content) {
            $options[CURLOPT_POSTFIELDS] = $content;
        }
        curl_setopt_array($ch, $options);
        $response = curl_exec($ch);
        curl_close($ch);
        return $response;
    } else {
        // Fallback to file_get_contents with more robust options
        $options = [
            'http' => [
                'method' => $method,
                'header' => implode("\r\n", $headers) . "\r\n",
                'content' => $content,
                'timeout' => 60,
                'ignore_errors' => true
            ],
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false
            ]
        ];
        $context = stream_context_create($options);
        return @file_get_contents($url, false, $context);
    }
}
