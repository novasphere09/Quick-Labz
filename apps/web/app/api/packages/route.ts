export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { unstable_cache } from 'next/cache';

export const revalidate = 300; // 5 minutes

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get('city');

    const labFilter = city ? {
      city: { equals: city, mode: 'insensitive' as const },
      approvalStatus: 'APPROVED'
    } : {
      approvalStatus: 'APPROVED'
    };

    const packages = await prisma.healthPackage.findMany({
      where: { 
        active: true,
        ...(city && {
          OR: [
            { laboratoryId: null },
            { laboratory: { city: { equals: city, mode: 'insensitive' as const }, approvalStatus: 'APPROVED' } }
          ]
        })
      },
      include: {
        laboratory: true,
        packageTests: {
          include: {
            test: true,
          }
        },
        labPackages: {
          where: {
            available: true,
            laboratory: labFilter,
          },
          include: {
            laboratory: true,
          }
        },
      },
    });

    // Removed getCachedPackages call

    const sanitizedPackages = packages
      .filter((p: any) => {
        // If city is specified, we must verify the package has an active lab in that city.
        // For global packages (laboratoryId === null), labPackages must have at least one entry.
        // For custom packages (laboratoryId !== null), the Prisma query already filtered it by city.
        if (city && p.laboratoryId === null && (!p.labPackages || p.labPackages.length === 0)) {
          return false;
        }
        return true;
      })
      .map((p: any) => {
        // Dynamic Pricing: find the lowest selling price from active labs
        let startingPrice = p.sellingPrice; // fallback to global default
        let providerLab = p.laboratory || null; // For custom packages

        if (p.labPackages && p.labPackages.length > 0) {
          // Sort by lowest calculated price
          const availableLabs = [...p.labPackages].sort((a, b) => 
            (a.calculatedSellingPrice || p.sellingPrice) - (b.calculatedSellingPrice || p.sellingPrice)
          );
          
          startingPrice = availableLabs[0].calculatedSellingPrice || p.sellingPrice;
          
          if (!providerLab) {
            // For global packages, use the lab offering the lowest price (or we can just pass multiple labs flag later)
            providerLab = availableLabs[0].laboratory;
          }
        }

        const tests = p.packageTests ? p.packageTests.map((pt: any) => ({
          id: pt.test.id,
          name: pt.test.name,
          description: pt.test.description
        })) : [];

        return {
          id: p.id,
          name: p.name,
          slug: p.slug,
          sellingPrice: startingPrice,
          description: p.description,
          popular: p.popular,
          includedTestsSummary: p.includedTestsSummary,
          isCustom: p.laboratoryId !== null,
          tests: tests,
          lab: providerLab ? {
            id: providerLab.id,
            name: providerLab.name,
            rating: providerLab.rating,
            area: providerLab.area,
            city: providerLab.city,
            partnerStatus: providerLab.partnerStatus
          } : null
        };
      });

    return NextResponse.json({ success: true, packages: sanitizedPackages }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (e) {
    console.error('Error fetching packages from DB:', e);
    return NextResponse.json({ success: false, error: 'Failed to fetch packages', packages: [] }, { status: 500 });
  }
}

