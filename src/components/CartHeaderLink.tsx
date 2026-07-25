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
        ? 'relative grid h-10 w-10 place-items-center rounded-md border border-white/20 bg-white/10 text-white'
        : 'relative grid h-10 w-10 place-items-center rounded-md border border-white/15 bg-white/10 text-white transition hover:border-white/35 hover:bg-white/18'}
      aria-label={`Cart with ${count} items`}
      title={`Cart with ${count} items`}
    >
      <ShoppingCart className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-1.5 -top-1.5 grid min-w-5 place-items-center rounded-full bg-white px-1 text-[10px] font-black leading-5 text-accent ring-2 ring-accent">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}
