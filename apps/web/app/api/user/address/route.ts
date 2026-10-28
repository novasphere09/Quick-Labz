import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/nextAuth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { house, street, area, city, pincode, landmark } = body;

    if (!house || !street || !area || !city || !pincode) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    // Check if it's the first address to make it default
    const existingAddressesCount = await prisma.address.count({
      where: { userId: session.user.id }
    });

    const newAddress = await prisma.address.create({
      data: {
        userId: session.user.id,
        house,
        street,
        area,
        city,
        pincode,
        landmark: landmark || '',
        isDefault: existingAddressesCount === 0
      }
    });

    return NextResponse.json({ success: true, address: newAddress });
  } catch (error) {
    console.error('Error adding address:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
