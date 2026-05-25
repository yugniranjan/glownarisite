'use client';

import { useState } from 'react';
import {
  Ban,
  CheckCircle2,
  Clock,
  Loader2,
  MessageCircle,
  Package,
  RotateCcw,
  Search,
  XCircle,
} from 'lucide-react';
import { API_URL, formatMoney } from '@/lib/api';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918506965129';

interface TrackedOrder {
  orderNumber: string;
  status: string;
  statusReason?: string | null;
  customerName: string;
  quantity: number;
  totalCents: number;
  currency: string;
  product?: { name: string; coverImage?: string | null };
}

// The happy-path order lifecycle shown as a 4-step progress bar.
const FLOW = ['PENDING', 'CONFIRMED', 'PROCESSING', 'DELIVERED'] as const;

type Tone = 'red' | 'gray';
const STATUS_META: Record<
  string,
  { label: string; badge: string; dot: string; tone?: Tone; note?: string }
> = {
  PENDING:    { label: 'Pending',    badge: 'bg-danger-soft text-danger',   dot: 'bg-danger' },
  CONFIRMED:  { label: 'Confirmed',  badge: 'bg-info-soft text-info',       dot: 'bg-info' },
  PROCESSING: { label: 'Processing', badge: 'bg-info-soft text-info',       dot: 'bg-info' },
  DELIVERED:  { label: 'Delivered',  badge: 'bg-success-soft text-success', dot: 'bg-success' },
  CANCELLED:  { label: 'Cancelled',  badge: 'bg-accent-soft text-accent',   dot: 'bg-accent', tone: 'red',  note: 'This order was cancelled. If this looks wrong, message us on WhatsApp.' },
  REFUNDED:   { label: 'Refunded',   badge: 'bg-bg-elev-3 text-text-muted', dot: 'bg-text-dim', tone: 'gray', note: 'This order was refunded. The amount should reflect in your account soon.' },
  BANNED:     { label: 'Banned',     badge: 'bg-accent-soft text-accent',   dot: 'bg-accent', tone: 'red',  note: 'This order has been banned. Please contact support for details.' },
};

function statusMeta(status: string) {
  return STATUS_META[status] || STATUS_META.PENDING;
}

function flowIndex(status: string) {
  const i = FLOW.indexOf(status as (typeof FLOW)[number]);
  return i === -1 ? 0 : i;
}

// Display 10 digits as "98765 43210" while state stays pure digits.
function formatPhoneDisplay(digits: string) {
  const d = digits.slice(0, 10);
  return d.length > 5 ? `${d.slice(0, 5)} ${d.slice(5)}` : d;
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
    if (phone.length !== 10) {
      setError('Enter the 10-digit phone number you used at checkout.');
      return;
    }
    setOrder(null);
    setLoading(true);
    try {
      const q = new URLSearchParams({ orderNumber: orderNumber.trim(), phone: `+91${phone}` });
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
            <div className="flex h-11 w-full items-stretch overflow-hidden rounded-md border border-[var(--border)] bg-[var(--bg-elev-3)] transition-colors focus-within:border-[var(--accent)]">
              <span className="flex select-none items-center gap-1.5 border-r border-[var(--border)] px-3 text-sm font-medium text-text-muted">
                <span className="text-base leading-none">🇮🇳</span>
                +91
              </span>
              <input
                className="min-w-0 flex-1 bg-transparent px-3 text-sm tracking-wide text-text outline-none placeholder:text-[var(--text-dim)]"
                required
                placeholder="98765 43210"
                value={formatPhoneDisplay(phone)}
                onChange={(e) =>
                  setPhone(
                    e.target.value
                      .replace(/\D/g, '')
                      .replace(/^0+/, '')
                      .replace(/^91(\d{10})$/, '$1')
                      .slice(0, 10),
                  )
                }
                inputMode="numeric"
                autoComplete="tel-national"
                maxLength={11}
              />
            </div>
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

      {order && (() => {
        const meta = statusMeta(order.status);
        const isFlow = (FLOW as readonly string[]).includes(order.status);
        const idx = flowIndex(order.status);
        return (
          <div className="mt-6 rounded-xl border border-border bg-bg-elev-2 p-4 sm:mt-8 sm:p-6">
            {/* Header */}
            <div className="flex flex-col gap-2 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="font-mono text-xs text-text-muted">{order.orderNumber}</div>
                <h2 className="mt-1 text-lg font-semibold sm:text-xl">
                  {order.product?.name || 'Subscription order'}
                </h2>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 self-start rounded-full px-2.5 py-1 text-xs font-semibold ${meta.badge}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                {meta.label}
              </span>
            </div>

            {isFlow ? (
              /* Progress steps */
              <div className="mt-6">
                <ol className="relative grid grid-cols-4 gap-2 text-center text-[10px] font-semibold sm:text-xs">
                  <div
                    aria-hidden
                    className="absolute left-[12.5%] right-[12.5%] top-3.5 h-0.5 -translate-y-1/2 rounded-full bg-border sm:top-4"
                  />
                  <div
                    aria-hidden
                    className="absolute left-[12.5%] top-3.5 h-0.5 -translate-y-1/2 rounded-full bg-success transition-all duration-500 sm:top-4"
                    style={{ width: `${(idx / (FLOW.length - 1)) * 75}%` }}
                  />
                  {FLOW.map((s, i) => {
                    const done = i <= idx;
                    const current = i === idx;
                    return (
                      <li key={s} className="relative z-10 flex flex-col items-center gap-1.5">
                        <span
                          className={`grid h-7 w-7 place-items-center rounded-full border-2 transition-all sm:h-8 sm:w-8 ${
                            done
                              ? 'border-success bg-success text-bg'
                              : 'border-border bg-bg-elev-1 text-text-dim'
                          } ${current ? 'ring-4 ring-success/25' : ''}`}
                        >
                          {done ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-3.5 w-3.5" />}
                        </span>
                        <span
                          className={`uppercase tracking-wider ${
                            current ? 'text-success' : done ? 'text-text' : 'text-text-dim'
                          }`}
                        >
                          {s.toLowerCase()}
                        </span>
                      </li>
                    );
                  })}
                </ol>
                {order.statusReason && (
                  <p className="mt-5 rounded-lg bg-bg-elev-3 p-3 text-sm text-text-muted">
                    <span className="font-medium text-text">Note: </span>
                    {order.statusReason}
                  </p>
                )}
              </div>
            ) : (
              /* Terminal / negative status banner */
              <div
                className={`mt-6 flex items-center gap-3 rounded-lg p-4 ${
                  meta.tone === 'red' ? 'bg-accent-soft' : 'bg-bg-elev-3'
                }`}
              >
                {order.status === 'REFUNDED' ? (
                  <RotateCcw className="h-6 w-6 shrink-0 text-text-muted" />
                ) : order.status === 'BANNED' ? (
                  <Ban className="h-6 w-6 shrink-0 text-accent" />
                ) : (
                  <XCircle className="h-6 w-6 shrink-0 text-accent" />
                )}
                <div>
                  <div className={`font-semibold ${meta.tone === 'red' ? 'text-accent' : 'text-text'}`}>
                    {meta.label}
                  </div>
                  <p className="mt-0.5 text-sm text-text-muted">{order.statusReason || meta.note}</p>
                </div>
              </div>
            )}

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
        );
      })()}
    </div>
  );
}
