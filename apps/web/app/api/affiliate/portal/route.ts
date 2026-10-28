export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/nextAuth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'AFFILIATE') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const partner = await prisma.referralPartner.findUnique({
      where: { userId: session.user.id },
      include: {
        bookings: {
          orderBy: { createdAt: 'desc' },
          include: {
            bookingItems: true,
          }
        },
        transactions: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!partner) {
      return NextResponse.json({ success: false, message: 'Partner profile not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, partner });
  } catch (error) {
    console.error('Affiliate portal error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

