<?php
/**
 * Refund Policy
 */

$pageTitle = 'Refund Policy';
require_once __DIR__ . '/templates/header.php';
?>

<div class="container" style="padding: 4rem 1.5rem; max-width: 800px;">
    <h1
        style="font-size: 2.5rem; font-weight: 900; text-transform: uppercase; letter-spacing: -0.05em; margin-bottom: 2rem;">
        Refund Policy</h1>

    <div style="color: var(--slate-600); line-height: 1.8;">
        <p style="margin-bottom: 1.5rem;"><strong>Last updated:</strong>
            <?= date('F Y') ?>
        </p>

        <h2 style="font-size: 1.25rem; font-weight: 900; text-transform: uppercase; margin: 2rem 0 1rem;">1.
            Subscription Plans</h2>
        <p style="margin-bottom: 1rem;">Monthly and annual subscriptions are non-refundable once the billing period has
            started. You may cancel anytime to prevent future charges.</p>

        <h2 style="font-size: 1.25rem; font-weight: 900; text-transform: uppercase; margin: 2rem 0 1rem;">2.
            Pay-As-You-Go Credits</h2>
        <p style="margin-bottom: 1rem;">PAYG credits are non-refundable once purchased. Credits do not expire and remain
            available until used.</p>

        <h2 style="font-size: 1.25rem; font-weight: 900; text-transform: uppercase; margin: 2rem 0 1rem;">3. Exceptions
        </h2>
        <p style="margin-bottom: 1rem;">Refunds may be considered for:</p>
        <ul style="margin-left: 1.5rem; margin-bottom: 1rem;">
            <li>Technical issues that prevent service delivery</li>
            <li>Duplicate charges due to payment errors</li>
            <li>Account setup failures within 48 hours</li>
        </ul>

        <h2 style="font-size: 1.25rem; font-weight: 900; text-transform: uppercase; margin: 2rem 0 1rem;">4. Request
            Process</h2>
        <p style="margin-bottom: 1rem;">To request a refund, contact us within 7 days of the transaction with your
            payment details and reason for the request.</p>

        <h2 style="font-size: 1.25rem; font-weight: 900; text-transform: uppercase; margin: 2rem 0 1rem;">5. Processing
            Time</h2>
        <p style="margin-bottom: 1rem;">Approved refunds are processed within 5-10 business days and will be credited to
            your original payment method.</p>

        <h2 style="font-size: 1.25rem; font-weight: 900; text-transform: uppercase; margin: 2rem 0 1rem;">6. Contact
        </h2>
        <p style="margin-bottom: 1rem;">For refund requests: validatoritinfoacademy@gmail.com or WhatsApp +91 9545214074
        </p>
    </div>
</div>

<?php require_once __DIR__ . '/templates/footer.php'; ?>