import Link from 'next/link';
import Image from 'next/image';
import { Headphones, Instagram, MessageCircle, Package, ShieldCheck, Zap } from 'lucide-react';
import PaymentMethods from './PaymentMethods';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918506965129';

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-border bg-bg-elev-1 pb-2 sm:mt-14 lg:pb-0">
      <div className="border-b border-border">
        <div className="site-container grid grid-cols-2 py-5 sm:grid-cols-4 sm:py-6">
          {[
            { icon: ShieldCheck, label: 'Secure', sub: 'Razorpay checkout' },
            { icon: Zap,         label: 'Fast',  sub: 'Quick processing' },
            { icon: Headphones,  label: 'Support',  sub: 'WhatsApp help' },
            { icon: Package,     label: 'Tracked',  sub: 'Order updates' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3 border-border px-2 py-3 sm:border-r sm:px-5 sm:last:border-r-0">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-success-soft text-success">
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

      <div className="site-container py-9 sm:py-11">
        <div className="grid gap-9 lg:grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr] lg:gap-12">
          <div>
            <Link href="/" className="inline-flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-accent/20 bg-bg-elev-1">
              <Image
                src="/glownari-logo.png"
                alt="Glownari"
                width={240}
                height={240}
                loading="eager"
                className="h-full w-full object-cover"
              />
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-6 text-text-muted">
              Thoughtfully curated fashion, beauty, jewellery and everyday essentials, with secure payments and real human support.
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
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-bg-elev-2 text-text-muted transition-colors hover:border-accent hover:text-accent"
              >
                <Instagram className="h-5 w-5" />
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

        <div className="mt-9 flex flex-col gap-5 border-t border-border pt-6 text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between">
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
