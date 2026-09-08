'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  ChevronRight,
  Circle,
  Gem,
  Home,
  Menu,
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
  { href: '/#earrings',        label: 'Earrings' },
  { href: '/#rings',           label: 'Rings' },
  { href: '/#support',         label: 'Support' },
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
      <div className="border-b border-border bg-bg-elev-1/95 text-text backdrop-blur-xl">
        <div className="site-container flex h-16 items-center gap-2 sm:h-[76px] sm:gap-3 lg:h-[86px] lg:gap-5">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-md border border-border bg-bg-elev-2 text-text lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/" className="flex shrink-0 items-center">
            <span
              className={`inline-flex items-center justify-center overflow-hidden rounded-full border border-accent/25 bg-bg-elev-1 shadow-sm transition-all duration-300 ${
                scrolled
                  ? 'h-10 w-10'
                  : 'h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16'
              }`}
            >
              <Image
                src="/glownari-logo.png"
                alt="Glownari"
                width={180}
                height={180}
                priority
                className="h-full w-full object-cover"
              />
            </span>
          </Link>

          <HeaderSearch />

          <button
            type="button"
            onClick={() => setSearchOpen((s) => !s)}
            className="ml-auto grid h-10 w-10 place-items-center rounded-md border border-border bg-bg-elev-2 text-text lg:hidden"
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

          <nav className="ml-auto hidden shrink-0 items-center gap-2 text-[15px] font-medium text-text-muted lg:flex">
            <Link href="/track-order" className="inline-flex h-10 items-center gap-2 rounded-md px-2.5 transition hover:bg-bg-glass hover:text-text">
              <PackageCheck className="h-5 w-5" />
              Track
            </Link>
            <CartHeaderLink />
            <AccountHeaderButton />
          </nav>
          <div className="hidden shrink-0 lg:block">
            <ThemeToggle />
          </div>

        </div>

        {searchOpen && (
          <div className="border-t border-border bg-bg-elev-1 lg:hidden">
            <div className="site-container py-2.5">
              <HeaderSearch mobile autoFocus />
            </div>
          </div>
        )}
      </div>

      <div className="hidden border-b border-border bg-bg-elev-1 lg:block">
        <div className="site-container flex h-[62px] items-center justify-center gap-8 text-[17px] font-medium text-text">
          <Link href="/" className="inline-flex h-full items-center gap-2 border-b-2 border-accent px-2 text-accent">
            <Home className="h-5 w-5" />
            Home
          </Link>
          <Link href="/#earrings" className="inline-flex h-full items-center gap-2 border-b-2 border-transparent px-2 transition hover:border-accent/40 hover:text-accent">
            <Gem className="h-5 w-5" />
            Earrings
          </Link>
          <Link href="/#rings" className="inline-flex h-full items-center gap-2 border-b-2 border-transparent px-2 transition hover:border-accent/40 hover:text-accent">
            <Circle className="h-5 w-5" />
            Rings
          </Link>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            className="inline-flex h-full items-center gap-2 border-b-2 border-transparent px-2 transition hover:border-accent/40 hover:text-accent"
          >
            <MessageCircle className="h-5 w-5" />
            Support
          </a>
        </div>
      </div>

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
              <Link href="/" className="inline-flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-accent/25 bg-bg-elev-1">
                <Image
                  src="/glownari-logo.png"
                  alt="Glownari"
                  width={180}
                  height={180}
                  priority
                  className="h-full w-full object-cover"
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
