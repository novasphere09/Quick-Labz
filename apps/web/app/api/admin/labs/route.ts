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

    const labs = await prisma.laboratory.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, labs });
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Failed to fetch laboratories' }, { status: 500 });
  }
}

