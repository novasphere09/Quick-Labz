import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetEmail = async (email: string, otp: string) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'QuickLabz <onboarding@resend.dev>', // Free resend tier requires onboarding@resend.dev
      to: [email],
      subject: 'QuickLabz - Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f8fafc; border-radius: 8px;">
          <h2 style="color: #0f172a; margin-bottom: 16px;">Password Reset Request</h2>
          <p style="color: #334155; font-size: 16px; margin-bottom: 24px;">
            We received a request to reset the password for your QuickLabz account.
            Use the following 6-digit OTP to complete your password reset:
          </p>
          <div style="background-color: #ffffff; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; text-align: center; margin-bottom: 24px;">
            <span style="font-size: 32px; font-weight: bold; color: #f97316; letter-spacing: 4px;">${otp}</span>
          </div>
          <p style="color: #64748b; font-size: 14px;">
            This OTP is valid for the next 10 minutes. If you did not request a password reset, please ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="color: #94a3b8; font-size: 12px; text-align: center;">
            &copy; ${new Date().getFullYear()} QuickLabz. All rights reserved.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('[Resend Error]', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending reset email via Resend:', error);
    return { success: false, error };
  }
};

export const sendLoginOtpEmail = async (email: string, otp: string) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'QuickLabz <onboarding@resend.dev>', // Free resend tier requires onboarding@resend.dev
      to: [email],
      subject: 'QuickLabz - Login OTP',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f8fafc; border-radius: 8px;">
          <h2 style="color: #0f172a; margin-bottom: 16px;">Login Attempt</h2>
          <p style="color: #334155; font-size: 16px; margin-bottom: 24px;">
            We detected a login attempt to your QuickLabz account. Use the OTP below to complete your login:
          </p>
          <div style="background-color: #ffffff; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; text-align: center; margin-bottom: 24px;">
            <span style="font-size: 32px; font-weight: bold; color: #3b82f6; letter-spacing: 4px;">${otp}</span>
          </div>
          <p style="color: #64748b; font-size: 14px;">
            This OTP is valid for the next 10 minutes. If you did not request this, please change your password immediately.
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="color: #94a3b8; font-size: 12px; text-align: center;">
            &copy; ${new Date().getFullYear()} QuickLabz. All rights reserved.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('[Resend Error]', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending login OTP email via Resend:', error);
    return { success: false, error };
  }
};
