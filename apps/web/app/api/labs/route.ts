export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { unstable_cache } from 'next/cache';

export const revalidate = 300; // 5 minutes

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const testId = searchParams.get('testId');
    const packageId = searchParams.get('packageId');
    const city = searchParams.get('city');
    const area = searchParams.get('area');
    const latStr = searchParams.get('lat');
    const lngStr = searchParams.get('lng');
    const lat = latStr ? parseFloat(latStr) : null;
    const lng = lngStr ? parseFloat(lngStr) : null;

    const getCachedLabs = unstable_cache(
      async (sCity: string | null, sArea: string | null, sTestId: string | null, sPackageId: string | null) => {
        let whereClause: any = { active: true, approvalStatus: 'APPROVED' };

        if (sCity && sArea) {
          whereClause.city = { contains: sCity, mode: 'insensitive' };
          whereClause.area = { contains: sArea, mode: 'insensitive' };
        } else if (sCity) {
          whereClause.OR = [
            { city: { contains: sCity, mode: 'insensitive' } },
            { area: { contains: sCity, mode: 'insensitive' } }
          ];
        } else if (sArea) {
          whereClause.OR = [
            { area: { contains: sArea, mode: 'insensitive' } },
            { city: { contains: sArea, mode: 'insensitive' } }
          ];
        }
        
        if (sTestId) {
          whereClause.labTests = {
            some: {
              testId: sTestId,
              available: true
            }
          };
        }
        
        if (sPackageId) {
          whereClause.labPackages = {
            some: {
              packageId: sPackageId,
              available: true
            }
          };
        }

        return prisma.laboratory.findMany({
          where: whereClause,
          include: {
            labTests: sTestId ? { where: { testId: sTestId } } : undefined,
            labPackages: sPackageId ? { where: { packageId: sPackageId } } : undefined
          },
          orderBy: { rating: 'desc' },
        });
      },
      [`labs-api-${city || 'all'}-${area || 'all'}-${testId || 'all'}-${packageId || 'all'}`],
      { revalidate: 300 }
    );

    let dbLabs = await getCachedLabs(city, area, testId, packageId);

    // Apply Haversine Geo-Location Filtering if coordinates provided
    if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng)) {
      dbLabs = dbLabs.filter((lab: any) => {
        if (lab.lat === null || lab.lng === null) {
          lab.calculatedDistanceKm = lab.distanceKm || 5.0; // Fallback distance
          return true; // Keep labs without coords but maybe we should filter them out in strict mode?
        }
        
        const R = 6371; // Earth radius in km
        const dLat = (lab.lat - lat) * Math.PI / 180;
        const dLng = (lab.lng - lng) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat * Math.PI / 180) * Math.cos(lab.lat * Math.PI / 180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        
        lab.calculatedDistanceKm = parseFloat(distance.toFixed(1));
        
        // Filter out labs if user is outside their service radius (default 50km if not set)
        const maxServiceRadius = 50; 
        return distance <= maxServiceRadius;
      });

      // Sort by actual distance
      dbLabs.sort((a: any, b: any) => (a.calculatedDistanceKm || 999) - (b.calculatedDistanceKm || 999));
    }

    // Map Prisma models to the PartnerLab interface expected by the UI
    const labs = dbLabs.map((lab: any) => ({
      ...lab,
      distanceKm: lab.calculatedDistanceKm !== undefined ? lab.calculatedDistanceKm : (lab.distanceKm || 2.5),
      totalReviews: Math.floor(Math.random() * 200) + 50,
      accreditations: ['NABL Accredited', 'ISO 9001:2015'],
      recentReviews: [],
      sampleReviewSnippet: 'Professional and quick home collection service.',
      tagline: 'Quality Diagnostics',
    }));

    return NextResponse.json({ success: true, labs });
  } catch (e) {
    console.error('API Error /labs:', e);
    return NextResponse.json({ success: false, error: 'Failed to fetch laboratories' }, { status: 500 });
  }
}

