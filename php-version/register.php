<?php
/**
 * Register Page
 */

require_once __DIR__ . '/includes/session.php';
if (Session::isLoggedIn()) {
    header('Location: ' . APP_URL . '/dashboard.php');
    exit;
}

$pageTitle = 'Create Account';
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

    .password-requirements {
        font-size: 0.75rem;
        color: var(--slate-400);
        margin-top: 0.5rem;
    }
</style>

<div class="auth-page">
    <div class="auth-container">
        <div class="auth-header">
            <div class="auth-icon">
                <i data-lucide="user-plus" style="width: 24px; height: 24px; color: white;"></i>
            </div>
            <h1 class="auth-title">Join PaperCraft</h1>
            <p class="auth-subtitle">Create your free account</p>
        </div>

        <div class="auth-form">
            <form id="registerForm">
                <?= csrfField() ?>

                <div class="form-group">
                    <label class="form-label">
                        <i data-lucide="user"
                            style="width: 12px; height: 12px; display: inline; margin-right: 6px;"></i>
                        Full Name
                    </label>
                    <input type="text" name="name" class="form-input" placeholder="John Doe" required>
                </div>

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
                    <input type="password" name="password" class="form-input" placeholder="Create a secure password"
                        required minlength="6">
                    <p class="password-requirements">Minimum 6 characters</p>
                </div>

                <div class="form-group">
                    <label class="form-label">
                        <i data-lucide="lock"
                            style="width: 12px; height: 12px; display: inline; margin-right: 6px;"></i>
                        Confirm Password
                    </label>
                    <input type="password" name="confirmPassword" class="form-input" placeholder="Repeat your password"
                        required>
                </div>

                <button type="submit" class="btn w-full h-14" style="font-size: 0.875rem;">
                    Create Account
                    <i data-lucide="arrow-right" style="width: 16px; height: 16px; margin-left: 8px;"></i>
                </button>
            </form>
        </div>

        <div class="auth-footer">
            Already have an account? <a href="<?= APP_URL ?>/login.php">Sign in</a>
        </div>
    </div>
</div>

<script>
    document.getElementById('registerForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const form = this;
        const formData = new FormData(form);

        // Validate passwords match
        if (formData.get('password') !== formData.get('confirmPassword')) {
            showToast('Passwords do not match', 'error');
            return;
        }

        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;

        btn.disabled = true;
        btn.innerHTML = '<i data-lucide="loader-2" class="spin" style="width: 16px; height: 16px;"></i> Creating account...';
        lucide.createIcons();

        try {
            const response = await fetch('<?= APP_URL ?>/api/auth/register.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.get('name'),
                    email: formData.get('email'),
                    password: formData.get('password'),
                    csrf_token: formData.get('csrf_token')
                })
            });

            const data = await response.json();

            if (response.ok) {
                showToast('Account created! Redirecting to login...');
                setTimeout(() => {
                    window.location.href = '<?= APP_URL ?>/login.php';
                }, 1500);
            } else {
                showToast(data.error || 'Registration failed', 'error');
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