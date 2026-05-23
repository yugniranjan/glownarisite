/**
 * Lightweight inline SVG wordmarks for trusted payment methods.
 * Plain SVG so we never ship 3rd-party brand assets we don't have rights to.
 */
export default function PaymentMethods({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {METHODS.map((m) => (
        <span
          key={m}
          className="inline-flex h-7 items-center rounded border border-border bg-bg-elev-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted"
        >
          {m}
        </span>
      ))}
    </div>
  );
}

const METHODS = ['UPI', 'GPay', 'PhonePe', 'Paytm', 'Visa', 'Mastercard', 'Rupay'];
