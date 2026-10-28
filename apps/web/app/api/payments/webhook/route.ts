import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret) {
      console.warn("⚠️ Webhook received but RAZORPAY_WEBHOOK_SECRET is not configured in .env. Ignoring.");
      // We return 200 so Razorpay stops retrying, even though we didn't process it.
      return NextResponse.json({ status: "ignored_missing_secret" });
    }

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Verify the signature securely
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("🚨 Invalid webhook signature detected.");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Parse the trusted payload
    const data = JSON.parse(rawBody);

    // Handle specific events
    if (data.event === "payment.captured" || data.event === "payment.authorized") {
      const paymentEntity = data.payload.payment.entity;
      const orderId = paymentEntity.order_id; // e.g. order_IluGWxBm9U8zJ8
      
      if (orderId) {
        // Find the booking linked to this order_id
        const booking = await prisma.booking.findFirst({
          where: { razorpayOrderId: orderId }
        });

        if (booking && booking.paymentStatus !== "PAID") {
          console.log(`✅ Webhook verified: Marking booking ${booking.id} as PAID.`);
          await prisma.booking.update({
            where: { id: booking.id },
            data: { paymentStatus: "PAID" }
          });
          
          // Here we could also trigger an SMS notification to the patient
          // import { sendBookingConfirmationSMS } from "@/lib/sms";
          // await sendBookingConfirmationSMS(booking.phone, booking.id);
        }
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
