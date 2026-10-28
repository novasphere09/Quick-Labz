import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import TestDetailClient from './TestDetailClient';
import { notFound } from 'next/navigation';

interface Props {
  params: { slug: string };
}

// Generate Dynamic SEO Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const test = await prisma.test.findUnique({
    where: { slug: params.slug },
  });

  if (!test) {
    return {
      title: 'Test Not Found - QuickLabz',
    };
  }

  return {
    title: `${test.name} - Compare Lab Prices & Book Online | QuickLabz`,
    description: test.description,
    openGraph: {
      title: `${test.name} - QuickLabz`,
      description: test.description,
      type: 'website',
    },
  };
}

export default async function TestPage({ params }: Props) {
  // Validate that the test exists on the server to trigger a 404 properly if needed
  const test = await prisma.test.findUnique({
    where: { slug: params.slug },
    select: { id: true }, // lightweight query just for validation
  });

  if (!test) {
    notFound();
  }

  return <TestDetailClient />;
}
