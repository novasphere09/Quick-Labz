import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/nextAuth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        laboratory: true,
        collector: true,
        referralPartner: true,
      }
    });
    
    // Map them to the shape expected by the frontend
    const formattedBookings = bookings.map(b => ({
      id: b.id,
      bookingNumber: b.bookingNumber,
      patientName: b.patientName,
      patientPhone: b.patientPhone,
      itemName: 'Multiple Tests', // For now, we can hardcode or aggregate
      sellingPrice: b.totalAmount,
      labPrice: b.labBaseAmount,
      grossMargin: b.grossMargin,
      referralCode: b.referralCode || '',
      referralEarned: b.referralEarned || 0,
      labId: b.labId,
      labName: b.laboratory?.name || 'Unassigned',
      collector: b.collector?.name || 'Unassigned',
      status: b.status,
      paymentStatus: b.paymentStatus,
      scheduledDate: b.scheduledDate,
    }));

    return NextResponse.json({ success: true, bookings: formattedBookings });
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

