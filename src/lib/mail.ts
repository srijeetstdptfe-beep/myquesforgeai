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

export async function sendLicenseEmail(to: string, userName: string, licenseKey: string, planName: string) {
  const mailOptions = {
    from: `"Papercraft" <${process.env.SMTP_USER}>`,
    to,
    subject: `Your PaperCraft ${planName} License Key 🗝️`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
        <h1 style="color: #6366f1; text-align: center;">Welcome to PaperCraft Pro!</h1>
        <p>Hi ${userName},</p>
        <p>Thank you for choosing the <strong>${planName}</strong> plan. Your account has been upgraded, and your visual question paper builder is ready for unlimited use.</p>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px dashed #cbd5e1; text-align: center;">
          <p style="margin-bottom: 8px; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; font-weight: bold;">Your License Key</p>
          <code style="font-size: 18px; font-weight: bold; color: #1e293b; word-break: break-all; display: block;">${licenseKey}</code>
        </div>

        <p>You can find this key anytime in your account settings. If you have any questions or need support, just reply to this email.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 12px;">
          <p>&copy; ${new Date().getFullYear()} PaperCraft. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    console.log('📧 SENDING LICENSE EMAIL:');
    console.log('   To:', to);
    console.log('   From:', process.env.SMTP_USER);
    console.log('   Subject:', mailOptions.subject);

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ License Email sent successfully:", info.messageId);
    console.log("   Recipient confirmed:", to);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending license email:", error);
    return { success: false, error };
  }
}
