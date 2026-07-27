'use client';

import Link from 'next/link';
import { Loader2, Minus, Package, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { formatMoney } from '@/lib/api';
import {
  AUTH_REQUIRED,
  CART_EVENT,
  cartCount,
  cartSubtotal,
  clearCart,
  fetchCart,
  removeFromCart,
  updateCartQuantity,
  type CartItem,
} from '@/lib/cart';
import { AUTH_EVENT, getAuthToken } from '@/lib/auth';
import AccountGate from '@/components/AccountGate';

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [needsLogin, setNeedsLogin] = useState(false);

  useEffect(() => {
    const refresh = () => {
      if (!getAuthToken()) {
        setItems([]);
        setNeedsLogin(true);
        setLoading(false);
        return;
      }
      setNeedsLogin(false);
      setLoading(true);
      fetchCart()
        .then((nextItems) => {
          setItems(nextItems);
          setError('');
        })
        .catch((err) => {
          if (err?.name === AUTH_REQUIRED) {
            setNeedsLogin(true);
            setItems([]);
          } else {
            setError(err?.message || 'Could not load cart');
          }
        })
        .finally(() => setLoading(false));
    };
    refresh();
    window.addEventListener(CART_EVENT, refresh);
    window.addEventListener(AUTH_EVENT, refresh);
    return () => {
      window.removeEventListener(CART_EVENT, refresh);
      window.removeEventListener(AUTH_EVENT, refresh);
    };
  }, []);

  const subtotal = useMemo(() => cartSubtotal(items), [items]);
  const mrpTotal = useMemo(
    () => items.reduce((sum, item) => sum + (item.compareAtCents || item.priceCents) * item.quantity, 0),
    [items],
  );
  const savings = Math.max(mrpTotal - subtotal, 0);
  const currency = items[0]?.currency || 'INR';
  const totalItems = cartCount(items);

  async function setQuantity(id: string, quantity: number) {
    setBusyId(id);
    setError('');
    try {
      setItems(await updateCartQuantity(id, quantity));
    } catch (err: any) {
      setError(err?.message || 'Could not update cart');
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string) {
    setBusyId(id);
    setError('');
    try {
      setItems(await removeFromCart(id));
    } catch (err: any) {
      setError(err?.message || 'Could not remove item');
    } finally {
      setBusyId(null);
    }
  }

  async function emptyCart() {
    setBusyId('clear');
    setError('');
    try {
      setItems(await clearCart());
    } catch (err: any) {
      setError(err?.message || 'Could not clear cart');
    } finally {
      setBusyId(null);
    }
  }

  if (needsLogin) {
    return (
      <AccountGate
        icon={ShoppingBag}
        eyebrow="Your Glownari bag"
        title="Your favourites, ready when you are"
        description="Sign in to keep your selected products together and continue shopping without losing your bag."
        benefits={['Your bag stays saved across devices', 'Buy one item or checkout the full bag', 'See prices and quantities before payment']}
        loginHref="/login?next=%2Fcart"
        signupHref="/signup?next=%2Fcart"
      />
    );
  }

  if (loading) {
    return (
      <div className="site-container grid min-h-[320px] place-items-center py-10">
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-text-muted">
          <Loader2 className="h-4 w-4 animate-spin text-accent" />
          Loading cart...
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="site-container page-content">
        <section className="flex flex-col items-center border-y border-border bg-bg-elev-1 px-5 py-10 text-center sm:py-14">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-accent-soft text-accent">
            <ShoppingBag className="h-7 w-7" />
          </span>
          <h1 className="mt-5 text-2xl font-black">Your bag has room for something lovely</h1>
          <p className="mt-2 max-w-md text-sm leading-6 text-text-muted">
            Browse fresh picks, add what feels right, and come back here whenever you are ready.
          </p>
          <Link href="/#products" className="btn-accent mt-6 inline-flex">Browse products</Link>
        </section>
      </div>
    );
  }

  return (
    <div className="site-container page-content">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">Your selection</p>
          <h1 className="mt-1 text-2xl font-black sm:text-3xl">Shopping bag</h1>
          <p className="mt-1 text-sm text-text-muted">{totalItems} items ready to review</p>
        </div>
        <button
          type="button"
          onClick={emptyCart}
          disabled={busyId === 'clear'}
          className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-bg-elev-2 px-3 text-xs font-bold text-text-muted hover:border-danger/40 hover:text-danger"
        >
          {busyId === 'clear' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          {busyId === 'clear' ? 'Clearing...' : 'Clear cart'}
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-danger/40 bg-danger-soft px-3 py-2 text-sm text-danger">
          {error}
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="space-y-3">
          {items.map((item) => {
            const lineTotal = item.priceCents * item.quantity;
            const lineMrp = (item.compareAtCents || item.priceCents) * item.quantity;
            const lineSavings = Math.max(lineMrp - lineTotal, 0);
            return (
              <article key={item.id} className="rounded-lg border border-border bg-bg-elev-2 p-3 shadow-card sm:p-4">
                <div className="grid gap-3 sm:grid-cols-[112px_minmax(0,1fr)_auto]">
                  <Link href={`/products/${item.slug}`} className="block overflow-hidden rounded-md bg-bg-elev-3">
                    <div className="aspect-square">
                      {item.coverImage ? (
                        <img src={item.coverImage} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="grid h-full place-items-center">
                          <Package className="h-8 w-8 text-text-dim" />
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="min-w-0">
                    <div className="text-xs font-semibold uppercase tracking-wide text-text-dim">
                      {item.categoryName || 'Product'}
                    </div>
                    <Link href={`/products/${item.slug}`} className="mt-1 block">
                      <h2 className="line-clamp-2 text-base font-black hover:text-accent">{item.name}</h2>
                    </Link>
                    <div className="mt-2 flex flex-wrap items-baseline gap-2">
                      <span className="text-lg font-black">{formatMoney(item.priceCents, item.currency)}</span>
                      {item.compareAtCents && (
                        <span className="text-xs text-text-muted line-through">
                          {formatMoney(item.compareAtCents, item.currency)}
                        </span>
                      )}
                      {lineSavings > 0 && (
                        <span className="text-xs font-bold text-success">
                          Save {formatMoney(lineSavings, item.currency)}
                        </span>
                      )}
                    </div>
                    {item.stockQuantity != null && (
                      <div className="mt-1 text-xs font-semibold text-success">{item.stockQuantity} in stock</div>
                    )}
                  </div>

                  <div className="flex flex-col justify-between gap-3 sm:items-end">
                    <div className="inline-flex h-9 w-fit items-center rounded-md border border-border bg-bg-elev-3">
                      <button
                        type="button"
                        onClick={() => setQuantity(item.id, item.quantity - 1)}
                        disabled={busyId === item.id}
                        className="grid h-9 w-9 place-items-center text-text-muted hover:text-text"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="grid h-9 min-w-10 place-items-center border-x border-border px-3 text-sm font-black">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(item.id, item.quantity + 1)}
                        className="grid h-9 w-9 place-items-center text-text-muted hover:text-text disabled:opacity-40"
                        aria-label="Increase quantity"
                        disabled={item.quantity >= 5 || busyId === item.id}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => remove(item.id)}
                        disabled={busyId === item.id}
                        className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-bg-elev-2 px-3 text-xs font-bold text-text-muted hover:border-danger/40 hover:text-danger"
                      >
                        {busyId === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        Remove
                      </button>
                      <Link
                        href={`/checkout?product=${item.slug}&qty=${item.quantity}`}
                        className="inline-flex h-9 items-center justify-center rounded-md bg-accent px-3 text-xs font-black text-white transition hover:bg-accent-strong"
                      >
                        Buy this
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <aside className="h-fit rounded-lg border border-border bg-bg-elev-2 p-4 shadow-card sm:p-5 lg:sticky lg:top-24">
          <h2 className="text-base font-black">Order summary</h2>
          <div className="mt-4 space-y-3 border-t border-border pt-4 text-sm">
            <Row label={`Price (${totalItems} items)`} value={formatMoney(mrpTotal, currency)} />
            <Row label="Discount" value={savings ? `-${formatMoney(savings, currency)}` : formatMoney(0, currency)} tone="success" />
            <Row label="Delivery" value="Calculated after order" />
            <div className="border-t border-border pt-3">
              <Row label="Subtotal" value={formatMoney(subtotal, currency)} strong />
            </div>
          </div>
          {savings > 0 && (
            <div className="mt-4 rounded-md bg-success-soft px-3 py-2 text-sm font-bold text-success">
              Lovely choice. You save {formatMoney(savings, currency)} on this bag.
            </div>
          )}
          <Link href="/checkout?cart=1" className="btn-accent mt-5 w-full">
            Checkout all {totalItems} items
          </Link>
          <Link href="/#products" className="btn-ghost mt-3 w-full">
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  strong,
  tone,
}: {
  label: string;
  value: string;
  strong?: boolean;
  tone?: 'success';
}) {
  return (
    <div className={`flex items-center justify-between gap-4 ${strong ? 'text-base font-black text-text' : 'text-text-muted'}`}>
      <span>{label}</span>
      <span className={`${strong ? 'text-text' : ''} ${tone === 'success' ? 'font-bold text-success' : ''}`}>
        {value}
      </span>
    </div>
  );
}
