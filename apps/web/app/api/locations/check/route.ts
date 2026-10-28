export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pincode = searchParams.get('pincode');
    
    if (!pincode) {
      return NextResponse.json({ success: false, message: 'Missing pincode' }, { status: 400 });
    }

    // 1. Check Laboratory table for any active lab in this pincode
    const lab = await prisma.laboratory.findFirst({
      where: { 
        pincode: pincode,
        active: true
      },
      select: { city: true, area: true }
    });

    if (lab) {
      return NextResponse.json({ 
        success: true, 
        isServiced: true,
        city: lab.city,
        area: lab.area
      });
    }

    // 2. Check ServiceArea table as a fallback
    const serviceArea = await prisma.serviceArea.findUnique({
      where: { pincode },
    });

    if (serviceArea && serviceArea.isServed) {
      return NextResponse.json({ 
        success: true, 
        isServiced: true,
        city: serviceArea.city,
        area: serviceArea.areaName
      });
    }

    return NextResponse.json({ success: true, isServiced: false });
  } catch (error) {
    console.error('Failed to check location:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

