import { Resend } from 'resend';

// The user has stored their Resend API key in SMTP_PASS in the .env file
const resend = new Resend(process.env.SMTP_PASS);

export async function sendLabApprovalNotification(labName: string, email: string, phone: string) {
  console.log(`\n======================================================`);
  console.log(`📧  SENDING WELCOME EMAIL VIA RESEND TO: ${email}`);
  
  try {
    const data = await resend.emails.send({
      from: process.env.SMTP_FROM || 'onboarding@resend.dev',
      to: email,
      subject: `Welcome to QuickLabz, ${labName}! 🎉`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 10px;">
          <h1 style="color: #0d9488;">Congratulations ${labName}!</h1>
          <p style="color: #374151; font-size: 16px;">Your laboratory verification has been fully approved by the QuickLabz administration team.</p>
          <p style="color: #374151; font-size: 16px;">You are now officially a Partner Lab! You can log in to your portal to manage your test catalog and start receiving sample collection requests.</p>
          <br/>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/partner-login" style="background-color: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Go to Partner Dashboard</a>
          <br/><br/>
          <p style="color: #6b7280; font-size: 14px;">Welcome aboard,<br/>The QuickLabz Team</p>
        </div>
      `
    });
    console.log(`✅ Welcome email successfully dispatched! ID: ${data.data?.id}`);
  } catch (error) {
    console.error(`❌ Failed to send welcome email via Resend:`, error);
  }
  
  console.log(`\n💬  WHATSAPP MESSAGE TO: ${phone} (Mocked - Needs Twilio API)`);
  console.log(`Message: 🏥 QuickLabz Update: Congratulations ${labName}! Your lab verification is approved. Log in to your portal to start receiving bookings. Welcome aboard!`);
  console.log(`======================================================\n`);
}
