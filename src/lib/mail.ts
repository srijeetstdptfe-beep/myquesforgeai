import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Sends a license key email to a user
 */
export async function sendLicenseEmail(to: string, userName: string, licenseKey: string, planName: string) {
  const mailOptions = {
    from: `"Papercraft" <${process.env.SMTP_USER}>`,
    to,
    subject: `Your PaperCraft ${planName} License Key 🗝️`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 30px;">
           <h1 style="margin: 0; font-size: 32px; font-weight: 900; text-transform: uppercase; letter-spacing: -0.05em; color: #000000;">Papercraft</h1>
           <p style="margin: 8px 0 0 0; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em; color: #94a3b8;">Question Paper Builder</p>
        </div>
        
        <h2 style="color: #000000; text-align: center;">Welcome to Papercraft Pro!</h2>
        <p>Hi ${userName},</p>
        <p>Thank you for choosing the <strong>${planName}</strong> plan. Your account has been upgraded, and your visual question paper builder is ready for unlimited use.</p>
        
        <div style="background-color: #000000; padding: 40px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <p style="margin-bottom: 8px; font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; font-weight: bold;">Your License Key</p>
          <code style="font-size: 24px; font-weight: bold; color: #ffffff; word-break: break-all; display: block; font-family: monospace;">${licenseKey}</code>
        </div>

        <p>You can find this key anytime in your account settings. If you have any questions or need support, just reply to this email.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 12px;">
          <p>&copy; ${new Date().getFullYear()} PaperCraft. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ License Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending license email:", error);
    return { success: false, error };
  }
}

/**
 * Sends a contact form submission to the support email
 */
export async function sendContactEmail({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const mailOptions = {
    from: `"Papercraft Support" <${process.env.SMTP_USER}>`,
    to: process.env.SMTP_USER, // Send to the admin email configured in env
    replyTo: email,
    subject: `Support Request: ${subject}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 30px;">
           <h1 style="margin: 0; font-size: 32px; font-weight: 900; text-transform: uppercase; letter-spacing: -0.05em; color: #000000;">Papercraft</h1>
           <p style="margin: 8px 0 0 0; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em; color: #94a3b8;">Support Center</p>
        </div>

        <h2 style="color: #000000; font-size: 18px; border-bottom: 2px solid #000000; padding-bottom: 10px; margin-bottom: 20px;">New Message from Contact Form</h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e2e8f0;">
          <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${name}</p>
          <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 0 0 10px 0;"><strong>Subject:</strong> ${subject}</p>
        </div>

        <div style="padding: 20px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px;">
          <p style="margin: 0 0 10px 0; font-weight: bold; color: #64748b; font-size: 12px; text-transform: uppercase;">Message Content:</p>
          <p style="margin: 0; white-space: pre-wrap; line-height: 1.6; color: #1e293b;">${message}</p>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 12px;">
          <p>&copy; ${new Date().getFullYear()} PaperCraft. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    console.log(`📧 SENDING CONTACT EMAIL from ${email}...`);
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Contact Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending contact email:", error);
    return { success: false, error };
  }
}

/**
 * Sends an OTP email for login
 */
export async function sendOTPEmail(email: string, otp: string) {
  try {
    const info = await transporter.sendMail({
      from: `"Papercraft" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Your Login Code - Papercraft',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="margin: 0; font-size: 32px; font-weight: 900; text-transform: uppercase; letter-spacing: -0.05em; color: #000000;">Papercraft</h1>
            <p style="margin: 8px 0 0 0; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em; color: #94a3b8;">Question Paper Builder</p>
          </div>

          <div style="background: #000000; padding: 40px; text-align: center; margin-bottom: 32px; border-radius: 8px;">
            <p style="margin: 0 0 16px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #94a3b8;">Your Login Code</p>
            <div style="font-size: 48px; font-weight: 900; letter-spacing: 0.15em; color: #ffffff; font-family: monospace;">${otp}</div>
            <p style="margin: 16px 0 0 0; font-size: 11px; font-weight: 600; color: #94a3b8;">Valid for 5 minutes</p>
          </div>

          <div style="text-align: center; padding-top: 32px; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8;">© ${new Date().getFullYear()} Papercraft. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    console.log('✅ OTP Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ SMTP OTP error:', error);
    return { success: false, error };
  }
}

/**
 * Generates a 6-digit OTP
 */
export function generateOTP(): string {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < 6; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}
