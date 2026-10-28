import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import '../globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { WhatsAppFloating } from '@/components/WhatsAppFloating';
import { AuthProvider } from '@/components/AuthProvider';
import { AIChatWidget } from '@/components/AIChatWidget';
import { CookieConsent } from '@/components/CookieConsent';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'QuickLabz - Blood Tests, From the Comfort of Home',
  description:
    'Choose from trusted nearby partner laboratories, compare blood test prices, book doorstep sample collection, and receive secure digital pathology reports.',
  keywords: [
    'Blood Test at Home',
    'Home Blood Sample Collection',
    'Book Blood Test Online',
    'Blood Test Home Collection Delhi NCR',
    'Lipid Profile Test at Home',
    'CBC Test at Home',
    'HbA1C Test Online',
    'Thyroid Test TSH',
    'Full Body Health Checkup',
  ],
  authors: [{ name: 'QuickLabz HealthTech' }],
  metadataBase: new URL('https://quicklabzz.netlify.app'),
  icons: {
    icon: '/logo.png',
  },
  openGraph: {
    title: 'QuickLabz - Blood Tests, From the Comfort of Home',
    description:
      'Book blood tests online with doorstep sample collection from certified partner laboratories. Transparent pricing & instant digital reports.',
    url: 'https://quicklabzz.netlify.app',
    siteName: 'QuickLabz',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'QuickLabz Social Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QuickLabz | Blood Tests From Home',
    description: 'Book home blood sample collection from top nearby partner pathology labs.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-surface-bg text-surface-dark antialiased overflow-x-hidden">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFloating />
          <AIChatWidget />
          <CookieConsent />
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
