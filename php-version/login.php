<?php
/**
 * Login Page
 */

// Redirect if already logged in
require_once __DIR__ . '/includes/session.php';
if (Session::isLoggedIn()) {
    header('Location: ' . APP_URL . '/dashboard.php');
    exit;
}

$pageTitle = 'Login';
require_once __DIR__ . '/templates/header.php';
?>

<style>
    .auth-page {
        min-height: calc(100vh - 200px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4rem 1.5rem;
    }

    .auth-container {
        width: 100%;
        max-width: 480px;
    }

    .auth-header {
        text-align: center;
        margin-bottom: 3rem;
    }

    .auth-icon {
        width: 4rem;
        height: 4rem;
        background: var(--black);
        border-radius: 0.75rem;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1.5rem;
    }

    .auth-title {
        font-size: 2rem;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: -0.05em;
        margin-bottom: 0.5rem;
    }

    .auth-subtitle {
        font-size: 0.75rem;
        color: var(--slate-400);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.15em;
    }

    .auth-form {
        background: var(--white);
        border: 2px solid var(--slate-100);
        padding: 2.5rem;
    }

    .auth-divider {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin: 2rem 0;
        color: var(--slate-400);
        font-size: 0.625rem;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.15em;
    }

    .auth-divider::before,
    .auth-divider::after {
        content: '';
        flex: 1;
        height: 1px;
        background: var(--slate-200);
    }

    .auth-footer {
        text-align: center;
        margin-top: 2rem;
        font-size: 0.875rem;
        color: var(--slate-500);
    }

    .auth-footer a {
        color: var(--black);
        font-weight: 700;
    }

    .auth-footer a:hover {
        text-decoration: underline;
    }

    .otp-btn {
        width: 100%;
        height: 3.5rem;
        border: 2px solid var(--slate-200);
        background: var(--white);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        font-size: 0.875rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .otp-btn:hover {
        border-color: var(--black);
    }
</style>

<div class="auth-page">
    <div class="auth-container">
        <div class="auth-header">
            <div class="auth-icon">
                <i data-lucide="log-in" style="width: 24px; height: 24px; color: white;"></i>
            </div>
            <h1 class="auth-title">Welcome Back</h1>
            <p class="auth-subtitle">Sign in to continue</p>
        </div>

        <div class="auth-form">
            <form id="loginForm">
                <?= csrfField() ?>

                <div class="form-group">
                    <label class="form-label">
                        <i data-lucide="mail"
                            style="width: 12px; height: 12px; display: inline; margin-right: 6px;"></i>
                        Email Address
                    </label>
                    <input type="email" name="email" class="form-input" placeholder="you@example.com" required>
                </div>

                <div class="form-group">
                    <label class="form-label">
                        <i data-lucide="lock"
                            style="width: 12px; height: 12px; display: inline; margin-right: 6px;"></i>
                        Password
                    </label>
                    <input type="password" name="password" class="form-input" placeholder="Enter your password"
                        required>
                </div>

                <button type="submit" class="btn w-full h-14" style="font-size: 0.875rem;">
                    Sign In
                    <i data-lucide="arrow-right" style="width: 16px; height: 16px; margin-left: 8px;"></i>
                </button>
            </form>

            <div class="auth-divider">or continue with</div>

            <a href="<?= APP_URL ?>/otp-login.php" class="otp-btn">
                <i data-lucide="smartphone" style="width: 18px; height: 18px;"></i>
                Login with OTP
            </a>
        </div>

        <div class="auth-footer">
            Don't have an account? <a href="<?= APP_URL ?>/register.php">Create one</a>
        </div>
    </div>
</div>

<script>
    document.getElementById('loginForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const form = this;
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;

        btn.disabled = true;
        btn.innerHTML = '<i data-lucide="loader-2" class="spin" style="width: 16px; height: 16px;"></i> Signing in...';
        lucide.createIcons();

        try {
            const formData = new FormData(form);
            const response = await fetch('<?= APP_URL ?>/api/auth/login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.get('email'),
                    password: formData.get('password'),
                    csrf_token: formData.get('csrf_token')
                })
            });

            const data = await response.json();

            if (response.ok) {
                showToast('Login successful! Redirecting...');
                setTimeout(() => {
                    window.location.href = '<?= APP_URL ?>/dashboard.php';
                }, 1000);
            } else {
                showToast(data.error || 'Login failed', 'error');
            }
        } catch (error) {
            showToast('An error occurred. Please try again.', 'error');
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalText;
            lucide.createIcons();
        }
    });
</script>

<?php require_once __DIR__ . '/templates/footer.php'; ?>