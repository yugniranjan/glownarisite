import Link from 'next/link';
import { Package, Star, Truck } from 'lucide-react';
import { compactCount, formatMoney, type GlownariProduct } from '@/lib/api';
import AddToCartButton from '@/components/AddToCartButton';

interface Props {
  product: GlownariProduct;
  /** Compact card variant used inside horizontal deal rails. */
  poster?: boolean;
  rating: number;
  reviewCount: number;
}

export default function ProductCard({
  product,
  poster,
  rating,
  reviewCount,
}: Props) {
  const save = product.compareAtCents
    ? Math.max(product.compareAtCents - product.priceCents, 0)
    : 0;
  const savePct = product.compareAtCents
    ? Math.round((save / product.compareAtCents) * 100)
    : 0;
  const category = product.category?.name || product.serviceType || 'Product';
  const isLowStock =
    typeof product.stockQuantity === 'number' &&
    product.stockQuantity > 0 &&
    product.stockQuantity <= 5;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-bg-elev-2 transition duration-300 hover:-translate-y-0.5 hover:border-accent/25 hover:shadow-hover">
      <Link
        href={`/products/${product.slug}`}
        className="relative block overflow-hidden border-b border-border bg-bg-elev-3"
      >
        <div className={poster ? 'aspect-video p-2.5' : 'aspect-[4/3] p-2.5'}>
          {product.coverImage ? (
            <img
              src={product.coverImage}
              alt={product.name}
              loading="lazy"
              className="h-full w-full rounded-md object-cover transition-transform duration-300 group-hover:scale-[1.025]"
            />
          ) : (
            <div className="grid h-full place-items-center rounded-md bg-accent-soft">
              <Package className="h-9 w-9 text-text-dim" />
            </div>
          )}
        </div>

        {savePct > 0 && (
          <span className="absolute left-3 top-3 rounded bg-accent px-2 py-1 text-[10px] font-bold uppercase text-white">
            {savePct}% off
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="line-clamp-1 text-[10px] font-bold uppercase tracking-[0.12em] text-accent">
            {category}
          </span>
          {product.badge && (
            <span className="line-clamp-1 max-w-[48%] text-[10px] font-semibold text-text-dim">
              {product.badge}
            </span>
          )}
        </div>

        <Link href={`/products/${product.slug}`} className="mt-1 block">
          <h3 className="line-clamp-1 min-h-[20px] text-sm font-bold leading-[1.35] text-text transition hover:text-accent sm:text-[15px]">
            {product.name}
          </h3>
        </Link>

        <div className="mt-1.5 flex items-center gap-1.5">
          <span className="inline-flex h-5 items-center gap-1 rounded bg-success px-1.5 text-[10px] font-bold text-white">
            {rating.toFixed(1)} <Star className="h-2.5 w-2.5 fill-current" />
          </span>
          {reviewCount > 0 && (
            <span className="text-[10px] font-medium text-text-dim">
              ({compactCount(reviewCount)})
            </span>
          )}
          {isLowStock && (
            <span className="ml-auto text-[10px] font-bold text-accent">Few left</span>
          )}
        </div>

        <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-lg font-black leading-none text-text">
            {formatMoney(product.priceCents, product.currency)}
          </span>
          {product.compareAtCents && (
            <span className="text-[11px] font-medium text-text-dim line-through">
              {formatMoney(product.compareAtCents, product.currency)}
            </span>
          )}
          {savePct > 0 && (
            <span className="text-[11px] font-bold text-success">{savePct}% off</span>
          )}
        </div>

        <div className="mt-1.5 flex min-h-[18px] items-center gap-1.5 text-[11px] font-medium text-text-muted">
          <Truck className="h-3.5 w-3.5 shrink-0 text-success" />
          <span className="truncate">
            {[product.accountType || 'Ready to ship', 'Free delivery'].join(' · ')}
          </span>
        </div>

        <div className="mt-auto pt-2.5">
          <AddToCartButton product={product} />
        </div>
      </div>
    </article>
  );
}
