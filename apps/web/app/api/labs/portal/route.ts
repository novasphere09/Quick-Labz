import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/nextAuth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || session.user.role !== 'LAB_PARTNER') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const lab = await prisma.laboratory.findUnique({
      where: { userId: session.user.id },
      include: {
        bookings: {
          orderBy: { createdAt: 'desc' },
          include: {
            bookingItems: true
          }
        }
      }
    });

    if (!lab) {
      return NextResponse.json({ success: false, message: 'Lab not found' }, { status: 404 });
    }

    const collectors = await prisma.collector.findMany({
      where: { active: true },
      select: { id: true, name: true, area: true }
    });

    return NextResponse.json({ success: true, lab, collectors });
  } catch (error) {
    console.error('Portal error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

