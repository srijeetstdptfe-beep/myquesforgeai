<?php
/**
 * Logout Endpoint
 * Destroys user session
 */

require_once __DIR__ . '/../../includes/session.php';

Session::logout();

// Redirect to homepage
header('Location: ' . APP_URL . '/');
exit;
