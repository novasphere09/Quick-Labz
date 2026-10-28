// SMS Notification Engine
// This is currently a mock service that outputs beautifully formatted console logs.
// Replace the internal logic with Twilio, Msg91, or Wati (WhatsApp) API calls.

/**
 * Sends a booking confirmation SMS to the patient
 */
export async function sendBookingConfirmationSMS(phone: string, bookingId: string, testName: string) {
  const message = `QuickLabz: Your booking (${bookingId}) for ${testName} is confirmed! Our phlebotomist will contact you soon.`;
  return sendSMS(phone, message);
}

/**
 * Sends an alert to the patient when their report is ready
 */
export async function sendReportReadySMS(phone: string, patientName: string) {
  const message = `QuickLabz: Hello ${patientName}, your test report is now ready! Login to your dashboard to view and download it securely.`;
  return sendSMS(phone, message);
}

/**
 * Sends an OTP for login
 */
export async function sendLoginOtpSMS(phone: string, otp: string) {
  const message = `QuickLabz: ${otp} is your secure login code. Do not share it with anyone.`;
  return sendSMS(phone, message);
}

/**
 * Core dispatch function
 */
async function sendSMS(phone: string, message: string) {
  try {
    // TODO: Insert your actual SMS Provider API fetch logic here
    /*
    await fetch('https://api.msg91.com/api/v5/flow/', {
      method: 'POST',
      headers: { 'authkey': process.env.MSG91_AUTH_KEY },
      body: JSON.stringify({ ... })
    });
    */
    
    console.log(`\n======================================================`);
    console.log(`📱 [SMS GATEWAY MOCK] Message Dispatched`);
    console.log(`To: ${phone}`);
    console.log(`Content: ${message}`);
    console.log(`======================================================\n`);

    return { success: true };
  } catch (error) {
    console.error("SMS Dispatch Error:", error);
    return { success: false, error };
  }
}
