import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    // Fetch all active laboratories to determine which cities and areas we service
    const labs = await prisma.laboratory.findMany({
      where: { active: true },
      select: {
        city: true,
        area: true,
      },
    });

    // Group areas by city
    const locationMap = new Map<string, Set<string>>();

    for (const lab of labs) {
      if (!locationMap.has(lab.city)) {
        locationMap.set(lab.city, new Set<string>());
      }
      locationMap.get(lab.city)!.add(lab.area);
    }

    // Convert map to a friendly JSON structure
    const cities = Array.from(locationMap.keys()).map(city => ({
      name: city,
      areas: Array.from(locationMap.get(city)!),
    }));

    return NextResponse.json({ success: true, cities });
  } catch (error) {
    console.error('Failed to fetch active locations:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

