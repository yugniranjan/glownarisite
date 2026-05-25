import { ShieldCheck } from 'lucide-react';

export default function PaymentMethods({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-2.5 gap-y-1.5 ${className}`}>
      <span className="inline-flex h-7 items-center gap-1.5 rounded-md border border-border bg-bg-elev-2 px-2.5 text-[11px] font-semibold text-text">
        <ShieldCheck className="h-3 w-3 text-success" />
        Manual UPI verification
      </span>
      <span className="text-[11px] text-text-muted">
        GPay · PhonePe · Paytm · BHIM · UPI
      </span>
    </div>
  );
}
