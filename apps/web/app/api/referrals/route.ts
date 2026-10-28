import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const partners = await prisma.referralPartner.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, partners });
  } catch (e) {
    console.error('Error fetching referral partners:', e);
    return NextResponse.json({ success: false, error: 'Failed to fetch referral partners', partners: [] }, { status: 500 });
  }
}

