import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { unstable_cache } from 'next/cache';

export const revalidate = 300;

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const getCachedCategories = unstable_cache(
      async () => {
        return prisma.testCategory.findMany({
          orderBy: { sortOrder: 'asc' }
        });
      },
      ['categories-api-all'],
      { revalidate: 300 }
    );

    const categories = await getCachedCategories();

    return NextResponse.json({ success: true, categories }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (e) {
    console.error('Error fetching categories from DB:', e);
    return NextResponse.json({ success: false, error: 'Failed to fetch categories', categories: [] }, { status: 500 });
  }
}

