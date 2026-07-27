'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AUTH_EVENT } from '@/lib/auth';
import { AUTH_REQUIRED, CART_EVENT, cartCount, fetchCart } from '@/lib/cart';

export default function CartHeaderLink({ mobile = false }: { mobile?: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const refresh = () => {
      fetchCart()
        .then((items) => setCount(cartCount(items)))
        .catch((err) => {
          if (err?.name === AUTH_REQUIRED) setCount(0);
        });
    };
    refresh();
    window.addEventListener(CART_EVENT, refresh);
    window.addEventListener(AUTH_EVENT, refresh);
    return () => {
      window.removeEventListener(CART_EVENT, refresh);
      window.removeEventListener(AUTH_EVENT, refresh);
    };
  }, []);

  return (
    <Link
      href="/cart"
      className={mobile
        ? 'relative grid h-10 w-10 place-items-center rounded-md border border-border bg-bg-elev-2 text-text'
        : 'relative grid h-10 w-10 place-items-center rounded-md text-text-muted transition hover:bg-bg-glass hover:text-accent'}
      aria-label={`Cart with ${count} items`}
      title={`Cart with ${count} items`}
    >
      <ShoppingCart className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-accent px-1 text-[10px] font-black leading-5 text-white ring-2 ring-bg-elev-1">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}
