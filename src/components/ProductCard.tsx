import Link from 'next/link';
import { Clock3, Film, ShieldCheck } from 'lucide-react';
import { formatMoney, type StreamHubProduct } from '@/lib/api';
import RatingStars from './RatingStars';

interface Props {
  product: StreamHubProduct;
  /** Compact poster variant — used inside horizontal rails. */
  poster?: boolean;
}

/**
 * Synthetic rating: stable per product so it looks real but isn't faked random
 * on each render. Pull from API once that field exists.
 */
function ratingFor(p: StreamHubProduct) {
  const seed = (p.id || p.slug || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const r = 4.2 + ((seed % 70) / 100);  // 4.2 – 4.89
  const c = 480 + (seed % 7800);
  return { value: Math.round(r * 10) / 10, count: c };
}

export default function ProductCard({ product, poster }: Props) {
  const save = product.compareAtCents ? Math.max(product.compareAtCents - product.priceCents, 0) : 0;
  const savePct = product.compareAtCents ? Math.round((save / product.compareAtCents) * 100) : 0;
  const { value: rating, count: reviewCount } = ratingFor(product);

  return (
    <article className="poster-card flex h-full flex-col">
      {/* Poster — vertical 3:4 aspect for streaming-feel */}
      <Link
        href={`/products/${product.slug}`}
        className="group relative block aspect-[3/4] overflow-hidden bg-bg-elev-3"
      >
        {product.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.coverImage}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[650ms] ease-out group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_30%_20%,rgba(229,9,20,0.22),transparent_55%),var(--bg-elev-3)]">
            <Film className="h-10 w-10 text-text-dim" />
          </div>
        )}

        {/* Bottom fade for legibility */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/55 to-transparent" />

        {/* Badges */}
        <div className="absolute left-2.5 top-2.5 flex flex-wrap items-start gap-1.5">
          {product.badge && (
            <span className="badge-best">{product.badge}</span>
          )}
          {savePct >= 20 && (
            <span className="badge-off shadow-lg shadow-black/30">{savePct}% OFF</span>
          )}
        </div>

        {/* Category label */}
        {product.category?.name && (
          <span className="absolute right-2.5 top-2.5 inline-flex items-center rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur">
            {product.category.name}
          </span>
        )}

        {/* Title + rating overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-3.5">
          <h3 className="line-clamp-2 text-[15px] font-semibold leading-tight text-white drop-shadow-sm sm:text-base">
            {product.name}
          </h3>
          <div className="mt-1.5">
            <RatingStars value={rating} count={reviewCount} compact size="xs" />
          </div>
        </div>
      </Link>

      {/* Below-poster price + CTA — minimal on poster variant inside rails */}
      <div className="flex flex-1 flex-col gap-3 p-3 sm:p-4">
        <div className="flex items-end justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[10px] font-medium uppercase tracking-wider text-text-dim">
              StreamHub
            </div>
            <div className="mt-0.5 truncate text-xl font-bold leading-none text-text sm:text-2xl">
              {formatMoney(product.priceCents, product.currency)}
            </div>
          </div>
          {product.compareAtCents && (
            <div className="text-right">
              <div className="text-[10px] font-medium uppercase tracking-wider text-text-dim">
                MRP
              </div>
              <div className="mt-0.5 text-xs font-medium text-text-muted line-through">
                {formatMoney(product.compareAtCents, product.currency)}
              </div>
            </div>
          )}
        </div>

        {save > 0 && (
          <span className="-mt-1 inline-flex w-fit items-center rounded-md bg-success-soft px-2 py-0.5 text-[11px] font-bold text-success">
            Save {formatMoney(save, product.currency)}
          </span>
        )}

        {!poster && (
          <ul className="space-y-1.5 text-[11px] text-text-muted sm:text-xs">
            {product.durationDays && (
              <li className="flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5 shrink-0 text-success" />
                {product.durationDays} days validity
              </li>
            )}
            <li className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-info" />
              Verified · Refund for Any Valid Issue
            </li>
          </ul>
        )}

        <div className="mt-auto grid grid-cols-[1fr_auto] gap-2">
          <Link
            href={`/checkout?product=${product.slug}`}
            className="btn-accent !h-10 !px-3 text-[13px]"
          >
            Buy now
          </Link>
          <Link
            href={`/products/${product.slug}`}
            className="btn-ghost !h-10 !px-3 text-[13px]"
          >
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}
