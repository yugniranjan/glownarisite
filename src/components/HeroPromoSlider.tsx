'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
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
        <div
          className="relative h-[180px] overflow-hidden rounded-lg sm:h-[215px] lg:h-[228px]"
          style={{ '--slide-offset': 'min(88vw, 784px)' } as CSSProperties & Record<string, string>}
        >
          {banners.map((banner, index) => {
            const offset = ((index - active + total + Math.floor(total / 2)) % total) - Math.floor(total / 2);
            const isActive = offset === 0;
            const isVisible = Math.abs(offset) <= 1;
            const href = banner.product?.slug ? `/products/${banner.product.slug}` : banner.href;
            return (
              <Link
                key={banner.title}
                href={href}
                aria-hidden={!isVisible}
                tabIndex={isVisible ? 0 : -1}
                className={`absolute left-1/2 top-0 h-full w-[88vw] max-w-[780px] overflow-hidden rounded-lg border border-border bg-[#171519] shadow-card transition-all duration-500 ease-out sm:w-[74vw] lg:w-[760px] ${
                  isActive ? 'z-20 opacity-100' : isVisible ? 'z-10 opacity-95' : 'z-0 opacity-0'
                }`}
                style={{
                  transform: `translateX(calc(-50% + (${offset} * var(--slide-offset)))) scale(${isActive ? 1 : 0.96})`,
                  pointerEvents: isVisible ? 'auto' : 'none',
                }}
              >
                <img src={banner.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-y-0 left-0 w-[66%] bg-black/65 sm:w-[60%]" />
                <div className="relative z-10 flex h-full w-[68%] flex-col justify-center p-5 text-white sm:w-[62%] sm:p-7">
                  {banner.brand && <div className="text-sm font-black uppercase tracking-wide text-white/90">{banner.brand}</div>}
                  {banner.eyebrow && <div className="mt-2 text-xs font-bold text-white/75 sm:text-sm">{banner.eyebrow}</div>}
                  <h2 className="font-display mt-1 max-w-[15ch] text-2xl leading-tight sm:text-4xl">
                    {banner.title}
                  </h2>
                  {banner.priceLabel && <div className="mt-1 text-xl font-black text-white sm:text-2xl">{banner.priceLabel}</div>}
                  {banner.subtitle && (
                    <p className="mt-1.5 line-clamp-2 max-w-md text-xs font-medium leading-5 text-white/75 sm:text-sm">
                      {banner.subtitle}
                    </p>
                  )}
                  <span className="mt-3 inline-flex w-fit rounded bg-white px-3 py-2 text-xs font-black text-slate-900">
                    Shop now
                  </span>
                </div>
                <span className="absolute bottom-3 right-3 rounded bg-black/40 px-2 py-0.5 text-[10px] font-bold text-white/80">
                  AD
                </span>
              </Link>
            );
          })}
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
