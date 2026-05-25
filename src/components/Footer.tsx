import Link from 'next/link';
import Image from 'next/image';
import { Headphones, MessageCircle, Package, ShieldCheck, Zap } from 'lucide-react';
import PaymentMethods from './PaymentMethods';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918506965129';

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-border bg-bg-elev-1 pb-2 sm:mt-12 lg:pb-0">
      {/* Trust band */}
      <div className="border-b border-border">
        <div className="mx-auto grid max-w-page grid-cols-2 gap-3 px-3 py-6 sm:grid-cols-4 sm:gap-4 sm:px-4 sm:py-8">
          {[
            { icon: ShieldCheck, label: 'Verified', sub: 'Personal accounts' },
            { icon: Zap,         label: 'Instant',  sub: '< 10 min average' },
            { icon: Headphones,  label: 'Support',  sub: '24×7 on WhatsApp' },
            { icon: Package,     label: 'Refund',  sub: 'For any valid issue' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3 rounded-lg bg-bg-elev-2 p-3 sm:p-4">
              <Icon className="h-5 w-5 shrink-0 text-success sm:h-6 sm:w-6" />
              <div className="min-w-0">
                <div className="text-xs font-semibold text-text sm:text-sm">{label}</div>
                <div className="truncate text-[11px] text-text-muted sm:text-xs">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main link grid */}
      <div className="mx-auto max-w-page px-3 pt-5 sm:px-4 sm:py-12">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/streamhub_logo.png"
                alt="StreamHub"
                width={260}
                height={55}
                loading="eager"
                className="h-10 w-auto sm:h-12"
              />
            </Link>
            <p className="mt-3 max-w-sm text-[13px] leading-6 text-text-muted sm:text-sm sm:leading-relaxed">
              India&apos;s honest source for premium OTT, music, and AI subscriptions. Verified accounts, instant delivery, real human support.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                className="btn-whatsapp inline-flex !h-10 !px-4 text-[13px]"
              >
                <MessageCircle className="h-4 w-4" />
                Chat support
              </a>
              <a
                href="https://www.instagram.com/streamhubofficial.in"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow StreamHub on Instagram"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-bg-elev-2 text-text-muted transition-colors hover:border-accent hover:text-accent"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-5 gap-y-6 sm:grid-cols-3 lg:contents">
            <FooterCol
              heading="Shop"
              links={[
                { label: 'OTT subscriptions', href: '/category/ott-plans' },
                { label: 'Music & audio', href: '/category/music' },
                { label: 'Sports', href: '/category/sports' },
                { label: 'Trending', href: '/#trending' },
              ]}
            />
            <FooterCol
              heading="Support"
              links={[
                { label: 'Track order', href: '/track-order' },
                { label: 'Refund policy', href: '/refund-policy' },
                { label: 'FAQ', href: '/#faq' },
              ]}
            />
            <FooterCol
              heading="About"
              links={[
                { label: 'How we deliver', href: '/' },
                { label: 'Why our prices', href: '/' },
                { label: 'Privacy policy', href: '/refund-policy#privacy-policy' },
                { label: 'Terms', href: '/terms' },
              ]}
            />
          </div>
        </div>

        {/* Payment + legal */}
        <div className="mt-6 flex flex-col gap-4 border-t border-border pt-5 text-xs text-text-muted sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:pt-6">
          <div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-dim">
              We accept
            </div>
            <PaymentMethods />
          </div>
          <p className="leading-relaxed">
            © {new Date().getFullYear()} StreamHub. All product names, logos and brands belong to their respective owners and are used for identification only.
          </p>
        </div>
      </div>
    </footer>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FooterCol({
  heading,
  links,
}: {
  heading: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-accent sm:mb-3">
        {heading}
      </div>
      <ul className="space-y-1.5 sm:space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="text-[13px] leading-6 text-text-muted hover:text-text sm:text-sm">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
