<?php
/**
 * OTP Login Page
 * Login using email OTP
 */

require_once __DIR__ . '/includes/session.php';
if (Session::isLoggedIn()) {
    header('Location: ' . APP_URL . '/dashboard.php');
    exit;
}

$pageTitle = 'OTP Login';
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

    .otp-inputs {
        display: flex;
        gap: 0.75rem;
        justify-content: center;
        margin: 2rem 0;
    }

    .otp-input {
        width: 3.5rem;
        height: 4rem;
        text-align: center;
        font-size: 1.5rem;
        font-weight: 900;
        border: 2px solid var(--slate-200);
        transition: all 0.2s ease;
    }

    .otp-input:focus {
        border-color: var(--black);
        outline: none;
    }

    .step-indicator {
        display: flex;
        justify-content: center;
        gap: 0.75rem;
        margin-bottom: 2rem;
    }

    .step {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--slate-200);
        transition: all 0.2s ease;
    }

    .step.active {
        background: var(--black);
        width: 24px;
        border-radius: 4px;
    }

    .hidden {
        display: none;
    }

    .resend-timer {
        text-align: center;
        font-size: 0.75rem;
        color: var(--slate-400);
        margin-top: 1.5rem;
    }

    .resend-btn {
        background: none;
        border: none;
        color: var(--black);
        font-weight: 700;
        cursor: pointer;
        text-decoration: underline;
    }

    .resend-btn:disabled {
        color: var(--slate-300);
        cursor: not-allowed;
        text-decoration: none;
    }
</style>

<div class="auth-page">
    <div class="auth-container">
        <div class="auth-header">
            <div class="auth-icon">
                <i data-lucide="smartphone" style="width: 24px; height: 24px; color: white;"></i>
            </div>
            <h1 class="auth-title">OTP Login</h1>
            <p class="auth-subtitle">Passwordless authentication</p>
        </div>

        <div class="auth-form">
            <div class="step-indicator">
                <div class="step active" id="step1Dot"></div>
                <div class="step" id="step2Dot"></div>
            </div>

            <!-- Step 1: Email -->
            <form id="emailStep">
                <?= csrfField() ?>
                <div class="form-group">
                    <label class="form-label">
                        <i data-lucide="mail"
                            style="width: 12px; height: 12px; display: inline; margin-right: 6px;"></i>
                        Email Address
                    </label>
                    <input type="email" name="email" id="emailInput" class="form-input" placeholder="you@example.com"
                        required>
                </div>

                <button type="submit" class="btn w-full h-14" style="font-size: 0.875rem;">
                    Send OTP
                    <i data-lucide="arrow-right" style="width: 16px; height: 16px; margin-left: 8px;"></i>
                </button>
            </form>

            <!-- Step 2: OTP Verification -->
            <form id="otpStep" class="hidden">
                <p style="text-align: center; font-size: 0.875rem; color: var(--slate-500); margin-bottom: 1rem;">
                    Enter the 6-digit code sent to<br>
                    <strong id="sentEmail" style="color: var(--black);"></strong>
                </p>

                <div class="otp-inputs">
                    <input type="text" class="otp-input" maxlength="1" data-index="0">
                    <input type="text" class="otp-input" maxlength="1" data-index="1">
                    <input type="text" class="otp-input" maxlength="1" data-index="2">
                    <input type="text" class="otp-input" maxlength="1" data-index="3">
                    <input type="text" class="otp-input" maxlength="1" data-index="4">
                    <input type="text" class="otp-input" maxlength="1" data-index="5">
                </div>
                <input type="hidden" name="otp" id="otpValue">

                <button type="submit" class="btn w-full h-14" style="font-size: 0.875rem;">
                    Verify & Login
                    <i data-lucide="check" style="width: 16px; height: 16px; margin-left: 8px;"></i>
                </button>

                <div class="resend-timer">
                    <span id="timerText">Resend code in <span id="countdown">60</span>s</span>
                    <button type="button" id="resendBtn" class="resend-btn hidden" onclick="resendOTP()">Resend
                        Code</button>
                </div>
            </form>
        </div>

        <div class="auth-footer">
            <a href="<?= APP_URL ?>/login.php">← Back to Password Login</a>
        </div>
    </div>
</div>

<script>
    let userEmail = '';
    let countdownInterval;

    // Step 1: Send OTP
    document.getElementById('emailStep').addEventListener('submit', async function (e) {
        e.preventDefault();

        const btn = this.querySelector('button[type="submit"]');
        const email = document.getElementById('emailInput').value;

        btn.disabled = true;
        btn.innerHTML = '<i data-lucide="loader-2" class="spin" style="width: 16px; height: 16px;"></i> Sending...';
        lucide.createIcons();

        try {
            const response = await fetch('<?= APP_URL ?>/api/auth/send-otp.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, csrf_token: '<?= csrfToken() ?>' })
            });

            const data = await response.json();

            if (response.ok) {
                userEmail = email;
                document.getElementById('sentEmail').textContent = email;
                document.getElementById('emailStep').classList.add('hidden');
                document.getElementById('otpStep').classList.remove('hidden');
                document.getElementById('step1Dot').classList.remove('active');
                document.getElementById('step2Dot').classList.add('active');
                startCountdown();
                document.querySelector('.otp-input').focus();
                // Show OTP for testing (remove in production!)
                if (data.debug_otp) {
                    showToast('DEV: Your OTP is ' + data.debug_otp);
                } else {
                    showToast('OTP sent to your email!');
                }
            } else {
                showToast(data.error || 'Failed to send OTP', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('An error occurred: ' + error.message, 'error');
        } finally {
            btn.disabled = false;
            btn.innerHTML = 'Send OTP <i data-lucide="arrow-right" style="width: 16px; height: 16px; margin-left: 8px;"></i>';
            lucide.createIcons();
        }
    });

    // OTP Input handling
    document.querySelectorAll('.otp-input').forEach((input, index, inputs) => {
        input.addEventListener('input', function (e) {
            const value = e.target.value;
            if (value.length === 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
            updateOTPValue();
        });

        input.addEventListener('keydown', function (e) {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                inputs[index - 1].focus();
            }
        });

        input.addEventListener('paste', function (e) {
            e.preventDefault();
            const paste = (e.clipboardData || window.clipboardData).getData('text');
            const digits = paste.replace(/\D/g, '').slice(0, 6);
            digits.split('').forEach((digit, i) => {
                if (inputs[i]) inputs[i].value = digit;
            });
            updateOTPValue();
            if (digits.length === 6) inputs[5].focus();
        });
    });

    function updateOTPValue() {
        const otp = Array.from(document.querySelectorAll('.otp-input'))
            .map(input => input.value)
            .join('');
        document.getElementById('otpValue').value = otp;
    }

    // Step 2: Verify OTP
    document.getElementById('otpStep').addEventListener('submit', async function (e) {
        e.preventDefault();

        const otp = document.getElementById('otpValue').value;
        if (otp.length !== 6) {
            showToast('Please enter all 6 digits', 'error');
            return;
        }

        const btn = this.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.innerHTML = '<i data-lucide="loader-2" class="spin" style="width: 16px; height: 16px;"></i> Verifying...';
        lucide.createIcons();

        try {
            const response = await fetch('<?= APP_URL ?>/api/auth/verify-otp.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userEmail, otp, csrf_token: '<?= csrfToken() ?>' })
            });

            const data = await response.json();

            if (response.ok) {
                showToast('Login successful!');
                setTimeout(() => window.location.href = '<?= APP_URL ?>/dashboard.php', 1000);
            } else {
                showToast(data.error || 'Invalid OTP', 'error');
            }
        } catch (error) {
            showToast('An error occurred', 'error');
        } finally {
            btn.disabled = false;
            btn.innerHTML = 'Verify & Login <i data-lucide="check" style="width: 16px; height: 16px; margin-left: 8px;"></i>';
            lucide.createIcons();
        }
    });

    function startCountdown() {
        let seconds = 60;
        document.getElementById('countdown').textContent = seconds;
        document.getElementById('timerText').classList.remove('hidden');
        document.getElementById('resendBtn').classList.add('hidden');

        countdownInterval = setInterval(() => {
            seconds--;
            document.getElementById('countdown').textContent = seconds;
            if (seconds <= 0) {
                clearInterval(countdownInterval);
                document.getElementById('timerText').classList.add('hidden');
                document.getElementById('resendBtn').classList.remove('hidden');
            }
        }, 1000);
    }

    async function resendOTP() {
        try {
            const response = await fetch('<?= APP_URL ?>/api/auth/send-otp.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userEmail, csrf_token: '<?= csrfToken() ?>' })
            });

            if (response.ok) {
                showToast('New OTP sent!');
                startCountdown();
            } else {
                showToast('Failed to resend OTP', 'error');
            }
        } catch (error) {
            showToast('An error occurred', 'error');
        }
    }
</script>

<?php require_once __DIR__ . '/templates/footer.php'; ?>