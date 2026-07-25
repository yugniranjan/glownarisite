'use client';

import Link from 'next/link';
import { Clock3, Loader2, Package, Search, Sparkles, TrendingUp, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { formatMoney, getProducts, type GlownariProduct } from '@/lib/api';

const QUICK_TERMS = ['Fashion', 'Beauty', 'Bags', 'Gifts'];

export default function HeaderSearch({ mobile = false, autoFocus = false }: { mobile?: boolean; autoFocus?: boolean }) {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<GlownariProduct[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const trimmed = query.trim();

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      const startedAt = performance.now();
      setLoading(true);
      setElapsedMs(null);
      getProducts({ q: trimmed || undefined, take: 8 })
        .then((res) => setItems(res.items))
        .finally(() => {
          setElapsedMs(Math.max(1, Math.round(performance.now() - startedAt)));
          setLoading(false);
        });
    }, trimmed ? 180 : 0);
    return () => window.clearTimeout(handle);
  }, [trimmed]);

  const suggestions = useMemo(() => {
    if (trimmed) return [];
    return QUICK_TERMS;
  }, [trimmed]);

  function submit() {
    const target = trimmed ? `/#products?q=${encodeURIComponent(trimmed)}` : '/#products';
    window.location.href = target;
  }

  return (
    <div ref={rootRef} className={`relative ${mobile ? 'w-full' : 'hidden min-w-[260px] max-w-[560px] flex-1 lg:block'}`}>
      <div className="flex h-12 items-center gap-2 rounded-2xl border border-white/25 bg-white px-3 text-slate-900 shadow-[0_12px_34px_rgba(15,23,42,0.16)] transition focus-within:bg-white focus-within:ring-4 focus-within:ring-white/25">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
          <Search className="h-5 w-5" aria-hidden />
        </span>
        <input
          autoFocus={autoFocus}
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              submit();
            }
            if (event.key === 'Escape') setOpen(false);
          }}
          placeholder="Search products, categories..."
          className="h-full min-w-0 flex-1 border-0 bg-transparent text-[15px] font-semibold text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
        />
        {loading && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-accent" />}
        {query && (
          <button type="button" onClick={() => setQuery('')} className="grid h-8 w-8 place-items-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Clear search">
            <X className="h-4 w-4" />
          </button>
        )}
        <button type="button" onClick={submit} className="hidden h-9 rounded-xl bg-accent px-4 text-sm font-black text-white shadow-sm hover:bg-accent-strong sm:inline-flex sm:items-center">
          Search
        </button>
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-3 overflow-hidden rounded-3xl border border-border bg-bg-elev-2 text-text shadow-[0_28px_80px_rgba(15,23,42,0.32)]">
          <div className="flex items-center justify-between gap-3 border-b border-border bg-bg-elev-1 px-4 py-3">
            <div className="flex min-w-0 items-center gap-2">
              {trimmed ? <Search className="h-4 w-4 shrink-0 text-accent" /> : <TrendingUp className="h-4 w-4 shrink-0 text-accent" />}
              <div className="truncate text-sm font-black">
                {trimmed ? `Results for "${trimmed}"` : 'Popular searches'}
              </div>
            </div>
            {elapsedMs && (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-bg-elev-3 px-2.5 py-1 text-[11px] font-bold text-text-muted">
                <Clock3 className="h-3 w-3" />
                {elapsedMs}ms
              </span>
            )}
          </div>

          {!trimmed && (
            <div className="flex flex-wrap gap-2 p-4">
              {suggestions.map((term) => (
                <button key={term} type="button" onClick={() => setQuery(term)} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-elev-1 px-3 py-2 text-xs font-bold shadow-sm hover:border-accent hover:text-accent">
                  <Sparkles className="h-3.5 w-3.5" />
                  {term}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="space-y-2 p-3">
              {[0, 1, 2].map((item) => (
                <div key={item} className="flex animate-pulse gap-3 rounded-xl p-2">
                  <div className="h-14 w-14 rounded-lg bg-bg-elev-3" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-3 w-2/3 rounded bg-bg-elev-3" />
                    <div className="h-3 w-1/3 rounded bg-bg-elev-3" />
                    <div className="h-3 w-20 rounded bg-bg-elev-3" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length > 0 ? (
            <div className="max-h-[430px] overflow-auto p-2">
              {items.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  onClick={() => setOpen(false)}
                  className="group flex gap-3 rounded-2xl p-2.5 transition hover:bg-bg-glass"
                >
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-bg-elev-3 ring-1 ring-border">
                    {product.coverImage ? (
                      <img src={product.coverImage} alt="" className="h-full w-full object-cover transition group-hover:scale-105" />
                    ) : (
                      <div className="grid h-full place-items-center"><Package className="h-5 w-5 text-text-dim" /></div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-black group-hover:text-accent">{product.name}</div>
                    <div className="mt-0.5 truncate text-xs text-text-muted">{product.category?.name || product.serviceType || 'Product'}</div>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-sm font-black text-accent">{formatMoney(product.priceCents, product.currency)}</span>
                      {product.compareAtCents && (
                        <span className="text-xs text-text-dim line-through">{formatMoney(product.compareAtCents, product.currency)}</span>
                      )}
                    </div>
                  </div>
                  <span className="hidden self-center rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-black text-accent sm:inline-flex">
                    View
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <Package className="mx-auto h-9 w-9 text-text-dim" />
              <div className="mt-3 font-black">No products found</div>
              <p className="mt-1 text-sm text-text-muted">Try a category like Fashion, Beauty, Bags, or Gifts.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
