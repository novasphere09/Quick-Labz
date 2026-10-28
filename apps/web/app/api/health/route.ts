import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const startTime = performance.now();
    
    // Check Database Health
    await prisma.$queryRaw`SELECT 1`;
    const dbLatency = performance.now() - startTime;

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: {
          status: 'up',
          latencyMs: Math.round(dbLatency),
        },
        api: {
          status: 'up',
        }
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Health Check Failed:', error);
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 503 });
  }
}

