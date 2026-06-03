import Image from 'next/image';

export default function PageLoader({
  label = 'Loading StreamHub...',
  fullScreen = false,
}: {
  label?: string;
  fullScreen?: boolean;
}) {
  return (
    <div className={`grid place-items-center px-4 py-12 ${fullScreen ? 'min-h-screen' : 'min-h-[60vh]'}`}>
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative grid h-16 w-16 place-items-center rounded-xl border border-border bg-bg-elev-2 shadow-soft">
          <div className="absolute inset-0 rounded-xl border border-accent/30" />
          <div className="absolute inset-[-4px] rounded-[16px] border border-accent/20 border-t-accent animate-spin" />
          <Image
            src="/streamhub_logo.png"
            alt="StreamHub"
            width={38}
            height={38}
            className="h-9 w-9 object-contain"
            priority
          />
        </div>
        <div>
          <div className="text-sm font-semibold text-text">{label}</div>
          <div className="mt-1 text-xs text-text-muted">Please wait while we prepare the page.</div>
        </div>
      </div>
    </div>
  );
}
