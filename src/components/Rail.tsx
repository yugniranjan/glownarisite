'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  eyebrow?: string;
  title: string;
  seeAllHref?: string;
  children: React.ReactNode;
  /** Tailwind width class for each card slot. Defaults to mobile-first 60vw → 320px desktop. */
  itemClass?: string;
}

/**
 * Netflix-style horizontal rail.
 * Mobile: snap-x, swipeable, no arrow buttons (touch).
 * Desktop: visible scroll-by-page chevron buttons.
 */
export default function Rail({
  eyebrow,
  title,
  seeAllHref,
  children,
  itemClass = 'w-[68vw] sm:w-[42vw] md:w-[280px] lg:w-[300px]',
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      setCanPrev(el.scrollLeft > 4);
      setCanNext(el.scrollLeft < max - 4);
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  function scrollBy(direction: 1 | -1) {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: 'smooth' });
  }

  return (
    <section className="py-6 sm:py-10">
      <div className="mx-auto max-w-page px-3 sm:px-4">
        <div className="mb-3 flex items-end justify-between gap-3 sm:mb-5">
          <div>
            {eyebrow && (
              <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">
                {eyebrow}
              </p>
            )}
            <h2 className="mt-1 text-lg font-semibold leading-tight sm:text-2xl">{title}</h2>
          </div>
          <div className="flex items-center gap-2">
            {seeAllHref && (
              <Link
                href={seeAllHref}
                className="text-xs font-semibold text-text-muted hover:text-text sm:text-sm"
              >
                See all →
              </Link>
            )}
            {/* Desktop-only arrows */}
            <div className="hidden gap-1 md:flex">
              <button
                type="button"
                onClick={() => scrollBy(-1)}
                disabled={!canPrev}
                aria-label="Scroll left"
                className="grid h-9 w-9 place-items-center rounded-md border border-border bg-bg-glass text-text disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollBy(1)}
                disabled={!canNext}
                aria-label="Scroll right"
                className="grid h-9 w-9 place-items-center rounded-md border border-border bg-bg-glass text-text disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={ref}
        className="no-scrollbar mx-auto flex max-w-page snap-x snap-mandatory gap-3 overflow-x-auto px-3 pb-2 sm:gap-4 sm:px-4"
      >
        {Array.isArray(children) ? children : [children]}
      </div>

      <style jsx>{`
        :global(.snap-x.snap-mandatory > *) {
          flex: 0 0 auto;
          scroll-snap-align: start;
        }
      `}</style>
    </section>
  );
}

export function RailItem({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`shrink-0 ${className}`}>{children}</div>;
}
