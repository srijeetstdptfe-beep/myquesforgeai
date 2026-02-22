<?php
/**
 * Terms of Service
 */

$pageTitle = 'Terms of Service';
require_once __DIR__ . '/templates/header.php';
?>

<div class="container" style="padding: 4rem 1.5rem; max-width: 800px;">
    <h1
        style="font-size: 2.5rem; font-weight: 900; text-transform: uppercase; letter-spacing: -0.05em; margin-bottom: 2rem;">
        Terms of Service</h1>

    <div style="color: var(--slate-600); line-height: 1.8;">
        <p style="margin-bottom: 1.5rem;"><strong>Last updated:</strong>
            <?= date('F Y') ?>
        </p>

        <h2 style="font-size: 1.25rem; font-weight: 900; text-transform: uppercase; margin: 2rem 0 1rem;">1. Acceptance
            of Terms</h2>
        <p style="margin-bottom: 1rem;">By accessing and using PaperCraft, you agree to be bound by these Terms of
            Service. If you do not agree to these terms, please do not use our service.</p>

        <h2 style="font-size: 1.25rem; font-weight: 900; text-transform: uppercase; margin: 2rem 0 1rem;">2. Description
            of Service</h2>
        <p style="margin-bottom: 1rem;">PaperCraft is an online platform that enables educators to create professional
            question papers. Our services include manual paper creation and AI-assisted generation features.</p>

        <h2 style="font-size: 1.25rem; font-weight: 900; text-transform: uppercase; margin: 2rem 0 1rem;">3. User
            Accounts</h2>
        <p style="margin-bottom: 1rem;">You are responsible for maintaining the confidentiality of your account
            credentials. You agree to notify us immediately of any unauthorized use of your account.</p>

        <h2 style="font-size: 1.25rem; font-weight: 900; text-transform: uppercase; margin: 2rem 0 1rem;">4.
            Intellectual Property</h2>
        <p style="margin-bottom: 1rem;">Content you create using PaperCraft remains your intellectual property. You
            grant us a license to store and process your content for service delivery purposes only.</p>

        <h2 style="font-size: 1.25rem; font-weight: 900; text-transform: uppercase; margin: 2rem 0 1rem;">5. Payment
            Terms</h2>
        <p style="margin-bottom: 1rem;">Paid plans are billed according to your selected subscription period. All
            payments are processed securely and are non-refundable except as specified in our Refund Policy.</p>

        <h2 style="font-size: 1.25rem; font-weight: 900; text-transform: uppercase; margin: 2rem 0 1rem;">6. Prohibited
            Uses</h2>
        <p style="margin-bottom: 1rem;">You may not use our service for any illegal purposes or to generate
            inappropriate content. We reserve the right to terminate accounts that violate these terms.</p>

        <h2 style="font-size: 1.25rem; font-weight: 900; text-transform: uppercase; margin: 2rem 0 1rem;">7. Limitation
            of Liability</h2>
        <p style="margin-bottom: 1rem;">PaperCraft is provided "as is" without warranties of any kind. We are not liable
            for any damages arising from your use of the service.</p>

        <h2 style="font-size: 1.25rem; font-weight: 900; text-transform: uppercase; margin: 2rem 0 1rem;">8. Contact
        </h2>
        <p style="margin-bottom: 1rem;">For questions about these terms, contact us at: validatoritinfoacademy@gmail.com
        </p>
    </div>
</div>

<?php require_once __DIR__ . '/templates/footer.php'; ?>