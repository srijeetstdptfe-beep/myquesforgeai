<?php
/**
 * Privacy Policy
 */

$pageTitle = 'Privacy Policy';
require_once __DIR__ . '/templates/header.php';
?>

<div class="container" style="padding: 4rem 1.5rem; max-width: 800px;">
    <h1
        style="font-size: 2.5rem; font-weight: 900; text-transform: uppercase; letter-spacing: -0.05em; margin-bottom: 2rem;">
        Privacy Policy</h1>

    <div style="color: var(--slate-600); line-height: 1.8;">
        <p style="margin-bottom: 1.5rem;"><strong>Last updated:</strong>
            <?= date('F Y') ?>
        </p>

        <h2 style="font-size: 1.25rem; font-weight: 900; text-transform: uppercase; margin: 2rem 0 1rem;">1. Information
            We Collect</h2>
        <p style="margin-bottom: 1rem;">We collect information you provide directly: name, email address, and content
            you create. We also collect usage data to improve our service.</p>

        <h2 style="font-size: 1.25rem; font-weight: 900; text-transform: uppercase; margin: 2rem 0 1rem;">2. How We Use
            Your Information</h2>
        <p style="margin-bottom: 1rem;">We use your information to provide and improve our services, process payments,
            send important updates, and respond to your inquiries.</p>

        <h2 style="font-size: 1.25rem; font-weight: 900; text-transform: uppercase; margin: 2rem 0 1rem;">3. Data
            Storage</h2>
        <p style="margin-bottom: 1rem;">Your data is stored securely on our servers. We implement industry-standard
            security measures to protect your information.</p>

        <h2 style="font-size: 1.25rem; font-weight: 900; text-transform: uppercase; margin: 2rem 0 1rem;">4. Third-Party
            Services</h2>
        <p style="margin-bottom: 1rem;">We may use third-party services for payment processing and analytics. These
            services have their own privacy policies.</p>

        <h2 style="font-size: 1.25rem; font-weight: 900; text-transform: uppercase; margin: 2rem 0 1rem;">5. Your Rights
        </h2>
        <p style="margin-bottom: 1rem;">You can access, update, or delete your personal data by contacting us. You may
            also export your created content at any time.</p>

        <h2 style="font-size: 1.25rem; font-weight: 900; text-transform: uppercase; margin: 2rem 0 1rem;">6. Cookies
        </h2>
        <p style="margin-bottom: 1rem;">We use essential cookies for session management and authentication. No tracking
            cookies are used without your consent.</p>

        <h2 style="font-size: 1.25rem; font-weight: 900; text-transform: uppercase; margin: 2rem 0 1rem;">7. Contact Us
        </h2>
        <p style="margin-bottom: 1rem;">For privacy concerns, contact: validatoritinfoacademy@gmail.com</p>
    </div>
</div>

<?php require_once __DIR__ . '/templates/footer.php'; ?>