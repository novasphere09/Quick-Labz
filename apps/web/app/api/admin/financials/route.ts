import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/nextAuth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all non-cancelled bookings
    const bookings = await prisma.booking.findMany({
      where: {
        status: { not: 'CANCELLED' }
      },
      include: {
        laboratory: {
          select: { name: true, upiId: true }
        },
        collector: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    let totalRevenue = 0;
    let totalLabPayables = 0;
    let totalGrossMargin = 0;
    let pendingLabPayouts = 0;

    const transactions = bookings.map(b => {
      totalRevenue += b.totalAmount;
      totalLabPayables += b.labBaseAmount;
      totalGrossMargin += b.grossMargin;

      if (b.labPayoutStatus === 'PENDING') {
        pendingLabPayouts += b.labBaseAmount;
      }

      return {
        id: b.id,
        bookingNumber: b.bookingNumber,
        date: b.createdAt,
        status: b.status,
        labName: b.laboratory?.name || 'Unknown',
        labUpiId: b.laboratory?.upiId || null,
        collectorName: b.collector?.name || 'Unassigned',
        totalAmount: b.totalAmount,
        labBaseAmount: b.labBaseAmount,
        grossMargin: b.grossMargin,
        labPayoutStatus: b.labPayoutStatus,
      };
    });

    return NextResponse.json({
      success: true,
      metrics: {
        totalRevenue,
        totalLabPayables,
        totalGrossMargin,
        pendingLabPayouts
      },
      transactions
    });
  } catch (error) {
    console.error('Failed to fetch financials:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

