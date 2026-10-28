export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/nextAuth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const bookings = await prisma.booking.findMany({
      where: {
        userId: userId
      },
      include: {
        laboratory: true,
        collector: true,
        bookingItems: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return NextResponse.json({ success: false, message: 'Failed to retrieve bookings' }, { status: 500 });
  }
}

