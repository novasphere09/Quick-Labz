import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Health Checkup Packages | QuickLabz',
  description: 'Book comprehensive preventive health checkup packages from certified partner labs with free doorstep sample collection.',
};

export default function PackagesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
