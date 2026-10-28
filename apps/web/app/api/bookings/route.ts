import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateReferralEarning } from '@/lib/referral';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/nextAuth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const session = await getServerSession(authOptions);

    let {
      userId,
      bookingNumber,
      patientName,
      patientAge,
      patientGender,
      patientPhone,
      patientEmail,
      house,
      street,
      area,
      city,
      state,
      pincode,
      landmark,
      labId,
      scheduledDate,
      timeSlot,
      fastingWindow,
      totalAmount,
      paymentStatus,
      referralCode,
      notes,
      itemType,
      itemId,
      itemName,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      deliveryFee,
      gstAmount,
    } = body;

    // SECURITY: Prevent IDOR by enforcing the server session userId
    if (session?.user?.id) {
      // If logged in, force the userId to be the logged-in user, ignoring what the client sent
      userId = session.user.id;
    } else {
      // If not logged in, enforce Guest checkout (userId must be null)
      userId = null;
    }

    // Verify Razorpay signature if online payment
    if (paymentStatus === 'PAID' && razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      const crypto = require('crypto');
      const secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_placeholder_secret';
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(razorpay_order_id + '|' + razorpay_payment_id)
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        return NextResponse.json({ success: false, message: 'Invalid payment signature' }, { status: 400 });
      }
    }

    // Estimate internal base wholesale amount & referral
    const isPackage = itemType === 'PACKAGE';
    const labBaseAmount = isPackage ? 2500 : Math.round(totalAmount * 0.65);
    const grossMargin = totalAmount - labBaseAmount;
    
    // Check if referral partner exists
    let referralPartnerId: string | null = null;
    let referralEarned = 0;
    
    if (referralCode) {
      const partner = await prisma.referralPartner.findUnique({
        where: { code: referralCode.toUpperCase() },
      });
      if (partner) {
        referralPartnerId = partner.id;
        // Calculate dynamic percentage commission
        referralEarned = parseFloat((totalAmount * (partner.commissionRate / 100)).toFixed(2));
        
        // Increment pending earnings
        await prisma.referralPartner.update({
          where: { id: partner.id },
          data: {
            totalEarnings: { increment: referralEarned },
            pendingEarnings: { increment: referralEarned },
          },
        });
      }
    }

    // Default to first partner lab if not provided
    const firstLab = await prisma.laboratory.findFirst();
    const activeLabId = labId || firstLab?.id || 'apex-diagnostic-care';

    // Create booking in database
    const booking = await prisma.booking.create({
      data: {
        userId: userId || null,
        bookingNumber: bookingNumber || `QLZ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        patientName,
        patientAge: parseInt(patientAge, 10) || 30,
        patientGender: patientGender || 'Male',
        patientPhone: patientPhone || '9876543210',
        patientEmail,
        house,
        street,
        area,
        city: city || 'Delhi NCR',
        state: state || 'Delhi NCR',
        pincode: pincode || '201010',
        landmark,
        labId: activeLabId,
        scheduledDate: scheduledDate || '2026-08-20',
        timeSlot: timeSlot || '07:00 AM - 08:00 AM',
        fastingWindow,
        totalAmount: parseFloat(totalAmount) || 399,
        labBaseAmount,
        grossMargin,
        deliveryFee: parseFloat(deliveryFee) || 0,
        gstAmount: parseFloat(gstAmount) || 0,
        collectorPayoutAmount: parseFloat(deliveryFee) || 0,
        status: 'BOOKING_RECEIVED',
        paymentStatus: paymentStatus || 'PENDING',
        razorpayOrderId: razorpay_order_id || null,
        razorpayPaymentId: razorpay_payment_id || null,
        referralCode: referralCode ? referralCode.toUpperCase() : null,
        referralPartnerId,
        referralEarned,
        notes,
        bookingItems: {
          create: [
            {
              itemType: itemType || 'TEST',
              itemName: itemName || 'Blood Test',
              price: parseFloat(totalAmount) || 399,
            },
          ],
        },
      },
    });

    if (userId) {
      // Upsert patient profile (just create if not exists for now)
      const existingProfile = await prisma.patientProfile.findFirst({
        where: { userId: userId }
      });
      if (!existingProfile) {
        await prisma.patientProfile.create({
          data: {
            userId: userId,
            fullName: patientName,
            age: parseInt(patientAge, 10) || 30,
            gender: patientGender || 'Male',
          }
        });
      }

      // Check if address exists, otherwise create
      const existingAddress = await prisma.address.findFirst({
        where: { 
          userId: userId,
          house: house,
          street: street,
          pincode: pincode
        }
      });
      if (!existingAddress) {
        const addressCount = await prisma.address.count({ where: { userId } });
        await prisma.address.create({
          data: {
            userId: userId,
            house,
            street,
            area,
            city: city || 'Delhi NCR',
            state: state || 'Delhi NCR',
            pincode: pincode || '201010',
            landmark: landmark || null,
            isDefault: addressCount === 0 // Make default if it's the first one
          }
        });
      }
    }


    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json(
      { success: false, message: 'Your booking was not completed. No payment has been charged.' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        laboratory: true,
        collector: true,
        bookingItems: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, bookings });
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Failed to retrieve bookings' });
  }
}

