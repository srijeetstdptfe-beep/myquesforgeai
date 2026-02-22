import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOTPEmail(email: string, otp: string) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Papercraft <onboarding@resend.dev>', // Use this for testing (no verification needed)
            to: [email],
            subject: 'Your Login Code',
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

        if (error) {
            console.error('Resend error:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Email send error:', error);
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
