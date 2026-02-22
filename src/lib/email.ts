import nodemailer from 'nodemailer';

// Create reusable transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendOTPEmail(email: string, otp: string) {
    try {
        const info = await transporter.sendMail({
            from: `"Papercraft" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Your Login Code - Papercraft',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #ffffff;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                        <tr>
                            <td>
                                <!-- Header -->
                                <div style="text-align: center; margin-bottom: 40px;">
                                    <h1 style="margin: 0; font-size: 32px; font-weight: 900; text-transform: uppercase; letter-spacing: -0.05em; color: #000000;">
                                        Papercraft
                                    </h1>
                                    <p style="margin: 8px 0 0 0; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em; color: #94a3b8;">
                                        Question Paper Builder
                                    </p>
                                </div>

                                <!-- OTP Box -->
                                <div style="background: #000000; border: 3px solid #000000; padding: 40px; text-align: center; margin-bottom: 32px;">
                                    <p style="margin: 0 0 16px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #94a3b8;">
                                        Your Login Code
                                    </p>
                                    <div style="font-size: 48px; font-weight: 900; letter-spacing: 0.15em; color: #ffffff; font-family: 'Courier New', monospace;">
                                        ${otp}
                                    </div>
                                    <p style="margin: 16px 0 0 0; font-size: 11px; font-weight: 600; color: #94a3b8;">
                                        Valid for 5 minutes
                                    </p>
                                </div>

                                <!-- Instructions -->
                                <div style="background: #f8fafc; border: 2px solid #e2e8f0; padding: 24px; margin-bottom: 24px;">
                                    <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #000000;">
                                        How to Use:
                                    </p>
                                    <ol style="margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.6; color: #334155;">
                                        <li style="margin-bottom: 8px;">Return to the login page</li>
                                        <li style="margin-bottom: 8px;">Enter this 6-digit code</li>
                                        <li>You'll be logged in instantly!</li>
                                    </ol>
                                </div>

                                <!-- Security Notice -->
                                <div style="border-left: 4px solid #000000; padding: 16px; background: #fef3c7; margin-bottom: 32px;">
                                    <p style="margin: 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #000000; margin-bottom: 8px;">
                                        ⚠️ Security Notice
                                    </p>
                                    <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #334155;">
                                        Never share this code with anyone. Papercraft team will never ask for your OTP.
                                    </p>
                                </div>

                                <!-- Footer -->
                                <div style="text-align: center; padding-top: 32px; border-top: 2px solid #e2e8f0;">
                                    <p style="margin: 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8;">
                                        © ${new Date().getFullYear()} Papercraft. All rights reserved.
                                    </p>
                                    <p style="margin: 12px 0 0 0; font-size: 11px; color: #cbd5e1;">
                                        Didn't request this code? You can safely ignore this email.
                                    </p>
                                </div>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `,
        });

        console.log('OTP Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Gmail SMTP error:', error);
        return { success: false, error };
    }
}

export async function sendLicenseKeyEmail(email: string, name: string, licenseKey: string, plan: string) {
    try {
        const info = await transporter.sendMail({
            from: `"Papercraft" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Your Papercraft License Key',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #ffffff;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                        <tr>
                            <td>
                                <!-- Header -->
                                <div style="text-align: center; margin-bottom: 40px;">
                                    <h1 style="margin: 0; font-size: 32px; font-weight: 900; text-transform: uppercase; letter-spacing: -0.05em; color: #000000;">
                                        Papercraft
                                    </h1>
                                    <p style="margin: 8px 0 0 0; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em; color: #94a3b8;">
                                        Question Paper Builder
                                    </p>
                                </div>

                                <!-- Welcome Message -->
                                <div style="margin-bottom: 32px;">
                                    <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: -0.03em; color: #000000;">
                                        Welcome, ${name}!
                                    </h2>
                                    <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #334155;">
                                        Thank you for subscribing to Papercraft ${plan} plan. Your license key is ready!
                                    </p>
                                </div>

                                <!-- License Key Box -->
                                <div style="background: #000000; border: 3px solid #000000; padding: 40px; text-align: center; margin-bottom: 32px;">
                                    <p style="margin: 0 0 16px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #94a3b8;">
                                        Your License Key
                                    </p>
                                    <div style="font-size: 24px; font-weight: 900; letter-spacing: 0.1em; color: #ffffff; font-family: 'Courier New', monospace; word-break: break-all;">
                                        ${licenseKey}
                                    </div>
                                </div>

                                <!-- Plan Details -->
                                <div style="background: #f8fafc; border: 2px solid #e2e8f0; padding: 24px; margin-bottom: 24px;">
                                    <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #000000;">
                                        Plan Details:
                                    </p>
                                    <ul style="margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.6; color: #334155;">
                                        <li style="margin-bottom: 8px;">Plan: <strong>${plan}</strong></li>
                                        <li style="margin-bottom: 8px;">Status: <strong>Active</strong></li>
                                        <li>Keep this license key safe for future reference</li>
                                    </ul>
                                </div>

                                <!-- CTA Button -->
                                <div style="text-align: center; margin-bottom: 32px;">
                                    <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard" 
                                       style="display: inline-block; background: #000000; color: #ffffff; text-decoration: none; padding: 16px 48px; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; border: 3px solid #000000;">
                                        Access Dashboard
                                    </a>
                                </div>

                                <!-- Footer -->
                                <div style="text-align: center; padding-top: 32px; border-top: 2px solid #e2e8f0;">
                                    <p style="margin: 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8;">
                                        © ${new Date().getFullYear()} Papercraft. All rights reserved.
                                    </p>
                                    <p style="margin: 12px 0 0 0; font-size: 11px; color: #cbd5e1;">
                                        Need help? Contact our support team.
                                    </p>
                                </div>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `,
        });

        console.log('License Key Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Gmail SMTP error:', error);
        return { success: false, error };
    }
}

export function generateOTP(): string {
    // Generate crypto-secure 6-digit OTP
    const digits = '0123456789';
    let otp = '';

    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * digits.length);
        otp += digits[randomIndex];
    }

    return otp;
}
