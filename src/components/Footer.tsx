import Link from 'next/link';
import { Headphones, MessageCircle, Package, ShieldCheck, ShoppingBag, Zap } from 'lucide-react';
import PaymentMethods from './PaymentMethods';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919999999999';

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-border bg-bg-elev-1 pb-24 lg:pb-0">
      {/* Trust band */}
      <div className="border-b border-border">
        <div className="mx-auto grid max-w-page grid-cols-2 gap-3 px-3 py-6 sm:grid-cols-4 sm:gap-4 sm:px-4 sm:py-8">
          {[
            { icon: ShieldCheck, label: 'Verified', sub: 'Personal accounts' },
            { icon: Zap,         label: 'Instant',  sub: '< 10 min average' },
            { icon: Headphones,  label: 'Support',  sub: '24×7 on WhatsApp' },
            { icon: Package,     label: 'Replace',  sub: '7-day guarantee' },
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
      <div className="mx-auto max-w-page px-3 py-8 sm:px-4 sm:py-12">
        <div className="grid gap-8 sm:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-white">
                <ShoppingBag className="h-5 w-5" />
              </span>
              <span className="text-lg font-semibold tracking-tight">StreamHub</span>
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-text-muted">
              India&apos;s honest source for premium OTT, music, and AI subscriptions. Verified accounts, instant delivery, real human support.
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              className="btn-whatsapp mt-4 inline-flex !h-10 !px-4 text-[13px]"
            >
              <MessageCircle className="h-4 w-4" />
              Chat support
            </a>
          </div>

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
              { label: 'Replacement policy', href: '/track-order' },
              { label: 'Contact us', href: `https://wa.me/${WHATSAPP_NUMBER}` },
              { label: 'FAQ', href: '/#faq' },
            ]}
          />
          <FooterCol
            heading="About"
            links={[
              { label: 'How we deliver', href: '/' },
              { label: 'Why our prices', href: '/' },
              { label: 'Privacy policy', href: '/' },
              { label: 'Terms', href: '/' },
            ]}
          />
        </div>

        {/* Payment + legal */}
        <div className="mt-8 flex flex-col gap-4 border-t border-border pt-6 text-xs text-text-muted sm:mt-10 sm:flex-row sm:items-center sm:justify-between">
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

function FooterCol({
  heading,
  links,
}: {
  heading: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-accent">
        {heading}
      </div>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="text-sm text-text-muted hover:text-text">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
