'use client';

import Link from 'next/link';
import { CheckCircle2, ShoppingBag, X } from 'lucide-react';
import { useEffect, useState } from 'react';

type ToastPayload = {
  title: string;
  message?: string;
  href?: string;
  actionLabel?: string;
};

type ToastItem = ToastPayload & { id: number };

export const TOAST_EVENT = 'glownari-toast';

export function showToast(payload: ToastPayload) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<ToastPayload>(TOAST_EVENT, { detail: payload }));
}

export default function ToastProvider() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    function onToast(event: Event) {
      const detail = (event as CustomEvent<ToastPayload>).detail;
      const id = Date.now();
      setToasts((prev) => [{ id, ...detail }, ...prev].slice(0, 3));
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, 3200);
    }
    window.addEventListener(TOAST_EVENT, onToast);
    return () => window.removeEventListener(TOAST_EVENT, onToast);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed right-3 top-20 z-[70] flex w-[calc(100vw-1.5rem)] max-w-sm flex-col gap-2 sm:right-5">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="overflow-hidden rounded-xl border border-border bg-bg-elev-2 shadow-[0_18px_44px_rgba(15,23,42,0.20)]"
        >
          <div className="flex items-start gap-3 p-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-success-soft text-success">
              <CheckCircle2 className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-black text-text">{toast.title}</div>
              {toast.message && <div className="mt-0.5 line-clamp-2 text-xs leading-5 text-text-muted">{toast.message}</div>}
              {toast.href && (
                <Link href={toast.href} className="mt-2 inline-flex items-center gap-1.5 text-xs font-black text-accent">
                  <ShoppingBag className="h-3.5 w-3.5" />
                  {toast.actionLabel || 'View'}
                </Link>
              )}
            </div>
            <button
              type="button"
              onClick={() => setToasts((prev) => prev.filter((item) => item.id !== toast.id))}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-text-muted hover:bg-bg-glass hover:text-text"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
