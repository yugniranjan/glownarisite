'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  seeAllHref?: string;
  children: React.ReactNode;
  /** Tailwind width class for each card slot. Defaults to mobile-first 60vw → 320px desktop. */
  itemClass?: string;
}

/**
 * Marketplace horizontal rail.
 * Mobile: snap-x and swipeable. Desktop: scroll-by-page chevrons.
 */
export default function Rail({
  eyebrow,
  title,
  description,
  seeAllHref,
  children,
  itemClass = 'w-[72vw] sm:w-[42vw] md:w-[224px] lg:w-[232px]',
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
    <section className="py-7 sm:py-8">
      <div className="site-container">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div className="min-w-0">
            {eyebrow && (
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent">
                {eyebrow}
              </p>
            )}
            <h2 className="font-display mt-1 text-xl leading-tight sm:text-[26px]">{title}</h2>
            {description && (
              <p className="mt-1.5 max-w-2xl text-xs leading-5 text-text-muted sm:text-sm">
                {description}
              </p>
            )}
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
                className="grid h-9 w-9 place-items-center rounded-full border border-border bg-bg-elev-2 text-text disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollBy(1)}
                disabled={!canNext}
                aria-label="Scroll right"
                className="grid h-9 w-9 place-items-center rounded-full border border-border bg-bg-elev-2 text-text disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={ref}
        className="no-scrollbar site-container flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 sm:gap-4"
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
