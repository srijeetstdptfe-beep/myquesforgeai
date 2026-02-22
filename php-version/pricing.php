<?php
/**
 * Pricing Page
 * Shows pricing plans and contact section
 */

$pageTitle = 'Pricing';
require_once __DIR__ . '/templates/header.php';
?>

<style>
    .pricing-page {
        padding: 6rem 1.5rem;
    }

    .pricing-header {
        text-align: center;
        margin-bottom: 6rem;
    }

    .pricing-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.375rem 1rem;
        border: 1px solid rgba(0, 0, 0, 0.1);
        font-size: 0.625rem;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        margin-bottom: 2.5rem;
    }

    .pricing-title {
        font-size: clamp(2.5rem, 6vw, 4.5rem);
        font-weight: 900;
        letter-spacing: -0.05em;
        text-transform: uppercase;
        line-height: 0.9;
        margin-bottom: 2rem;
    }

    .pricing-subtitle {
        color: var(--slate-500);
        font-size: 1.25rem;
        font-weight: 500;
        max-width: 600px;
        margin: 0 auto;
    }

    .pricing-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1.5rem;
        max-width: 1200px;
        margin: 0 auto;
    }

    .pricing-card {
        border: 2px solid var(--slate-100);
        background: var(--white);
        display: flex;
        flex-direction: column;
        transition: all 0.3s ease;
    }

    .pricing-card:hover {
        border-color: var(--black);
    }

    .pricing-card.featured {
        border-color: var(--black);
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        position: relative;
        z-index: 10;
        transform: scale(1.05);
    }

    .pricing-card-badge {
        position: absolute;
        top: 0;
        right: 0;
        background: var(--black);
        color: var(--white);
        font-size: 0.625rem;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        padding: 0.25rem 0.75rem;
    }

    .pricing-card-header {
        padding: 2rem;
        padding-bottom: 1.5rem;
    }

    .pricing-plan-name {
        font-size: 1.875rem;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: -0.05em;
        margin-bottom: 0.5rem;
    }

    .pricing-plan-desc {
        font-size: 0.625rem;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        color: var(--slate-400);
    }

    .pricing-plan-price {
        margin-top: 2rem;
        display: flex;
        align-items: baseline;
    }

    .pricing-amount {
        font-size: 3rem;
        font-weight: 900;
        letter-spacing: -0.05em;
    }

    .pricing-period {
        font-size: 0.625rem;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        color: var(--slate-400);
        margin-left: 0.75rem;
    }

    .pricing-card-body {
        padding: 0 2rem;
        flex-grow: 1;
    }

    .pricing-features {
        list-style: none;
    }

    .pricing-feature {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        padding: 1rem 0;
        font-size: 0.875rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: -0.025em;
    }

    .pricing-feature.disabled {
        color: var(--slate-300);
    }

    .pricing-card-footer {
        padding: 2rem;
        margin-top: auto;
    }

    /* Contact Section */
    .contact-section {
        max-width: 900px;
        margin: 6rem auto 0;
        border: 2px solid var(--black);
        padding: 3rem;
        text-align: center;
    }

    .contact-title {
        font-size: 2.5rem;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: -0.05em;
        margin-bottom: 1.5rem;
    }

    .contact-subtitle {
        color: var(--slate-500);
        margin-bottom: 2.5rem;
        font-weight: 500;
        max-width: 500px;
        margin-left: auto;
        margin-right: auto;
    }

    .contact-cards {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 2rem;
        max-width: 700px;
        margin: 0 auto;
    }

    .contact-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
        padding: 1.5rem;
        border: 1px solid rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
    }

    .contact-card:hover {
        border-color: var(--black);
    }

    .contact-card:hover .contact-icon {
        transform: scale(1.1);
    }

    .contact-icon {
        width: 3rem;
        height: 3rem;
        background: var(--black);
        color: var(--white);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.3s ease;
    }

    .contact-label {
        font-size: 0.625rem;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.15em;
    }

    .contact-value {
        font-size: 0.875rem;
        color: var(--slate-500);
    }

    @media (max-width: 1024px) {
        .pricing-grid {
            grid-template-columns: repeat(2, 1fr);
        }

        .pricing-card.featured {
            transform: none;
        }
    }

    @media (max-width: 768px) {
        .pricing-grid {
            grid-template-columns: 1fr;
        }

        .contact-cards {
            grid-template-columns: 1fr;
        }
    }
</style>

<div class="pricing-page">
    <div class="container">
        <div class="pricing-header">
            <div class="pricing-badge">
                <i data-lucide="shield" style="width: 12px; height: 12px;"></i>
                Commercial Licensing
            </div>
            <h1 class="pricing-title">
                Choose Your<br>Capability Level.
            </h1>
            <p class="pricing-subtitle">
                Professional tooling for institutional rigor. Scale your examination infrastructure.
            </p>
        </div>

        <div class="pricing-grid">
            <!-- FREE PLAN -->
            <div class="pricing-card">
                <div class="pricing-card-header">
                    <h3 class="pricing-plan-name">Free</h3>
                    <p class="pricing-plan-desc">Trial & Onboarding</p>
                    <div class="pricing-plan-price">
                        <span class="pricing-amount">₹0</span>
                    </div>
                </div>
                <div class="pricing-card-body">
                    <ul class="pricing-features">
                        <li class="pricing-feature">
                            <i data-lucide="check" style="width: 16px; height: 16px; flex-shrink: 0;"></i>
                            3 Saved Papers
                        </li>
                        <li class="pricing-feature">
                            <i data-lucide="check" style="width: 16px; height: 16px; flex-shrink: 0;"></i>
                            Manual Creation
                        </li>
                        <li class="pricing-feature">
                            <i data-lucide="check" style="width: 16px; height: 16px; flex-shrink: 0;"></i>
                            Live Preview
                        </li>
                        <li class="pricing-feature disabled">
                            <i data-lucide="x" style="width: 16px; height: 16px; flex-shrink: 0;"></i>
                            No AI Features
                        </li>
                        <li class="pricing-feature disabled">
                            <i data-lucide="x" style="width: 16px; height: 16px; flex-shrink: 0;"></i>
                            Watermarked Export
                        </li>
                    </ul>
                </div>
                <div class="pricing-card-footer">
                    <a href="<?= APP_URL ?>/register.php" class="btn btn-outline w-full h-14">Start Free</a>
                </div>
            </div>

            <!-- PAYG PLAN -->
            <div class="pricing-card">
                <div class="pricing-card-header">
                    <h3 class="pricing-plan-name">PAYG</h3>
                    <p class="pricing-plan-desc">No Subscription</p>
                    <div class="pricing-plan-price">
                        <span class="pricing-amount" style="font-size: 1.875rem;">Usage Based</span>
                    </div>
                    <p
                        style="font-size: 0.625rem; color: var(--slate-400); font-weight: 900; text-transform: uppercase; letter-spacing: 0.15em; margin-top: 0.5rem;">
                        No expiration</p>
                </div>
                <div class="pricing-card-body">
                    <ul class="pricing-features">
                        <li class="pricing-feature">
                            <i data-lucide="check" style="width: 16px; height: 16px; flex-shrink: 0;"></i>
                            Manual: Free
                        </li>
                        <li class="pricing-feature">
                            <i data-lucide="zap" style="width: 16px; height: 16px; flex-shrink: 0;"></i>
                            AI Full: ₹149
                        </li>
                        <li class="pricing-feature">
                            <i data-lucide="zap" style="width: 16px; height: 16px; flex-shrink: 0;"></i>
                            AI Batch: ₹79
                        </li>
                        <li class="pricing-feature">
                            <i data-lucide="check" style="width: 16px; height: 16px; flex-shrink: 0;"></i>
                            Clean Export: ₹39
                        </li>
                    </ul>
                </div>
                <div class="pricing-card-footer">
                    <a href="#contact" class="btn w-full h-14">Contact Us</a>
                </div>
            </div>

            <!-- MONTHLY PLAN (Featured) -->
            <div class="pricing-card featured">
                <div class="pricing-card-badge">Popular</div>
                <div class="pricing-card-header">
                    <h3 class="pricing-plan-name">Monthly</h3>
                    <p class="pricing-plan-desc">Educator / Small Institute</p>
                    <div class="pricing-plan-price">
                        <span class="pricing-amount">₹699</span>
                        <span class="pricing-period">/mo</span>
                    </div>
                </div>
                <div class="pricing-card-body">
                    <ul class="pricing-features">
                        <li class="pricing-feature">
                            <i data-lucide="check" style="width: 16px; height: 16px; flex-shrink: 0;"></i>
                            Unlimited Manual
                        </li>
                        <li class="pricing-feature">
                            <i data-lucide="check" style="width: 16px; height: 16px; flex-shrink: 0;"></i>
                            8 AI Papers/mo
                        </li>
                        <li class="pricing-feature">
                            <i data-lucide="check" style="width: 16px; height: 16px; flex-shrink: 0;"></i>
                            200 AI Questions/mo
                        </li>
                        <li class="pricing-feature">
                            <i data-lucide="check" style="width: 16px; height: 16px; flex-shrink: 0;"></i>
                            Clean PDF & DOCX
                        </li>
                        <li class="pricing-feature">
                            <i data-lucide="check" style="width: 16px; height: 16px; flex-shrink: 0;"></i>
                            Institute Branding
                        </li>
                    </ul>
                </div>
                <div class="pricing-card-footer">
                    <a href="#contact" class="btn w-full h-14">Contact Us</a>
                </div>
            </div>

            <!-- ANNUAL PLAN -->
            <div class="pricing-card">
                <div class="pricing-card-header">
                    <h3 class="pricing-plan-name">Annual</h3>
                    <p class="pricing-plan-desc">Best Value</p>
                    <div class="pricing-plan-price">
                        <span class="pricing-amount">₹5,999</span>
                        <span class="pricing-period">/yr</span>
                    </div>
                </div>
                <div class="pricing-card-body">
                    <ul class="pricing-features">
                        <li class="pricing-feature">
                            <i data-lucide="check" style="width: 16px; height: 16px; flex-shrink: 0;"></i>
                            Everything in Monthly
                        </li>
                        <li class="pricing-feature">
                            <i data-lucide="sparkles" style="width: 16px; height: 16px; flex-shrink: 0;"></i>
                            100 AI Papers/yr
                        </li>
                        <li class="pricing-feature">
                            <i data-lucide="sparkles" style="width: 16px; height: 16px; flex-shrink: 0;"></i>
                            3000 AI Questions/yr
                        </li>
                        <li class="pricing-feature">
                            <i data-lucide="check" style="width: 16px; height: 16px; flex-shrink: 0;"></i>
                            Priority Support
                        </li>
                    </ul>
                </div>
                <div class="pricing-card-footer">
                    <a href="#contact" class="btn btn-outline w-full h-14">Contact Us</a>
                </div>
            </div>
        </div>

        <!-- Contact Section -->
        <div id="contact" class="contact-section">
            <h2 class="contact-title">Get Started Today</h2>
            <p class="contact-subtitle">
                Contact us to upgrade your plan. We'll set up your account within 24 hours of payment confirmation.
            </p>
            <div class="contact-cards">
                <a href="https://wa.me/919545214074" target="_blank" class="contact-card">
                    <div class="contact-icon">
                        <i data-lucide="message-circle" style="width: 20px; height: 20px;"></i>
                    </div>
                    <span class="contact-label">WhatsApp</span>
                    <span class="contact-value">+91 95452 14074</span>
                </a>
                <a href="mailto:validatoritinfoacademy@gmail.com" class="contact-card">
                    <div class="contact-icon">
                        <i data-lucide="mail" style="width: 20px; height: 20px;"></i>
                    </div>
                    <span class="contact-label">Email</span>
                    <span class="contact-value">Contact</span>
                </a>
                <a href="tel:+919545214074" class="contact-card">
                    <div class="contact-icon">
                        <i data-lucide="phone" style="width: 20px; height: 20px;"></i>
                    </div>
                    <span class="contact-label">Call</span>
                    <span class="contact-value">+91 95452 14074</span>
                </a>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/templates/footer.php'; ?>