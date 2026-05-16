'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  ChevronRight,
  MessageCircle,
  Package,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Tag,
  X,
} from 'lucide-react';

interface NavLink { href: string; label: string; }
const PRIMARY_NAV: NavLink[] = [
  { href: '/',                 label: 'Home' },
  { href: '/#trending',        label: 'Trending' },
  { href: '/category/ott-plans', label: 'OTT' },
  { href: '/category/music',   label: 'Music' },
  { href: '/category/sports',  label: 'Sports' },
  { href: '/track-order',      label: 'Track order' },
];

export default function Header() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  // Close drawer when route changes
  useEffect(() => { setDrawerOpen(false); setSearchOpen(false); }, [pathname]);

  return (
    <header className="sticky top-0 z-40">
      {/* Promo strip — always visible, very compact on mobile */}
      <div className="bg-accent text-white">
        <div className="mx-auto flex h-8 max-w-page items-center justify-between gap-2 overflow-hidden px-3 text-[11px] font-semibold sm:h-9 sm:text-xs">
          <span className="flex items-center gap-1.5 truncate">
            <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <span className="truncate">FLAT 10% OFF on first order with <strong>FIRST10</strong></span>
          </span>
          <Link href="/track-order" className="hidden shrink-0 items-center gap-1 underline-offset-2 hover:underline sm:flex">
            <Package className="h-3.5 w-3.5" aria-hidden />
            Track order
          </Link>
        </div>
      </div>

      {/* Main bar — minimal on mobile, expands on desktop */}
      <div className="border-b border-border bg-bg/95 backdrop-blur supports-[backdrop-filter]:bg-bg/80">
        <div className="mx-auto flex h-14 max-w-page items-center gap-2 px-3 sm:h-16 sm:gap-3 sm:px-4">
          {/* Hamburger (mobile only) */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="grid h-11 w-11 place-items-center rounded-md border border-border bg-bg-glass text-text lg:hidden"
            aria-label="Open menu"
          >
            <MenuIcon />
          </button>

          {/* Brand */}
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-white sm:h-10 sm:w-10">
              <ShoppingBag className="h-5 w-5" />
            </span>
            <span className="text-base font-semibold tracking-tight sm:text-lg">
              StreamHub
            </span>
          </Link>

          {/* Search — inline on desktop, icon trigger on mobile */}
          <form
            action="/#products"
            className="ml-auto hidden h-11 max-w-xl flex-1 items-center gap-2 rounded-lg border border-border bg-bg-glass px-3 lg:flex"
          >
            <Search className="h-4 w-4 shrink-0 text-text-dim" aria-hidden />
            <input
              name="q"
              placeholder="Search Netflix, Prime, Spotify…"
              className="h-full w-full bg-transparent text-sm text-text outline-none placeholder:text-text-dim"
            />
          </form>

          {/* Mobile search icon */}
          <button
            type="button"
            onClick={() => setSearchOpen((s) => !s)}
            className="ml-auto grid h-11 w-11 place-items-center rounded-md border border-border bg-bg-glass text-text lg:hidden"
            aria-label="Search"
          >
            {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </button>

          {/* Desktop nav links */}
          <nav className="ml-2 hidden items-center gap-5 text-sm font-medium text-text-muted lg:flex">
            <Link href="/track-order" className="hover:text-text">Track</Link>
            <Link href="/#trending" className="hover:text-text">Trending</Link>
          </nav>

          {/* Desktop primary CTA */}
          <a
            href="https://wa.me/919999999999"
            className="hidden h-10 items-center gap-1.5 rounded-md bg-whatsapp px-4 text-sm font-semibold text-white hover:bg-whatsapp-strong lg:inline-flex"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle className="h-4 w-4" />
            Chat
          </a>
        </div>

        {/* Slide-down search on mobile */}
        {searchOpen && (
          <div className="border-t border-border bg-bg lg:hidden">
            <form action="/#products" className="mx-auto flex h-12 max-w-page items-center gap-2 px-3">
              <Search className="h-4 w-4 shrink-0 text-text-dim" aria-hidden />
              <input
                name="q"
                autoFocus
                placeholder="Search Netflix, Prime, Spotify…"
                className="h-full w-full bg-transparent text-sm text-text outline-none placeholder:text-text-dim"
              />
            </form>
          </div>
        )}
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <>
          <div
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
          />
          <aside
            className="fixed inset-y-0 left-0 z-50 flex w-[86%] max-w-sm flex-col bg-bg-elev-1 lg:hidden"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-white">
                  <ShoppingBag className="h-5 w-5" />
                </span>
                <span className="text-base font-semibold">StreamHub</span>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="grid h-11 w-11 place-items-center rounded-md text-text-muted hover:bg-bg-glass hover:text-text"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-3">
              <p className="px-2 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wider text-text-dim">
                Browse
              </p>
              <ul className="space-y-1">
                {PRIMARY_NAV.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`flex h-12 items-center justify-between rounded-lg px-3 text-[15px] font-medium ${
                          active ? 'bg-accent-soft text-accent' : 'text-text hover:bg-bg-glass'
                        }`}
                      >
                        {link.label}
                        <ChevronRight className="h-4 w-4 text-text-dim" />
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <p className="mt-5 px-2 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wider text-text-dim">
                Why StreamHub
              </p>
              <ul className="space-y-1 text-sm text-text-muted">
                <li className="flex items-center gap-3 px-3 py-2">
                  <ShieldCheck className="h-4 w-4 text-success" />
                  Verified accounts only
                </li>
                <li className="flex items-center gap-3 px-3 py-2">
                  <Tag className="h-4 w-4 text-accent" />
                  Lowest price guarantee
                </li>
                <li className="flex items-center gap-3 px-3 py-2">
                  <MessageCircle className="h-4 w-4 text-whatsapp" />
                  24×7 chat support
                </li>
              </ul>
            </nav>

            <div className="border-t border-border p-3">
              <a
                href="https://wa.me/919999999999"
                className="btn-whatsapp w-full"
              >
                <MessageCircle className="h-4 w-4" />
                Chat to buy
              </a>
            </div>
          </aside>
        </>
      )}
    </header>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
