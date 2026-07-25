import Link from 'next/link';
import { Heart, Package, ShieldCheck, Sparkles, Star, Truck } from 'lucide-react';
import { formatMoney, type GlownariProduct } from '@/lib/api';
import PendingLinkButton from '@/components/PendingLinkButton';
import AddToCartButton from '@/components/AddToCartButton';

interface Props {
  product: GlownariProduct;
  /** Compact card variant used inside horizontal deal rails. */
  poster?: boolean;
}

export default function ProductCard({ product, poster }: Props) {
  const save = product.compareAtCents ? Math.max(product.compareAtCents - product.priceCents, 0) : 0;
  const savePct = product.compareAtCents ? Math.round((save / product.compareAtCents) * 100) : 0;
  const category = product.category?.name || product.serviceType || 'Product';
  const isLowStock = typeof product.stockQuantity === 'number' && product.stockQuantity > 0 && product.stockQuantity <= 5;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-bg-elev-2 shadow-card transition duration-300 hover:-translate-y-0.5 hover:border-accent/25 hover:shadow-hover">
      <Link href={`/products/${product.slug}`} className="relative block overflow-hidden border-b border-border bg-[linear-gradient(135deg,#fff8fb_0%,#fff1f7_100%)] dark:bg-bg-elev-3">
        <div className={poster ? 'aspect-[4/5] p-2' : 'aspect-[4/3] p-2'}>
          {product.coverImage ? (
            <img
              src={product.coverImage}
              alt={product.name}
              loading="lazy"
              className="h-full w-full rounded-lg object-cover shadow-[0_8px_20px_rgba(15,23,42,0.10)] transition-transform duration-300 group-hover:scale-[1.035]"
            />
          ) : (
            <div className="grid h-full place-items-center rounded-lg bg-marketplace-chip">
              <Package className="h-10 w-10 text-text-dim" />
            </div>
          )}
        </div>

        <span
          aria-hidden="true"
          className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/92 text-slate-500 shadow-[0_8px_22px_rgba(15,23,42,0.18)] transition hover:bg-accent hover:text-white dark:bg-black/50 dark:text-white/80"
        >
          <Heart className="h-4 w-4" />
        </span>

        <div className="absolute left-2 top-2 flex max-w-[calc(100%-3rem)] flex-wrap gap-1">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/92 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-accent shadow-sm backdrop-blur">
            <Sparkles className="h-3 w-3" />
            Handpicked
          </span>
          {product.badge && <span className="rounded-full bg-slate-950/82 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-white shadow-sm backdrop-blur">{product.badge}</span>}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-2.5">
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-2 text-[10px]">
            <div className="line-clamp-1 font-bold uppercase tracking-wide text-text-dim">
              {category}
            </div>
            {isLowStock && <span className="shrink-0 rounded-full bg-accent-soft px-1.5 py-0.5 font-black text-accent">Few left</span>}
          </div>
          <Link href={`/products/${product.slug}`} className="mt-1 block">
            <h3 className="line-clamp-2 min-h-[34px] text-[13px] font-semibold leading-[1.3] text-text transition hover:text-accent sm:text-sm">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="mt-1.5 flex items-center gap-1.5">
          <span className="inline-flex h-5 items-center gap-1 rounded-full bg-[#12805c] px-1.5 text-[11px] font-black text-white">
            4.5 <Star className="h-2.5 w-2.5 fill-current" />
          </span>
          <span className="truncate text-[11px] font-semibold text-text-dim">Loved by buyers</span>
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-success-soft px-1.5 py-0.5 text-[10px] font-black uppercase text-success">
            <ShieldCheck className="h-3 w-3" />
            Assured
          </span>
        </div>

        <div className="mt-2 min-h-[42px]">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-lg font-black leading-none text-text">
              {formatMoney(product.priceCents, product.currency)}
            </span>
            {product.compareAtCents && (
              <span className="text-xs font-medium text-text-muted line-through">
                {formatMoney(product.compareAtCents, product.currency)}
              </span>
            )}
            {savePct > 0 && (
              <span className="text-xs font-black text-success">
                {savePct}% off
              </span>
            )}
          </div>
          {save > 0 && (
            <div className="mt-0.5 inline-flex rounded-full bg-success-soft px-2 py-0.5 text-[11px] font-bold text-success">
              Extra offer available
            </div>
          )}
        </div>

        <div className="mt-1.5 flex min-h-[20px] items-center justify-between gap-2 text-[11px] font-semibold text-text-muted">
          <div className="inline-flex min-w-0 items-center gap-1.5">
            <Truck className="h-3.5 w-3.5 shrink-0 text-success" />
            <span className="truncate">Free delivery · easy support</span>
          </div>
          {!poster && <span className="shrink-0 text-success">In stock</span>}
        </div>

        <div className="mt-auto grid grid-cols-[minmax(0,1fr)_38px] items-center gap-1.5 pt-2">
          <PendingLinkButton href={`/checkout?product=${product.slug}`} className="!flex !h-9 !min-h-0 items-center justify-center rounded-lg bg-accent !px-2.5 text-[13px] font-black leading-none text-white shadow-cta transition hover:bg-accent-strong">
            Buy now
          </PendingLinkButton>
          <AddToCartButton product={product} compact />
        </div>
      </div>
    </article>
  );
}
