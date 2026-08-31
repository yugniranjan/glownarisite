import Link from 'next/link';
import { Package } from 'lucide-react';
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
        <div className={poster ? 'aspect-[4/3]' : 'aspect-[4/3]'}>
          {product.coverImage ? (
            <img
              src={product.coverImage}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.025]"
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

      <div className="flex flex-1 flex-col p-3 sm:p-3.5">
        <Link href={`/products/${product.slug}`} className="mt-1 block">
          <h3 className="line-clamp-1 min-h-[24px] text-base font-bold leading-[1.35] text-text transition hover:text-accent sm:text-lg">
            {product.name}
          </h3>
        </Link>

        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-text-dim">
          <span>{category}</span>
          {product.badge && <span className="text-accent">{product.badge}</span>}
          {reviewCount > 0 && <span>{compactCount(reviewCount)} reviews</span>}
          {isLowStock && <span className="text-accent">Few left</span>}
        </div>

        <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-xl font-black leading-none text-text">
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

        <div className="mt-auto pt-4">
          <AddToCartButton product={product} />
        </div>
      </div>
    </article>
  );
}
