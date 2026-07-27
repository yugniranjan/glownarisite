'use client';

import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import type { GlownariProduct } from '@/lib/api';
import { formatMoney } from '@/lib/api';
import AddToCartButton from '@/components/AddToCartButton';
import PendingLinkButton from '@/components/PendingLinkButton';

export default function ProductPurchaseActions({ product }: { product: GlownariProduct }) {
  const [quantity, setQuantity] = useState(1);
  const maxQuantity = Math.max(1, Math.min(5, product.stockQuantity || 1));
  const checkoutHref = `/checkout?product=${product.slug}&qty=${quantity}`;

  return (
    <>
      <div className="mt-6 border-t border-border pt-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase text-text-dim">Quantity</p>
            <p className="mt-1 text-xs text-text-muted">Maximum {maxQuantity} per order</p>
          </div>

          <div className="flex h-11 items-center overflow-hidden rounded-md border border-border bg-bg-elev-1">
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={quantity === 1}
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              className="grid h-full w-11 place-items-center text-text transition hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-35"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="grid h-full min-w-11 place-items-center border-x border-border text-sm font-bold text-text">
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={quantity === maxQuantity}
              onClick={() => setQuantity((value) => Math.min(maxQuantity, value + 1))}
              className="grid h-full w-11 place-items-center text-text transition hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-35"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="[&>button]:!h-12 [&>button]:!text-sm">
            <AddToCartButton product={product} quantity={quantity} />
          </div>
          <PendingLinkButton
            href={checkoutHref}
            className="btn-accent h-12 w-full text-sm"
          >
            Buy now
          </PendingLinkButton>
        </div>
      </div>

      <div
        className="fixed inset-x-0 bottom-0 z-[70] border-t border-border bg-bg-elev-1 shadow-[0_-8px_24px_rgba(61,38,45,0.08)] lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0)' }}
      >
        <div className="site-container grid grid-cols-[auto_minmax(0,1fr)_44px] items-center gap-3 py-3">
          <div className="min-w-20">
            <p className="text-[10px] font-semibold uppercase text-text-dim">Total</p>
            <p className="text-base font-bold text-text">
              {formatMoney(product.priceCents * quantity, product.currency)}
            </p>
          </div>
          <PendingLinkButton href={checkoutHref} className="btn-accent h-11 w-full text-sm">
            Buy now
          </PendingLinkButton>
          <AddToCartButton product={product} quantity={quantity} compact />
        </div>
      </div>
    </>
  );
}
