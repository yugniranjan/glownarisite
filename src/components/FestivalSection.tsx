'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import type { GlownariProduct, PromoConfig } from '@/lib/api';
import { getPromo } from '@/lib/api';

type Props = { promo: PromoConfig; products: GlownariProduct[]; rating: number; reviewCount: number };

export default function FestivalSection({ promo: initialPromo, products, rating, reviewCount }: Props) {
  const [promo, setPromo] = useState(initialPromo);
  useEffect(() => { setPromo(initialPromo); }, [initialPromo]);
  useEffect(() => {
    let disposed = false;
    let pending = false;
    async function refresh() {
      if (document.visibilityState === 'hidden' || pending) return;
      pending = true;
      try { const latest = await getPromo(); if (!disposed) setPromo(latest); }
      finally { pending = false; }
    }
    void refresh();
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    const timer = window.setInterval(refresh, 30000);
    return () => { disposed = true; window.clearInterval(timer); window.removeEventListener('focus', refresh); document.removeEventListener('visibilitychange', refresh); };
  }, []);
  if (promo.festivalEnabled !== true || products.length === 0) return null;
  return (
    <section id="festival-products" aria-labelledby="festival-title" className="my-5 border-y border-accent/15 bg-accent-soft/30 py-7 sm:my-7 sm:py-9">
      <div className="site-container">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0 max-w-2xl">
            <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase text-accent">
              <Sparkles className="h-4 w-4 shrink-0" />
              {promo.saleSectionEyebrow || 'Festival edit'}
            </p>
            <h2 id="festival-title" className="font-display text-2xl leading-tight text-text sm:text-3xl">{promo.saleSectionTitle || 'A little sparkle for the season'}</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-text-muted">{promo.saleSectionSubtitle || 'Our favourite earrings and rings, chosen for your celebrations.'}</p>
          </div>
          <Link href="#products" className="inline-flex h-10 shrink-0 items-center gap-2 rounded-md border border-accent/25 bg-bg-elev-1 px-4 text-sm font-semibold text-accent transition hover:bg-accent hover:text-white">
            Explore all <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {products.map((product) => (
            <div key={product.id} className="min-w-0 [&_button]:!gap-1 [&_button]:!px-2 [&_button]:!text-xs sm:[&_button]:!text-sm">
              <ProductCard product={product} rating={rating} reviewCount={reviewCount} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
