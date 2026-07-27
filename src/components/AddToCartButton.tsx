'use client';

import Link from 'next/link';
import { Check, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { GlownariProduct } from '@/lib/api';
import { AUTH_REQUIRED, addToCart } from '@/lib/cart';
import { showToast } from '@/components/ToastProvider';

export default function AddToCartButton({
  product,
  quantity = 1,
  compact = false,
}: {
  product: GlownariProduct;
  quantity?: number;
  compact?: boolean;
}) {
  const [added, setAdded] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!added) return undefined;
    const timer = window.setTimeout(() => setAdded(false), 1800);
    return () => window.clearTimeout(timer);
  }, [added]);

  if (added) {
    return (
      <Link
        href="/cart"
        className={compact
          ? 'grid h-10 w-10 place-items-center rounded-md border border-success/25 bg-success-soft text-success shadow-sm'
          : 'inline-flex h-8 w-full items-center justify-center gap-2 rounded-md border border-success/25 bg-success-soft px-4 text-xs font-bold text-success transition hover:border-success/40'}
        aria-label="Go to cart"
      >
        <Check className="h-4 w-4" />
        {!compact && 'Added'}
      </Link>
    );
  }

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          await addToCart(product, quantity);
          setAdded(true);
          showToast({
            title: 'Added to cart',
            message: product.name,
            href: '/cart',
            actionLabel: 'View cart',
          });
        } catch (err: any) {
          if (err?.name === AUTH_REQUIRED) {
            const next = `${window.location.pathname}${window.location.search}`;
            window.location.href = `/login?next=${encodeURIComponent(next)}`;
            return;
          }
          showToast({
            title: 'Could not add to cart',
            message: err?.message || 'Please try again.',
          });
        } finally {
          setBusy(false);
        }
      }}
      className={compact
        ? 'grid h-10 w-10 place-items-center rounded-md border border-accent/20 bg-accent-soft text-accent shadow-sm transition hover:border-accent/35 hover:bg-accent hover:text-white disabled:cursor-not-allowed disabled:opacity-70'
        : 'inline-flex h-8 w-full items-center justify-center gap-2 rounded-md border border-accent/35 bg-transparent px-4 text-xs font-bold text-accent transition hover:bg-accent hover:text-white disabled:cursor-not-allowed disabled:opacity-70'}
      aria-label={`Add ${product.name} to cart`}
    >
      <ShoppingCart className="h-4 w-4" />
      {!compact && (busy ? 'Adding...' : 'Add to cart')}
    </button>
  );
}
