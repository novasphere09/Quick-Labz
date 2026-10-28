import { prisma } from '@/lib/prisma';
import { HomePageClient } from '@/components/HomePageClient';

export const revalidate = 3600; // Cache the homepage for 1 hour to reduce DB hits

export default async function HomePage() {
  // Fetch sequentially to prevent exhausting small connection pools (e.g. limit=3) during Vercel build
  const labs = await prisma.laboratory.findMany({
    where: { active: true },
    select: {
      id: true,
      name: true,
      slug: true,
      area: true,
      city: true,
      partnerStatus: true,
      rating: true,
      turnaroundText: true
    },
    take: 8
  });

  const tests = await prisma.test.findMany({
    where: { active: true },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      sellingPrice: true,
      popular: true,
      fastingRequired: true,
      fastingDurationHours: true,
      sampleType: true,
      turnaroundHours: true
    }
  });

  const packages = await prisma.healthPackage.findMany({
    where: { active: true },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      sellingPrice: true,
      popular: true
    },
    take: 4
  });

  return (
    <HomePageClient 
      initialLabs={labs} 
      initialTests={tests} 
      initialPackages={packages} 
    />
  );
}
