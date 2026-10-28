import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/nextAuth';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'COLLECTOR') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { active } = await req.json();

    if (typeof active !== 'boolean') {
      return NextResponse.json({ success: false, message: 'Invalid active status' }, { status: 400 });
    }

    const collector = await prisma.collector.findUnique({
      where: { userId: session.user.id }
    });

    if (!collector) {
      return NextResponse.json({ success: false, message: 'Collector profile not found' }, { status: 404 });
    }

    const updatedCollector = await prisma.collector.update({
      where: { id: collector.id },
      data: { active }
    });

    return NextResponse.json({ success: true, active: updatedCollector.active });
  } catch (error) {
    console.error('Error updating collector status:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
