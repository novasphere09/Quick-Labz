import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/nextAuth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || session.user.role !== 'LAB_PARTNER') {
      return NextResponse.json({ success: false, message: 'Unauthorized. Only lab partners can register labs.' }, { status: 401 });
    }

    const body = await request.json();
    
    const { name, area, city, pincode, phone, email, address, turnaroundText, documentUrl, frontImageUrl, insideImageUrl, equipmentImageUrl } = body;

    if (!name || !area || !city || !pincode || !phone || !email || !address || !documentUrl || !frontImageUrl || !insideImageUrl || !equipmentImageUrl) {
      return NextResponse.json({ success: false, message: 'All fields are required.' }, { status: 400 });
    }

    // Generate a unique slug
    let baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existingLab = await prisma.laboratory.findUnique({ where: { slug } });
      if (!existingLab) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const lab = await prisma.laboratory.create({
      data: {
        name,
        slug,
        area,
        city,
        pincode,
        phone,
        email,
        address,
        turnaroundText: turnaroundText || 'Same Day / 24 Hours',
        documentUrl,
        frontImageUrl,
        insideImageUrl,
        equipmentImageUrl,
        active: false, // Requires admin approval
        userId: session.user.id
      }
    });

    return NextResponse.json({ success: true, lab });
  } catch (error) {
    console.error('Lab registration error:', error);
    return NextResponse.json({ success: false, message: 'Failed to register laboratory.' }, { status: 500 });
  }
}
