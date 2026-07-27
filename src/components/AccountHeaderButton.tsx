'use client';

import Link from 'next/link';
import { UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AUTH_EVENT, fetchMe, getStoredUser, type StoreUser } from '@/lib/auth';

function initialsFor(user: StoreUser) {
  const source = (user.name || user.email || '').trim();
  if (!source) return 'U';
  const words = source
    .replace(/@.*/, '')
    .split(/\s+/)
    .filter(Boolean);
  const first = words[0]?.[0] || 'U';
  const last = words.length > 1 ? words[words.length - 1]?.[0] : words[0]?.[1];
  return `${first}${last || ''}`.toUpperCase();
}

export default function AccountHeaderButton({ mobile = false }: { mobile?: boolean }) {
  const [user, setUser] = useState<StoreUser | null>(null);

  useEffect(() => {
    const refresh = () => setUser(getStoredUser());
    refresh();
    fetchMe().catch(() => undefined);
    window.addEventListener(AUTH_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(AUTH_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  if (!user) {
    return (
      <Link
        href="/login"
        className={mobile
          ? 'grid h-10 w-10 place-items-center rounded-md border border-border bg-bg-elev-2 text-text'
          : 'inline-flex h-10 items-center gap-1.5 rounded-md px-2 font-semibold text-text-muted hover:bg-bg-glass hover:text-text'}
        aria-label="Login"
      >
        <UserRound className="h-4 w-4" />
        {!mobile && 'Login'}
      </Link>
    );
  }

  if (mobile) {
    return (
      <Link
        href="/profile"
        className="grid h-10 w-10 place-items-center rounded-full border border-border bg-bg-elev-2 text-sm font-black text-accent"
        aria-label="Profile"
      >
        {initialsFor(user)}
      </Link>
    );
  }

  return (
    <Link
      href="/profile"
      className="grid h-10 w-10 place-items-center rounded-md transition hover:bg-bg-glass"
      title="Profile"
      aria-label="Profile"
    >
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent-soft text-xs font-black text-accent">
        {initialsFor(user)}
      </span>
    </Link>
  );
}
