<?php
/**
 * Contact Page
 */

$pageTitle = 'Contact';
require_once __DIR__ . '/templates/header.php';
?>

<style>
    .contact-page {
        padding: 6rem 1.5rem;
    }

    .contact-header {
        text-align: center;
        margin-bottom: 4rem;
    }

    .contact-title {
        font-size: 2.5rem;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: -0.05em;
        margin-bottom: 1rem;
    }

    .contact-subtitle {
        color: var(--slate-500);
        font-weight: 500;
        max-width: 500px;
        margin: 0 auto;
    }

    .contact-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 2rem;
        max-width: 800px;
        margin: 0 auto 4rem;
    }

    .contact-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        padding: 2.5rem;
        border: 2px solid var(--slate-100);
        transition: all 0.3s ease;
        text-align: center;
    }

    .contact-card:hover {
        border-color: var(--black);
        transform: translateY(-4px);
    }

    .contact-card:hover .contact-icon {
        transform: scale(1.1);
    }

    .contact-icon {
        width: 4rem;
        height: 4rem;
        background: var(--black);
        color: var(--white);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.5rem;
        transition: transform 0.3s ease;
    }

    .contact-label {
        font-size: 1.25rem;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: -0.05em;
    }

    .contact-value {
        color: var(--slate-500);
        font-weight: 500;
    }

    @media (max-width: 768px) {
        .contact-grid {
            grid-template-columns: 1fr;
        }
    }
</style>

<div class="contact-page">
    <div class="container">
        <div class="contact-header">
            <h1 class="contact-title">Get in Touch</h1>
            <p class="contact-subtitle">We're here to help. Reach out through any of these channels.</p>
        </div>

        <div class="contact-grid">
            <a href="https://wa.me/919545214074" target="_blank" class="contact-card">
                <div class="contact-icon">
                    <i data-lucide="message-circle" style="width: 24px; height: 24px;"></i>
                </div>
                <h3 class="contact-label">WhatsApp</h3>
                <p class="contact-value">+91 95452 14074</p>
                <span class="badge badge-outline">Fastest Response</span>
            </a>

            <a href="mailto:validatoritinfoacademy@gmail.com" class="contact-card">
                <div class="contact-icon">
                    <i data-lucide="mail" style="width: 24px; height: 24px;"></i>
                </div>
                <h3 class="contact-label">Email</h3>
                <p class="contact-value">Send us an email</p>
            </a>

            <a href="tel:+919545214074" class="contact-card">
                <div class="contact-icon">
                    <i data-lucide="phone" style="width: 24px; height: 24px;"></i>
                </div>
                <h3 class="contact-label">Phone</h3>
                <p class="contact-value">+91 95452 14074</p>
            </a>
        </div>

        <div style="max-width: 500px; margin: 0 auto; text-align: center;">
            <h2
                style="font-size: 1.5rem; font-weight: 900; text-transform: uppercase; letter-spacing: -0.05em; margin-bottom: 1rem;">
                Business Hours</h2>
            <p style="color: var(--slate-500); margin-bottom: 0.5rem;">Monday - Saturday: 10:00 AM - 7:00 PM IST</p>
            <p style="color: var(--slate-400); font-size: 0.875rem;">Typically respond within 2-4 hours during business
                hours</p>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/templates/footer.php'; ?>