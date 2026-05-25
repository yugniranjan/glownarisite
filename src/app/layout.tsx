import type { Metadata, Viewport } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import './globals.css';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'StreamHub — Premium OTT subscriptions at honest prices',
    template: '%s · StreamHub',
  },
  description:
    'Verified Netflix, Prime, Hotstar, Spotify and more — at India-friendly prices. Instant delivery, tracked orders, 24×7 support.',
  openGraph: {
    title: 'StreamHub',
    description: 'Premium OTT subscriptions at honest prices. Instant delivery, real support.',
    url: SITE_URL,
    siteName: 'StreamHub',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StreamHub',
    description: 'Premium OTT subscriptions at honest prices.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#0a0e1a',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="bg-bg text-text">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
