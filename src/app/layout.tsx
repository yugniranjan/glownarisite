import type { Metadata, Viewport } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import PromoBanner from '@/components/PromoBanner';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import { ThemeScript } from '@/components/ThemeToggle';
import ToastProvider from '@/components/ToastProvider';
import './globals.css';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Glownari — curated beauty, fashion and lifestyle picks',
    template: '%s · Glownari',
  },
  description:
    'A flexible e-commerce storefront for curated products, secure Razorpay checkout, tracked orders, and WhatsApp support.',
  openGraph: {
    title: 'Glownari',
    description: 'Curated products, secure checkout, tracked orders, and real support.',
    url: SITE_URL,
    siteName: 'Glownari',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Glownari',
    description: 'Curated products at honest prices.',
  },
  icons: {
    icon: '/glownari-mark.png',
    shortcut: '/glownari-mark.png',
    apple: '/icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#b62e59',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className="light"
      style={{ colorScheme: 'light' }}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="bg-bg text-text">
        <ThemeScript />
        <div className="flex min-h-screen flex-col">
          <PromoBanner />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <FloatingWhatsApp />
        <ToastProvider />
        <AnalyticsTracker />
      </body>
    </html>
  );
}
