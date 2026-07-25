'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  ChevronRight,
  MessageCircle,
  PackageCheck,
  Search,
  ShieldCheck,
  Tag,
  X,
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import CartHeaderLink from '@/components/CartHeaderLink';
import AccountHeaderButton from '@/components/AccountHeaderButton';
import HeaderSearch from '@/components/HeaderSearch';

interface NavLink { href: string; label: string; }
const PRIMARY_NAV: NavLink[] = [
  { href: '/',                 label: 'Home' },
  { href: '/#trending',        label: 'Trending' },
  { href: '/#products',        label: 'Products' },
  { href: '/cart',             label: 'Cart' },
  { href: '/track-order',      label: 'Track order' },
];

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918506965129';

export default function Header() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  // Close drawer when route changes
  useEffect(() => { setDrawerOpen(false); setSearchOpen(false); }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 18);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40">
      {/* Main bar — minimal on mobile, expands on desktop */}
      <div className="border-b border-white/10 bg-accent text-white shadow-[0_10px_30px_var(--accent-glow)]">
        <div className="mx-auto flex h-14 max-w-page items-center gap-2 px-3 sm:h-16 sm:gap-3 sm:px-4 lg:gap-4">
          {/* Hamburger (mobile only) */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-md border border-white/20 bg-white/10 text-white lg:hidden"
            aria-label="Open menu"
          >
            <MenuIcon />
          </button>

          {/* Brand */}
          <Link href="/" className="flex shrink-0 items-center gap-2 text-white">
            <span
              className={`inline-flex items-center justify-center overflow-hidden rounded-lg bg-white transition-all duration-300 ${
                scrolled
                  ? 'h-10 w-10 p-1'
                  : 'h-10 w-[156px] px-1.5 py-1 sm:h-12 sm:w-[216px] lg:w-[224px]'
              }`}
            >
              <Image
                src={scrolled ? '/glownari-mark.png' : '/glownari-header-logo.png'}
                alt="Glownari"
                width={scrolled ? 96 : 620}
                height={scrolled ? 96 : 160}
                priority
                className="h-full w-full object-contain"
              />
            </span>
          </Link>

          {/* Search — inline on desktop, icon trigger on mobile */}
          <HeaderSearch />

          {/* Mobile search icon */}
          <button
            type="button"
            onClick={() => setSearchOpen((s) => !s)}
            className="ml-auto grid h-10 w-10 place-items-center rounded-md border border-white/20 bg-white/10 text-white lg:hidden"
            aria-label="Search"
          >
            {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </button>
          <div className="lg:hidden">
            <CartHeaderLink mobile />
          </div>
          <div className="lg:hidden">
            <AccountHeaderButton mobile />
          </div>

          {/* Desktop nav links */}
          <nav className="ml-auto hidden shrink-0 items-center gap-1.5 text-sm font-bold text-white/90 lg:flex">
            <Link href="/track-order" className="inline-flex h-10 items-center gap-1.5 rounded-md px-3 transition hover:bg-white/10 hover:text-white">
              <PackageCheck className="h-4 w-4" />
              Track
            </Link>
            <Link href="/#products" className="inline-flex h-10 items-center rounded-md px-3 transition hover:bg-white/10 hover:text-white">Products</Link>
            <CartHeaderLink />
            <AccountHeaderButton />
          </nav>
          <div className="hidden shrink-0 lg:block">
            <ThemeToggle inverse />
          </div>

          {/* Desktop primary CTA */}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            className="hidden h-10 shrink-0 items-center gap-2 rounded-xl bg-white px-4 text-sm font-black text-accent shadow-sm transition hover:bg-[#fff3f8] hover:shadow-card lg:inline-flex"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle className="h-4 w-4" />
            Chat
          </a>
        </div>

        {/* Slide-down search on mobile */}
        {searchOpen && (
          <div className="border-t border-white/15 bg-accent lg:hidden">
            <div className="mx-auto max-w-page px-3 py-2">
              <HeaderSearch mobile autoFocus />
            </div>
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
              <Link href="/" className="inline-flex h-12 w-[220px] items-center justify-center overflow-hidden rounded-lg bg-white px-1.5 py-1">
                <Image
                  src="/glownari-header-logo.png"
                  alt="Glownari"
                  width={620}
                  height={160}
                  priority
                  className="h-full w-full object-contain"
                />
              </Link>
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
                Why shop here
              </p>
              <ul className="space-y-1 text-sm text-text-muted">
                <li className="flex items-center gap-3 px-3 py-2">
                  <ShieldCheck className="h-4 w-4 text-success" />
                  Secure Razorpay checkout
                </li>
                <li className="flex items-center gap-3 px-3 py-2">
                  <Tag className="h-4 w-4 text-accent" />
                  Easy product management
                </li>
                <li className="flex items-center gap-3 px-3 py-2">
                  <MessageCircle className="h-4 w-4 text-whatsapp" />
                  WhatsApp support
                </li>
              </ul>
            </nav>

            <div className="border-t border-border p-3">
              <div className="mb-3 flex items-center gap-2">
                <ThemeToggle />
                <Link href="/login" className="btn-ghost flex-1">
                  Login
                </Link>
              </div>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
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
