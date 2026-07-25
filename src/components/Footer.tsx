import Link from 'next/link';
import Image from 'next/image';
import { Headphones, MessageCircle, Package, ShieldCheck, Zap } from 'lucide-react';
import PaymentMethods from './PaymentMethods';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918506965129';

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-border bg-[linear-gradient(180deg,var(--bg-elev-1),var(--bg))] pb-2 sm:mt-12 lg:pb-0">
      {/* Trust band */}
      <div className="border-b border-border bg-bg-elev-2/70">
        <div className="mx-auto grid max-w-page grid-cols-2 gap-2 px-3 py-4 sm:grid-cols-4 sm:gap-3 sm:px-4 sm:py-5">
          {[
            { icon: ShieldCheck, label: 'Secure', sub: 'Razorpay checkout' },
            { icon: Zap,         label: 'Fast',  sub: 'Quick processing' },
            { icon: Headphones,  label: 'Support',  sub: 'WhatsApp help' },
            { icon: Package,     label: 'Tracked',  sub: 'Order updates' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3 rounded-xl border border-border bg-bg-elev-2 px-3 py-3 shadow-card">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-success-soft text-success">
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <div className="text-sm font-black text-text">{label}</div>
                <div className="truncate text-xs font-medium text-text-muted">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main link grid */}
      <div className="mx-auto max-w-page px-3 pt-6 sm:px-4 sm:py-10">
        <div className="grid gap-7 rounded-2xl border border-border bg-bg-elev-2 p-4 shadow-card sm:p-6 lg:grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr] lg:gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex h-24 w-[230px] items-center justify-start overflow-hidden rounded-lg bg-white px-2 py-1">
              <Image
                src="/glownari-logo-full.png"
                alt="Glownari"
                width={360}
                height={160}
                className="h-full w-full object-contain"
              />
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-6 text-text-muted">
              A premium storefront for curated products, secure payments, easy order tracking, coupons, and real human support.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                className="btn-whatsapp inline-flex !h-10 !px-4 text-sm"
              >
                <MessageCircle className="h-4 w-4" />
                Chat support
              </a>
              <a
                href="https://www.instagram.com/glownariofficial.in"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Glownari on Instagram"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-bg-elev-2 text-text-muted transition-colors hover:border-accent hover:text-accent"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3 lg:contents">
            <FooterCol
              heading="Shop"
              links={[
                { label: 'All products', href: '/#products' },
                { label: 'Categories', href: '/#products' },
                { label: 'Best value', href: '/#trending' },
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
                { label: 'How orders work', href: '/#faq' },
                { label: 'Why shop here', href: '/#faq' },
                { label: 'Privacy policy', href: '/refund-policy#privacy-policy' },
                { label: 'Terms', href: '/terms' },
              ]}
            />
          </div>
        </div>

        {/* Payment + legal */}
        <div className="mt-5 flex flex-col gap-4 rounded-xl border border-border bg-bg-elev-2 px-4 py-4 text-xs text-text-muted shadow-card sm:mt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-dim">
              We accept
            </div>
            <PaymentMethods />
          </div>
          <p className="max-w-xl leading-relaxed sm:text-right">
            © {new Date().getFullYear()} Glownari. Product names, images, prices, and categories are managed from your admin panel.
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
    <div className="min-w-0">
      <div className="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-accent">
        {heading}
      </div>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="text-sm font-medium leading-6 text-text-muted transition hover:text-accent">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
