import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/nextAuth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'COLLECTOR') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const collector = await prisma.collector.findUnique({
      where: { userId: session.user.id },
      include: {
        bookings: {
          where: {
            status: { in: ['COLLECTOR_ASSIGNED', 'COLLECTION_SCHEDULED', 'SAMPLE_COLLECTED', 'CANCELLED'] }
          },
          orderBy: { createdAt: 'desc' },
          include: {
            laboratory: true,
            bookingItems: {
              include: { test: true, package: true }
            }
          }
        }
      }
    });

    if (!collector) {
      return NextResponse.json({ success: false, message: 'Collector profile not found' }, { status: 404 });
    }

    // Format bookings for the portal
    const formattedBookings = collector.bookings.map(b => ({
      id: b.id,
      bookingNumber: b.bookingNumber,
      patientName: b.patientName,
      patientAge: b.patientAge,
      patientGender: b.patientGender,
      patientPhone: b.patientPhone,
      address: `${b.house}, ${b.street}, ${b.area}, ${b.city} - ${b.pincode}`,
      landmark: b.landmark,
      labName: b.laboratory.name,
      testName: b.bookingItems[0]?.itemName || 'Multiple Tests',
      scheduledDate: b.scheduledDate,
      timeSlot: b.timeSlot,
      status: b.status,
      totalAmount: b.totalAmount,
      paymentStatus: b.paymentStatus,
      collectorPayoutAmount: b.collectorPayoutAmount,
    }));

    return NextResponse.json({ 
      success: true, 
      collector: {
        ...collector,
        bookings: formattedBookings
      }
    });
  } catch (error) {
    console.error('Error fetching collector portal data:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'COLLECTOR') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { bookingId, status } = await req.json();

    if (!bookingId || !status) {
      return NextResponse.json({ success: false, message: 'Missing bookingId or status' }, { status: 400 });
    }

    const collector = await prisma.collector.findUnique({
      where: { userId: session.user.id }
    });

    if (!collector) {
      return NextResponse.json({ success: false, message: 'Collector profile not found' }, { status: 404 });
    }

    // Verify booking belongs to this collector
    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, collectorId: collector.id }
    });

    if (!booking) {
      return NextResponse.json({ success: false, message: 'Booking not found or not assigned to you' }, { status: 404 });
    }

    // Update the booking status
    let updatedBooking;
    
    if (status === 'UNASSIGN_ME') {
      updatedBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: { 
          status: 'LAB_CONFIRMED',
          collectorId: null
        }
      });
    } else {
      updatedBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: { status }
      });
    }

    return NextResponse.json({ success: true, booking: updatedBooking });
  } catch (error) {
    console.error('Error updating collector booking:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

