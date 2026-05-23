import { Lock } from 'lucide-react';

/**
 * Payments are handled by Razorpay, which covers UPI, cards, net banking and
 * wallets — so we surface a single trusted "Secured by Razorpay" badge instead
 * of individual brand logos.
 */
export default function PaymentMethods({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-2.5 gap-y-1.5 ${className}`}>
      <span className="inline-flex h-7 items-center gap-1.5 rounded-md border border-border bg-bg-elev-2 px-2.5 text-[11px] font-semibold text-text">
        <Lock className="h-3 w-3 text-success" />
        Secured by <span className="text-[#3395FF]">Razorpay</span>
      </span>
      <span className="text-[11px] text-text-muted">
        UPI · Cards · Net Banking · Wallets &amp; more
      </span>
    </div>
  );
}
