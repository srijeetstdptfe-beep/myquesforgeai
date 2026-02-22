<?php
/**
 * Shipping Policy
 */

$pageTitle = 'Shipping Policy';
require_once __DIR__ . '/templates/header.php';
?>

<div class="container" style="padding: 4rem 1.5rem; max-width: 800px;">
    <h1
        style="font-size: 2.5rem; font-weight: 900; text-transform: uppercase; letter-spacing: -0.05em; margin-bottom: 2rem;">
        Shipping & Delivery Policy</h1>

    <div style="color: var(--slate-600); line-height: 1.8;">
        <p style="margin-bottom: 1.5rem;"><strong>Last updated:</strong>
            <?= date('F Y') ?>
        </p>

        <h2 style="font-size: 1.25rem; font-weight: 900; text-transform: uppercase; margin: 2rem 0 1rem;">1. Digital
            Products</h2>
        <p style="margin-bottom: 1rem;">PaperCraft is a digital service. All products and features are delivered
            electronically through your online account.</p>

        <h2 style="font-size: 1.25rem; font-weight: 900; text-transform: uppercase; margin: 2rem 0 1rem;">2. Account
            Activation</h2>
        <p style="margin-bottom: 1rem;">Upon successful payment, your account will be upgraded within 24 hours. For most
            payments, activation is instant.</p>

        <h2 style="font-size: 1.25rem; font-weight: 900; text-transform: uppercase; margin: 2rem 0 1rem;">3. Credit
            Delivery</h2>
        <p style="margin-bottom: 1rem;">Purchased credits and features are added to your account immediately upon
            payment confirmation.</p>

        <h2 style="font-size: 1.25rem; font-weight: 900; text-transform: uppercase; margin: 2rem 0 1rem;">4. Export
            Downloads</h2>
        <p style="margin-bottom: 1rem;">Generated PDF and DOCX files are available for immediate download from your
            dashboard after creation.</p>

        <h2 style="font-size: 1.25rem; font-weight: 900; text-transform: uppercase; margin: 2rem 0 1rem;">5. Support
        </h2>
        <p style="margin-bottom: 1rem;">If you experience delays in delivery, please contact us immediately for
            assistance.</p>

        <h2 style="font-size: 1.25rem; font-weight: 900; text-transform: uppercase; margin: 2rem 0 1rem;">6. Contact
        </h2>
        <p style="margin-bottom: 1rem;">For delivery issues: validatoritinfoacademy@gmail.com or WhatsApp +91 9545214074
        </p>
    </div>
</div>

<?php require_once __DIR__ . '/templates/footer.php'; ?>