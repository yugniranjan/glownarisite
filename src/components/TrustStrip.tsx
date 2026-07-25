import { Headphones, RefreshCw, ShieldCheck, Zap } from 'lucide-react';

const ITEMS = [
  { icon: ShieldCheck, label: 'Secure checkout', sub: 'Powered by Razorpay' },
  { icon: Zap,         label: 'Fast shipping', sub: 'Quick order updates' },
  { icon: Headphones,  label: 'WhatsApp support', sub: 'Chat when you need help' },
  { icon: RefreshCw,   label: 'Easy resolution', sub: 'Admin-managed order status' },
];

/** Horizontal scroll on mobile, 4-col grid on desktop. */
export default function TrustStrip() {
  return (
    <section className="border-y border-border bg-bg-elev-1">
      <div className="mx-auto max-w-page">
        <ul className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-3 py-4 sm:gap-4 sm:px-4 md:grid md:grid-cols-4 md:overflow-visible md:py-6">
          {ITEMS.map(({ icon: Icon, label, sub }) => (
            <li
              key={label}
              className="flex min-w-[68vw] snap-start items-center gap-3 rounded-xl border border-border bg-bg-elev-2 px-4 py-3 sm:min-w-[42vw] md:min-w-0"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-success-soft text-success">
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <div className="text-sm font-semibold leading-tight text-text">{label}</div>
                <div className="text-xs text-text-muted">{sub}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
