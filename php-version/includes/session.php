<?php
/**
 * Session Management
 * Handles user authentication sessions
 */

require_once __DIR__ . '/config.php';

class Session
{
    public static function start()
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_set_cookie_params([
                'lifetime' => SESSION_LIFETIME,
                'path' => '/',
                'secure' => false, // Set to true in production with HTTPS
                'httponly' => true,
                'samesite' => 'Lax'
            ]);
            session_start();
        }
    }

    public static function set($key, $value)
    {
        $_SESSION[$key] = $value;
    }

    public static function get($key, $default = null)
    {
        return $_SESSION[$key] ?? $default;
    }

    public static function has($key)
    {
        return isset($_SESSION[$key]);
    }

    public static function remove($key)
    {
        unset($_SESSION[$key]);
    }

    public static function destroy()
    {
        session_destroy();
        $_SESSION = [];
    }

    public static function flash($key, $value = null)
    {
        if ($value !== null) {
            $_SESSION['_flash'][$key] = $value;
        } else {
            $flash = $_SESSION['_flash'][$key] ?? null;
            unset($_SESSION['_flash'][$key]);
            return $flash;
        }
    }

    public static function setFlash($key, $value)
    {
        $_SESSION['_flash'][$key] = $value;
    }

    public static function getFlash($key)
    {
        $flash = $_SESSION['_flash'][$key] ?? null;
        unset($_SESSION['_flash'][$key]);
        return $flash;
    }

    // User-specific methods
    public static function login($user)
    {
        self::set('user_id', $user['id']);
        self::set('user_email', $user['email']);
        self::set('user_name', $user['name']);
        self::set('user_role', $user['role']);
        self::set('user_plan', $user['plan']);
        self::set('logged_in', true);
    }

    public static function logout()
    {
        self::destroy();
    }

    public static function isLoggedIn()
    {
        return self::get('logged_in', false) === true;
    }

    public static function isAdmin()
    {
        return self::get('user_role') === 'ADMIN';
    }

    public static function getUserId()
    {
        return self::get('user_id');
    }

    public static function getUser()
    {
        if (!self::isLoggedIn()) {
            return null;
        }
        return [
            'id' => self::get('user_id'),
            'email' => self::get('user_email'),
            'name' => self::get('user_name'),
            'role' => self::get('user_role'),
            'plan' => self::get('user_plan')
        ];
    }

    public static function requireLogin($redirectTo = null)
    {
        if (!self::isLoggedIn()) {
            $url = $redirectTo ?? APP_URL . '/login.php';
            header("Location: $url");
            exit;
        }
    }

    public static function requireAdmin($redirectTo = null)
    {
        if (!self::isAdmin()) {
            $url = $redirectTo ?? APP_URL . '/dashboard.php';
            header("Location: $url");
            exit;
        }
    }
}

// Auto-start session
Session::start();
