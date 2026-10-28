import nodemailer from 'nodemailer';

/**
 * Real-world email sender utility for QuickLabz.
 * Requires SMTP credentials in the .env file:
 * SMTP_HOST (e.g., smtp.gmail.com)
 * SMTP_PORT (e.g., 587)
 * SMTP_USER (e.g., your-email@gmail.com)
 * SMTP_PASS (e.g., your-app-password)
 */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER || 'admin@quicklabz.com';

    const info = await transporter.sendMail({
      from: `"QuickLabz Admin" <${fromEmail}>`,
      to,
      subject,
      html,
    });

    console.log('Message sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('Error sending email:', error);
    // If SMTP is not configured, we'll throw an error so the caller knows it failed.
    throw new Error(error.message || 'Failed to send email');
  }
}
