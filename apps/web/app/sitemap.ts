import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://quicklabz.com';

  // Fetch all active tests
  const tests = await prisma.test.findMany({
    select: {
      id: true,
      updatedAt: true,
    }
  });

  // Fetch all active packages
  const packages = await prisma.healthPackage.findMany({
    select: {
      id: true,
      updatedAt: true,
    }
  });

  // Core static routes
  const staticRoutes = [
    '',
    '/search',
    '/login',
    '/register',
    '/partner-login',
    '/collector-register',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic Test routes
  const testRoutes = tests.map((test) => ({
    url: `${baseUrl}/tests/${test.id}`,
    lastModified: test.updatedAt,
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  // Dynamic Package routes
  const packageRoutes = packages.map((pkg) => ({
    url: `${baseUrl}/packages/${pkg.id}`,
    lastModified: pkg.updatedAt,
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...testRoutes, ...packageRoutes];
}
