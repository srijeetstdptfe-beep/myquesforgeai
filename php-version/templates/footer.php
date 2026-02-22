</main>

<footer class="footer">
    <div class="container">
        <div class="grid grid-cols-4 gap-8 mb-8" style="text-align: left;">
            <!-- Logo Section -->
            <div>
                <div class="flex items-center gap-3 mb-4">
                    <div class="logo-icon">
                        <i data-lucide="file-text" style="width: 20px; height: 20px;"></i>
                    </div>
                    <div>
                        <h3
                            style="font-size: 1rem; font-weight: 900; text-transform: uppercase; letter-spacing: -0.05em;">
                            PaperCraft</h3>
                        <p
                            style="font-size: 0.625rem; color: var(--slate-400); text-transform: uppercase; letter-spacing: 0.15em;">
                            Professional Papers</p>
                    </div>
                </div>
                <p style="font-size: 0.75rem; color: var(--slate-400); line-height: 1.6;">
                    Create professional question papers with AI assistance. Designed for modern educators.
                </p>
            </div>

            <!-- Quick Links -->
            <div class="footer-links">
                <h4
                    style="font-size: 0.625rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.15em; color: var(--white); margin-bottom: 1rem;">
                    Quick Links</h4>
                <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                    <a href="<?= APP_URL ?>">Home</a>
                    <a href="<?= APP_URL ?>/pricing.php">Pricing</a>
                    <a href="<?= APP_URL ?>/contact.php">Contact</a>
                </div>
            </div>

            <!-- Legal -->
            <div class="footer-links">
                <h4
                    style="font-size: 0.625rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.15em; color: var(--white); margin-bottom: 1rem;">
                    Legal</h4>
                <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                    <a href="<?= APP_URL ?>/terms.php">Terms of Service</a>
                    <a href="<?= APP_URL ?>/privacy-policy.php">Privacy Policy</a>
                    <a href="<?= APP_URL ?>/refund-policy.php">Refund Policy</a>
                    <a href="<?= APP_URL ?>/shipping-policy.php">Shipping Policy</a>
                </div>
            </div>

            <!-- Contact -->
            <div class="footer-links">
                <h4
                    style="font-size: 0.625rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.15em; color: var(--white); margin-bottom: 1rem;">
                    Contact</h4>
                <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                    <a href="https://wa.me/919545214074" target="_blank">
                        <i data-lucide="message-circle"
                            style="width: 12px; height: 12px; display: inline; margin-right: 6px;"></i>
                        WhatsApp
                    </a>
                    <a href="mailto:validatoritinfoacademy@gmail.com">
                        <i data-lucide="mail"
                            style="width: 12px; height: 12px; display: inline; margin-right: 6px;"></i>
                        Email
                    </a>
                    <a href="tel:+919545214074">
                        <i data-lucide="phone"
                            style="width: 12px; height: 12px; display: inline; margin-right: 6px;"></i>
                        +91 9545214074
                    </a>

                    <!-- Newsletter Form -->
                    <div style="margin-top: 1rem;">
                        <form id="newsletterForm" style="display: flex; gap: 0.5rem;">
                            <input type="email" name="email" placeholder="Email"
                                style="flex: 1; padding: 0.5rem; border: 1px solid rgba(255,255,255,0.2); background: transparent; color: white; font-size: 0.75rem;">
                            <button type="submit"
                                style="padding: 0.5rem 1rem; background: white; color: black; border: none; font-size: 0.625rem; font-weight: 900; text-transform: uppercase; cursor: pointer;">
                                Join
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Bottom Bar -->
        <div
            style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2rem; display: flex; justify-content: space-between; align-items: center;">
            <p style="font-size: 0.625rem; color: var(--slate-400); text-transform: uppercase; letter-spacing: 0.15em;">
                ©
                <?= date('Y') ?> PaperCraft. All rights reserved.
            </p>
            <div style="display: flex; gap: 1.5rem;">
                <span
                    style="font-size: 0.625rem; color: rgba(255,255,255,0.2); text-transform: uppercase; letter-spacing: 0.3em; font-weight: 900;">Secure
                    Payments</span>
            </div>
        </div>
    </div>
</footer>

<!-- Bootstrap JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

<!-- Common JS -->
<script src="<?= APP_URL ?>/assets/js/app.js"></script>

<!-- Initialize Lucide Icons -->
<script>
    lucide.createIcons();

    // Newsletter form
    const nf = document.getElementById('newsletterForm');
    if (nf) {
        nf.addEventListener('submit', async function (e) {
            e.preventDefault();
            const email = this.email.value;
            if (!email) return;

            try {
                const res = await fetch('<?= APP_URL ?>/api/newsletter/subscribe.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
                const data = await res.json();

                if (res.ok) {
                    showToast('Subscribed successfully!');
                    this.reset();
                } else {
                    showToast(data.error || 'Subscription failed', 'error');
                }
            } catch (err) {
                showToast('Error subscribing', 'error');
            }
        });
    }
</script>

<?php if ($flashMessage = Session::flash('message')): ?>
    <script>
        showToast('<?= addslashes($flashMessage['text']) ?>', '<?= $flashMessage['type'] ?>');
    </script>
<?php endif; ?>
</body>

</html>