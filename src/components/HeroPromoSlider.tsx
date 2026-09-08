'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { GlownariBanner } from '@/lib/api';

type Banner = GlownariBanner;

function wrap(index: number, total: number) {
  return (index + total) % total;
}

export default function HeroPromoSlider({ banners }: { banners: Banner[] }) {
  const [active, setActive] = useState(0);
  const total = banners.length;

  useEffect(() => {
    if (total <= 1) return;
    const timer = window.setInterval(() => {
      setActive((index) => wrap(index + 1, total));
    }, 4500);
    return () => window.clearInterval(timer);
  }, [total]);

  function go(direction: 1 | -1) {
    setActive((index) => wrap(index + direction, total));
  }

  if (total === 0) return null;

  return (
    <section className="overflow-hidden bg-bg-elev-1 py-3 sm:py-4">
      <div className="site-container relative">
        <div className="aspect-[2098/749] w-full overflow-hidden rounded-lg border border-border bg-bg-elev-3 shadow-card">
          <div
            className="flex h-full transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${active * 100}%)` }}
          >
            {banners.map((banner) => {
              const href = banner.product?.slug ? `/products/${banner.product.slug}` : banner.href;
              return (
                <Link
                  key={banner.id || banner.title}
                  href={href}
                  className="relative block h-full min-w-full"
                  aria-label={banner.title || 'Open Glownari banner'}
                >
                  <img
                    src={banner.image}
                    alt={banner.title || 'Glownari banner'}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </Link>
              );
            })}
          </div>
        </div>

        {total > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous banner"
              onClick={() => go(-1)}
              className="absolute left-3 top-[calc(50%-10px)] z-30 grid h-11 w-9 -translate-y-1/2 place-items-center rounded-r bg-white/95 text-slate-700 shadow-card hover:text-accent sm:left-4"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next banner"
              onClick={() => go(1)}
              className="absolute right-3 top-[calc(50%-10px)] z-30 grid h-11 w-9 -translate-y-1/2 place-items-center rounded-l bg-white/95 text-slate-700 shadow-card hover:text-accent sm:right-4"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {total > 1 && <div className="mt-2 flex justify-center gap-1.5">
          {banners.map((banner, index) => (
            <button
              key={banner.title}
              type="button"
              aria-label={`Go to banner ${index + 1}`}
              onClick={() => setActive(index)}
              className={`h-1.5 rounded-full transition-all ${index === active ? 'w-5 bg-text-muted' : 'w-1.5 bg-border-strong'}`}
            />
          ))}
        </div>}
      </div>
    </section>
  );
}
