export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { unstable_cache } from 'next/cache';

export const revalidate = 300; // 5 minutes

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  const slug = searchParams.get('slug');
  
  try {
    const city = searchParams.get('city');

    const labFilter = city ? {
      city: { equals: city, mode: 'insensitive' as const },
      approvalStatus: 'APPROVED'
    } : {
      approvalStatus: 'APPROVED'
    };

    const whereClause: any = { active: true };
    if (slug) {
      whereClause.slug = slug;
    } else if (q) {
      whereClause.OR = [
        { name: { contains: q, mode: 'insensitive' as const } },
        { description: { contains: q, mode: 'insensitive' as const } },
      ];
    }

    const tests = await prisma.test.findMany({
      where: whereClause,
      include: {
        category: true,
        labTests: {
          where: {
            available: true,
            laboratory: labFilter,
          },
        },
      },
    });

    // Strip internal labPrice for public customer security
    const sanitizedTests = tests
      .filter((t: any) => {
        if (city && (!t.labTests || t.labTests.length === 0)) {
          return false;
        }
        return true;
      })
      .map((t: any) => {
      // Dynamic Pricing: find the lowest selling price from active labs
      let startingPrice = t.sellingPrice; // fallback to global default
      if (t.labTests && t.labTests.length > 0) {
        const prices = t.labTests
          .map((lt: any) => lt.calculatedSellingPrice || t.sellingPrice)
          .filter((p: number) => p > 0);
        
        if (prices.length > 0) {
          startingPrice = Math.min(...prices);
        }
      }

      return {
        id: t.id,
        name: t.name,
        slug: t.slug,
        categoryId: t.categoryId,
        categoryName: t.category?.name || 'General',
        sellingPrice: startingPrice,
        sampleType: t.sampleType,
        fastingRequired: t.fastingRequired,
        fastingDurationHours: t.fastingDurationHours,
        preparationNotes: t.preparationNotes,
        turnaroundHours: t.turnaroundHours,
        description: t.description,
        popular: t.popular,
      };
    });

    return NextResponse.json({ success: true, tests: sanitizedTests }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (e) {
    console.error('Error fetching tests from DB:', e);
    return NextResponse.json({ success: false, error: 'Failed to fetch tests', tests: [] }, { status: 500 });
  }
}

