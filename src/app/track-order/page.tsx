'use client';

import { useState } from 'react';
import { CheckCircle2, Clock, Loader2, MessageCircle, Package, Search } from 'lucide-react';
import { API_URL, formatMoney } from '@/lib/api';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919999999999';

interface TrackedOrder {
  orderNumber: string;
  status: string;
  customerName: string;
  quantity: number;
  totalCents: number;
  currency: string;
  product?: { name: string; coverImage?: string | null };
}

const STATUS_FLOW = ['PENDING', 'CONFIRMED', 'PROCESSING', 'DELIVERED'] as const;

function statusIndex(s: string) {
  const i = STATUS_FLOW.indexOf(s as (typeof STATUS_FLOW)[number]);
  return i === -1 ? 0 : i;
}

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<TrackedOrder | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setOrder(null);
    setLoading(true);
    try {
      const q = new URLSearchParams({ orderNumber, phone });
      const res = await fetch(`${API_URL}/streamhub/orders/track?${q}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'We could not find that order');
      setOrder(data);
    } catch (err: any) {
      setError(err?.message || 'Could not track order');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-3 py-6 sm:px-4 sm:py-12">
      <div className="text-center">
        <Package className="mx-auto h-10 w-10 text-accent sm:h-12 sm:w-12" />
        <h1 className="mt-3 text-2xl font-bold sm:text-3xl">Track your order</h1>
        <p className="mt-2 text-sm text-text-muted sm:text-base">
          Enter the order number and phone you used at checkout.
        </p>
      </div>

      <form
        onSubmit={submit}
        className="mt-6 rounded-xl border border-border bg-bg-elev-2 p-4 sm:mt-8 sm:p-6"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-text">Order number</span>
            <input
              className="input"
              required
              placeholder="SH-2024-XXXXX"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              autoCapitalize="characters"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-text">Phone number</span>
            <input
              className="input"
              required
              placeholder="+91 9999 99 9999"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="tel"
              autoComplete="tel"
            />
          </label>
        </div>

        <button type="submit" disabled={loading} className="btn-accent mt-4 w-full">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          {loading ? 'Looking up…' : 'Track order'}
        </button>

        <p className="mt-3 text-xs text-text-muted">
          Lost your order number?{' '}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            className="font-semibold text-whatsapp underline-offset-2 hover:underline"
          >
            Message us on WhatsApp
          </a>
          .
        </p>
      </form>

      {error && (
        <div className="mt-5 rounded-md border border-danger/40 bg-danger-soft p-4 text-sm text-danger">
          {error}
        </div>
      )}

      {order && (
        <div className="mt-6 rounded-xl border border-border bg-bg-elev-2 p-4 sm:mt-8 sm:p-6">
          {/* Header */}
          <div className="flex flex-col gap-2 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs font-mono text-text-muted">{order.orderNumber}</div>
              <h2 className="mt-1 text-lg font-semibold sm:text-xl">
                {order.product?.name || 'Subscription order'}
              </h2>
            </div>
            <span className="badge-verified self-start">
              <CheckCircle2 className="h-3 w-3" />
              {order.status}
            </span>
          </div>

          {/* Progress steps */}
          <div className="mt-5">
            <ol className="relative grid grid-cols-4 gap-2 text-center text-[10px] font-semibold sm:text-xs">
              <div
                aria-hidden
                className="absolute left-[12.5%] right-[12.5%] top-3 h-0.5 -translate-y-1/2 bg-border sm:top-3.5"
              />
              <div
                aria-hidden
                className="absolute left-[12.5%] top-3 h-0.5 -translate-y-1/2 bg-success transition-all sm:top-3.5"
                style={{
                  width: `${(statusIndex(order.status) / (STATUS_FLOW.length - 1)) * 75}%`,
                }}
              />
              {STATUS_FLOW.map((s, i) => {
                const done = i <= statusIndex(order.status);
                return (
                  <li key={s} className="relative z-10 flex flex-col items-center gap-1.5">
                    <span
                      className={`grid h-6 w-6 place-items-center rounded-full border-2 sm:h-7 sm:w-7 ${
                        done
                          ? 'border-success bg-success text-bg'
                          : 'border-border bg-bg-elev-1 text-text-dim'
                      }`}
                    >
                      {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock className="h-3 w-3" />}
                    </span>
                    <span
                      className={`uppercase tracking-wider ${
                        done ? 'text-text' : 'text-text-dim'
                      }`}
                    >
                      {s.toLowerCase()}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Details grid */}
          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-xs text-text-muted">Customer</dt>
              <dd className="mt-0.5 font-semibold">{order.customerName}</dd>
            </div>
            <div>
              <dt className="text-xs text-text-muted">Quantity</dt>
              <dd className="mt-0.5 font-semibold">{order.quantity}</dd>
            </div>
            <div>
              <dt className="text-xs text-text-muted">Total</dt>
              <dd className="mt-0.5 font-semibold">
                {formatMoney(order.totalCents, order.currency)}
              </dd>
            </div>
          </dl>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi, I want an update on order ${order.orderNumber}`}
            className="btn-whatsapp mt-6 w-full"
          >
            <MessageCircle className="h-4 w-4" />
            Ask for an update
          </a>
        </div>
      )}
    </div>
  );
}
