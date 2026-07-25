'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import type { GlownariBanner } from '@/lib/api';

type Banner = GlownariBanner;

const THEME_BG: Record<GlownariBanner['theme'], string> = {
  pink: 'from-[#24121d] via-[#6d2045] to-[#111114]',
  charcoal: 'from-[#15151a] via-[#2b2b33] to-[#08080a]',
  gold: 'from-[#1f1710] via-[#7a4f18] to-[#111114]',
  green: 'from-[#0f1d18] via-[#1d5947] to-[#111114]',
  blue: 'from-[#101827] via-[#1d3f73] to-[#111114]',
  purple: 'from-[#181227] via-[#4c2f86] to-[#111114]',
};

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
    <section className="overflow-hidden bg-bg-elev-1 py-4 sm:py-5">
      <div className="relative mx-auto max-w-page px-3 sm:px-4">
        <div
          className="relative h-[190px] overflow-hidden rounded-xl sm:h-[230px] lg:h-[240px]"
          style={{ '--slide-offset': 'min(88vw, 784px)' } as CSSProperties & Record<string, string>}
        >
          {banners.map((banner, index) => {
            const offset = ((index - active + total + Math.floor(total / 2)) % total) - Math.floor(total / 2);
            const isActive = offset === 0;
            const isVisible = Math.abs(offset) <= 1;
            return (
              <Link
                key={banner.title}
                href={banner.href}
                aria-hidden={!isVisible}
                tabIndex={isVisible ? 0 : -1}
                className={`absolute left-1/2 top-0 h-full w-[88vw] max-w-[780px] overflow-hidden rounded-xl bg-gradient-to-br ${THEME_BG[banner.theme] || THEME_BG.pink} shadow-card transition-all duration-500 ease-out sm:w-[74vw] lg:w-[760px] ${
                  isActive ? 'z-20 opacity-100' : isVisible ? 'z-10 opacity-95' : 'z-0 opacity-0'
                }`}
                style={{
                  transform: `translateX(calc(-50% + (${offset} * var(--slide-offset)))) scale(${isActive ? 1 : 0.96})`,
                  pointerEvents: isVisible ? 'auto' : 'none',
                }}
              >
                <div className="relative z-10 flex h-full w-[60%] flex-col justify-center p-5 text-white sm:p-7">
                  {banner.brand && <div className="text-sm font-black uppercase tracking-wide text-white/90">{banner.brand}</div>}
                  {banner.eyebrow && <div className="mt-5 text-xs font-bold text-white/70 sm:text-sm">{banner.eyebrow}</div>}
                  <h2 className="mt-1 max-w-[13ch] text-2xl font-black leading-tight sm:text-4xl">
                    {banner.title}
                  </h2>
                  {banner.priceLabel && <div className="mt-1 text-xl font-black sm:text-3xl">{banner.priceLabel}</div>}
                  {banner.subtitle && (
                    <p className="mt-2 max-w-md text-sm font-medium leading-5 text-white/75 sm:text-base">
                      {banner.subtitle}
                    </p>
                  )}
                  <span className="mt-5 inline-flex w-fit rounded bg-white px-3 py-2 text-xs font-black text-slate-900">
                    Shop now
                  </span>
                </div>
                <div className="absolute inset-y-0 right-0 w-[52%]">
                  <img src={banner.image} alt="" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/15 to-transparent" />
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
              className="absolute left-3 top-[calc(50%-10px)] z-30 grid h-12 w-9 -translate-y-1/2 place-items-center rounded-r bg-white/95 text-slate-700 shadow-card hover:text-accent sm:left-4"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next banner"
              onClick={() => go(1)}
              className="absolute right-3 top-[calc(50%-10px)] z-30 grid h-12 w-9 -translate-y-1/2 place-items-center rounded-l bg-white/95 text-slate-700 shadow-card hover:text-accent sm:right-4"
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
