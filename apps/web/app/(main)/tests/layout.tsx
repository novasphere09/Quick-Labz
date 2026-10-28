import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blood Tests & Pathology Directory | QuickLabz',
  description: 'Search and compare blood tests from top certified pathology labs near you. Book doorstep sample collection with transparent pricing.',
};

export default function TestsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
