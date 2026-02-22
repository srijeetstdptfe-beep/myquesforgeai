<?php
/**
 * PaperCraft - Landing Page
 * Homepage with hero, features, and CTA sections
 */

$pageTitle = 'Home';
require_once __DIR__ . '/templates/header.php';
?>

<style>
    /* Landing Page Specific Styles */
    .hero-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.375rem 1rem;
        border: 1px solid rgba(0, 0, 0, 0.1);
        font-size: 0.625rem;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        margin-bottom: 3rem;
    }

    .hero-title {
        font-size: clamp(3rem, 10vw, 9rem);
        font-weight: 900;
        line-height: 0.9;
        letter-spacing: -0.05em;
        margin-bottom: 3rem;
    }

    .hero-title span {
        background: linear-gradient(to bottom, #000, #94a3b8);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .hero-subtitle {
        font-size: 1.25rem;
        color: var(--slate-500);
        max-width: 600px;
        margin: 0 auto 4rem;
        line-height: 1.6;
        font-weight: 500;
    }

    .hero-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 1.5rem;
        justify-content: center;
        margin-bottom: 6rem;
    }

    .btn-hero {
        height: 4rem;
        padding: 0 2.5rem;
        font-size: 1rem;
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
    }

    /* Paper mockup */
    .paper-mockup {
        max-width: 900px;
        margin: 0 auto;
        position: relative;
    }

    .paper-layer {
        position: absolute;
        width: 100%;
        height: 100%;
        border: 1px solid rgba(0, 0, 0, 0.05);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .paper-layer-1 {
        background: #f1f5f9;
        transform: rotate(1deg);
        top: 16px;
        left: 16px;
        z-index: 1;
    }

    .paper-layer-2 {
        background: #f8fafc;
        transform: rotate(-1deg);
        top: 8px;
        left: 8px;
        z-index: 2;
    }

    .paper-main {
        position: relative;
        z-index: 3;
        background: white;
        border: 1px solid rgba(0, 0, 0, 0.1);
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        aspect-ratio: 16/10;
    }

    .paper-toolbar {
        height: 3.5rem;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        background: #f8fafc;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 1.5rem;
    }

    .paper-content {
        padding: 2.5rem;
        display: grid;
        grid-template-columns: 1fr 3fr;
        gap: 2.5rem;
        height: calc(100% - 3.5rem);
    }

    /* Features Section */
    .features-section {
        background: var(--black);
        color: var(--white);
        padding: 8rem 1.5rem;
    }

    .features-header {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: flex-end;
        gap: 3rem;
        margin-bottom: 6rem;
        padding-bottom: 4rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .features-title {
        font-size: clamp(2.5rem, 6vw, 4rem);
        font-weight: 900;
        line-height: 0.9;
        letter-spacing: -0.05em;
        text-transform: uppercase;
    }

    .feature-card {
        padding: 2rem 0;
    }

    .feature-icon {
        opacity: 0.4;
        margin-bottom: 1.5rem;
        transition: opacity 0.3s ease;
    }

    .feature-card:hover .feature-icon {
        opacity: 1;
    }

    .feature-title {
        font-size: 1.25rem;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: -0.05em;
        margin-bottom: 1rem;
    }

    .feature-desc {
        color: var(--slate-400);
        line-height: 1.6;
        font-weight: 500;
    }

    /* CTA Section */
    .cta-section {
        padding: 10rem 1.5rem;
    }

    .cta-box {
        max-width: 1000px;
        margin: 0 auto;
        border: 2px solid var(--black);
        padding: 6rem;
        text-align: center;
        position: relative;
        overflow: hidden;
        background: var(--white);
        transition: all 0.5s ease;
    }

    .cta-box:hover {
        background: var(--black);
        color: var(--white);
    }

    .cta-box:hover .cta-subtitle {
        color: var(--slate-300);
    }

    .cta-box:hover .btn {
        background: var(--white);
        color: var(--black);
    }

    .cta-title {
        font-size: clamp(2rem, 6vw, 4.5rem);
        font-weight: 900;
        line-height: 1;
        letter-spacing: -0.05em;
        margin-bottom: 2rem;
    }

    .cta-subtitle {
        font-size: 1.25rem;
        color: var(--slate-500);
        max-width: 500px;
        margin: 0 auto 3rem;
        font-weight: 500;
        transition: color 0.5s ease;
    }

    @media (max-width: 768px) {
        .hero-buttons {
            flex-direction: column;
            align-items: stretch;
        }

        .btn-hero {
            width: 100%;
            justify-content: center;
        }

        .paper-content {
            grid-template-columns: 1fr;
        }

        .cta-box {
            padding: 3rem 2rem;
        }
    }
</style>

<!-- Hero Section -->
<section style="padding: 8rem 1.5rem 5rem; text-align: center; position: relative; overflow: hidden;">
    <div class="container">
        <div class="hero-badge">
            <i data-lucide="sparkles" style="width: 12px; height: 12px;"></i>
            AI-Enhanced Pedagogy
        </div>

        <h1 class="hero-title">
            EDITORIAL<br>
            <span>PRECISION.</span>
        </h1>

        <p class="hero-subtitle">
            The premium visual builder for educators. Create authentic, multi-language exam papers with the speed of AI
            and the feel of traditional publishing.
        </p>

        <div class="hero-buttons">
            <a href="<?= APP_URL ?>/register.php" class="btn btn-hero">
                Get Started Free
                <i data-lucide="chevron-right" style="width: 16px; height: 16px;"></i>
            </a>
            <a href="<?= APP_URL ?>/dashboard.php" class="btn btn-outline btn-hero">
                Access Dashboard
            </a>
        </div>

        <!-- Paper Mockup -->
        <div class="paper-mockup">
            <div class="paper-layer paper-layer-1"></div>
            <div class="paper-layer paper-layer-2"></div>
            <div class="paper-main">
                <div class="paper-toolbar">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <i data-lucide="file-text" style="width: 16px; height: 16px; opacity: 0.2;"></i>
                        <span
                            style="font-size: 0.625rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.15em;">PaperCraft
                            Visual Editor</span>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <div style="width: 8px; height: 8px; border-radius: 50%; border: 1px solid rgba(0,0,0,0.1);">
                        </div>
                        <div style="width: 8px; height: 8px; border-radius: 50%; border: 1px solid rgba(0,0,0,0.1);">
                        </div>
                    </div>
                </div>
                <div class="paper-content">
                    <div style="border-right: 1px solid rgba(0,0,0,0.05); padding-right: 1.5rem;">
                        <div style="height: 8px; background: #f1f5f9; border-radius: 4px; margin-bottom: 1rem;"></div>
                        <div
                            style="height: 8px; background: #f1f5f9; border-radius: 4px; width: 66%; margin-bottom: 1rem;">
                        </div>
                        <div style="height: 8px; background: #f1f5f9; border-radius: 4px; margin-bottom: 1rem;"></div>
                        <div
                            style="height: 8px; background: #f1f5f9; border-radius: 4px; width: 80%; margin-bottom: 1rem;">
                        </div>
                        <div style="height: 8px; background: #f1f5f9; border-radius: 4px; width: 66%;"></div>
                    </div>
                    <div>
                        <div style="margin-bottom: 2rem;">
                            <div
                                style="width: 33%; height: 16px; background: #000; border-radius: 2px; margin-bottom: 1rem;">
                            </div>
                            <div
                                style="width: 100%; height: 8px; background: #f1f5f9; border-radius: 4px; margin-bottom: 0.5rem;">
                            </div>
                            <div style="width: 66%; height: 8px; background: #f1f5f9; border-radius: 4px;"></div>
                        </div>
                        <div
                            style="padding: 2rem; border: 2px dashed rgba(0,0,0,0.05); background: rgba(248,250,252,0.5);">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 1.5rem;">
                                <div style="flex: 1;">
                                    <div
                                        style="width: 75%; height: 12px; background: rgba(0,0,0,0.1); border-radius: 4px; margin-bottom: 0.75rem;">
                                    </div>
                                    <div style="width: 50%; height: 8px; background: #e2e8f0; border-radius: 4px;">
                                    </div>
                                </div>
                                <div
                                    style="width: 32px; height: 32px; background: #000; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: 700;">
                                    10</div>
                            </div>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                <div style="height: 40px; border: 1px solid rgba(0,0,0,0.1); background: white;"></div>
                                <div style="height: 40px; border: 1px solid rgba(0,0,0,0.1); background: white;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Features Section -->
<section id="features" class="features-section">
    <div class="container">
        <div class="features-header">
            <div style="max-width: 600px;">
                <h2 class="features-title">Academic<br>Standards.</h2>
                <p style="font-size: 1.25rem; color: var(--slate-400); font-weight: 500; margin-top: 2rem;">
                    Built with the rigor required for formal examinations. No compromises on quality or structure.
                </p>
            </div>
            <a href="<?= APP_URL ?>/register.php"
                style="color: white; font-size: 0.875rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.15em; display: flex; align-items: center; gap: 0.5rem;">
                Start Building Free
                <i data-lucide="arrow-right" style="width: 16px; height: 16px;"></i>
            </a>
        </div>

        <div class="grid grid-cols-3" style="gap: 3rem 3rem;">
            <div class="feature-card">
                <div class="feature-icon">
                    <i data-lucide="layout" style="width: 24px; height: 24px;"></i>
                </div>
                <h3 class="feature-title">Visual Drafting</h3>
                <p class="feature-desc">Every margin, every font size, precisely where it belongs on the A4 canvas.</p>
            </div>

            <div class="feature-card">
                <div class="feature-icon">
                    <i data-lucide="sparkles" style="width: 24px; height: 24px;"></i>
                </div>
                <h3 class="feature-title">AI Synthesis</h3>
                <p class="feature-desc">Questions generated from core subject matter expertise and Bloom's Taxonomy.</p>
            </div>

            <div class="feature-card">
                <div class="feature-icon">
                    <i data-lucide="languages" style="width: 24px; height: 24px;"></i>
                </div>
                <h3 class="feature-title">Vernacular Support</h3>
                <p class="feature-desc">Seamlessly handle 22 Indian languages with high-fidelity Unicode rendering.</p>
            </div>

            <div class="feature-card">
                <div class="feature-icon">
                    <i data-lucide="download" style="width: 24px; height: 24px;"></i>
                </div>
                <h3 class="feature-title">Print Optimized</h3>
                <p class="feature-desc">Export to industry-standard PDF formats. Zero layout shifting, guaranteed.</p>
            </div>

            <div class="feature-card">
                <div class="feature-icon">
                    <i data-lucide="zap" style="width: 24px; height: 24px;"></i>
                </div>
                <h3 class="feature-title">Instant Fulfillment</h3>
                <p class="feature-desc">Immediate delivery of license keys and extra credits upon transaction
                    completion.</p>
            </div>

            <div class="feature-card">
                <div class="feature-icon">
                    <i data-lucide="shield-check" style="width: 24px; height: 24px;"></i>
                </div>
                <h3 class="feature-title">Secure Vault</h3>
                <p class="feature-desc">Your data is private. Your papers are protected with industry-standard
                    encryption.</p>
            </div>
        </div>
    </div>
</section>

<!-- CTA Section -->
<section class="cta-section">
    <div class="cta-box">
        <h2 class="cta-title">CRAFT YOUR NEXT<br>EXAMINATION.</h2>
        <p class="cta-subtitle">
            Professional, secure, and infinitely scalable. Join 5,000+ educators streamlining their paper creation.
        </p>
        <a href="<?= APP_URL ?>/register.php" class="btn btn-lg">
            Join the Platform
        </a>
    </div>
</section>

<?php require_once __DIR__ . '/templates/footer.php'; ?>