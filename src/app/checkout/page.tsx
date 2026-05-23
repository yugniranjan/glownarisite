'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Loader2,
  Lock,
  MessageCircle,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { API_URL, formatMoney, getPaymentConfig, getProduct, type StreamHubProduct } from '@/lib/api';
import PaymentMethods from '@/components/PaymentMethods';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918506965129';

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void; on: (e: string, cb: (r: unknown) => void) => void };
  }
}

/** Lazy-load the Razorpay Checkout script once. */
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.Razorpay) return resolve(true);
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

function CheckoutInner() {
  const params = useSearchParams();
  const slug = params.get('product');

  const [product, setProduct] = useState<StreamHubProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [razorpayEnabled, setRazorpayEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<{
    orderNumber: string;
    totalCents: number;
    currency: string;
    status: string;
    paid: boolean;
  } | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    getProduct(slug)
      .then((p) => setProduct(p))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    getPaymentConfig().then((c) => setRazorpayEnabled(c.razorpayEnabled)).catch(() => {});
  }, []);

  function finishOrder(data: any, paid: boolean) {
    setOrder({
      orderNumber: data.orderNumber,
      totalCents: data.totalCents,
      currency: data.currency || product?.currency || 'INR',
      status: data.status,
      paid,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function payWithRazorpay(data: any) {
    const ready = await loadRazorpayScript();
    if (!ready || !window.Razorpay) {
      setError('Could not load the payment gateway. Please retry or confirm on WhatsApp.');
      setSubmitting(false);
      return;
    }
    const p = data.payment;
    const rzp = new window.Razorpay({
      key: p.razorpayKeyId,
      order_id: p.razorpayOrderId,
      amount: p.amount,
      currency: p.currency,
      name: 'StreamHub',
      description: product?.name,
      image: '/streamhub_logo.png',
      prefill: { name: name.trim(), email: email.trim(), contact: phone.trim() },
      notes: { orderNumber: data.orderNumber },
      theme: { color: '#e50914' },
      handler: async (resp: any) => {
        try {
          const vRes = await fetch(`${API_URL}/streamhub/orders/verify-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpayOrderId: resp.razorpay_order_id,
              razorpayPaymentId: resp.razorpay_payment_id,
              razorpaySignature: resp.razorpay_signature,
            }),
          });
          const vData = await vRes.json();
          if (!vRes.ok) throw new Error(vData?.error || 'Payment verification failed');
          finishOrder(vData, true);
        } catch (err: any) {
          setError(
            err?.message ||
              'Payment received but verification failed. Message us on WhatsApp with your order number.',
          );
        } finally {
          setSubmitting(false);
        }
      },
      modal: {
        ondismiss: () => {
          setSubmitting(false);
          setError('Payment cancelled. Your order is reserved — pay again or confirm on WhatsApp.');
        },
      },
    });
    rzp.on('payment.failed', (resp: any) => {
      setError(resp?.error?.description || 'Payment failed. Please try again.');
      setSubmitting(false);
    });
    rzp.open();
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!product) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/streamhub/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name.trim(),
          phone: phone.trim(),
          email: email.trim() || null,
          productId: product.id,
          quantity,
          notes: notes.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Order failed');

      if (data.payment?.provider === 'razorpay') {
        await payWithRazorpay(data); // manages its own submitting state
        return;
      }
      finishOrder(data, false); // manual / WhatsApp-confirm flow
      setSubmitting(false);
    } catch (err: any) {
      setError(err?.message || 'Could not place order. Please try again.');
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center text-text-muted">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!slug || !product) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Pick a plan first</h1>
        <p className="mt-3 text-text-muted">
          Head back to the home page and choose a subscription to start checkout.
        </p>
        <Link href="/" className="btn-accent mt-6 inline-flex">
          Browse plans
        </Link>
      </div>
    );
  }

  // ── Success state ──
  if (order) {
    const message = encodeURIComponent(
      order.paid
        ? `Hi, I just paid for order ${order.orderNumber} (${product.name}). Please share my account details.`
        : `Hi, I just placed order ${order.orderNumber} for ${product.name}. Please confirm and share next steps.`,
    );
    return (
      <div className="mx-auto max-w-xl px-3 py-8 sm:px-4 sm:py-14">
        <div className="rounded-2xl border border-success-soft bg-bg-elev-2 p-5 text-center sm:p-8">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success-soft text-success">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="mt-5 text-2xl font-bold sm:text-3xl">
            {order.paid ? 'Payment successful!' : 'Order placed!'}
          </h1>
          <p className="mt-2 text-sm text-text-muted sm:text-base">
            {order.paid
              ? 'We’ve received your payment. Your account details arrive on WhatsApp and email — usually within 10 minutes.'
              : 'Send a WhatsApp message to confirm payment and receive your account details.'}
          </p>

          <div className="mt-5 rounded-xl border border-border bg-bg-elev-1 p-4 text-left">
            <Row label="Order number" value={<span className="font-mono">{order.orderNumber}</span>} />
            <Row label="Plan" value={product.name} />
            <Row label="Total" value={formatMoney(order.totalCents, order.currency)} />
            <Row
              label="Status"
              value={
                <span className="badge-verified">
                  <CheckCircle2 className="h-3 w-3" />
                  {order.status}
                </span>
              }
            />
          </div>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`}
            className="btn-whatsapp mt-5 w-full"
          >
            <MessageCircle className="h-4 w-4" />
            {order.paid ? 'Message us on WhatsApp' : 'Confirm on WhatsApp'}
          </a>
          <Link href="/track-order" className="btn-ghost mt-2 w-full">
            Track later
          </Link>

          <p className="mt-5 text-xs text-text-muted">
            We&apos;ve also queued an email update. Most orders activate in under 10 minutes.
          </p>
        </div>
      </div>
    );
  }

  // ── Checkout form ──
  const save = product.compareAtCents
    ? Math.max(product.compareAtCents - product.priceCents, 0)
    : 0;
  const total = product.priceCents * quantity;

  return (
    <div className="mx-auto max-w-page px-3 pb-28 pt-4 sm:px-4 sm:pb-12 sm:pt-6">
      <Link
        href={`/products/${product.slug}`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text sm:text-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to plan
      </Link>

      <h1 className="mt-3 text-2xl font-bold sm:text-3xl">Secure checkout</h1>
      <p className="mt-1 text-sm text-text-muted">
        {razorpayEnabled
          ? 'Pay securely online — your account details arrive on WhatsApp and email in under 10 minutes.'
          : "We'll create your order, confirm payment over WhatsApp, then deliver your account details in under 10 minutes."}
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* ─── Form ─── */}
        <form onSubmit={submit} className="rounded-xl border border-border bg-bg-elev-2 p-4 sm:p-6">
          <h2 className="text-base font-semibold sm:text-lg">Your details</h2>
          <p className="mt-1 text-xs text-text-muted">
            We only use these to deliver your order. No spam, ever.
          </p>

          {error && (
            <div className="mt-4 rounded-md border border-danger/40 bg-danger-soft px-3 py-2 text-sm text-danger">
              {error}
            </div>
          )}

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Full name" required>
              <input
                className="input"
                required
                placeholder="e.g. Anita Rao"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                inputMode="text"
                autoCapitalize="words"
              />
            </Field>
            <Field label="Phone number" required>
              <input
                className="input"
                required
                placeholder="+91 9999 99 9999"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                inputMode="tel"
                pattern="^\+?\d[\d\s\-]{6,}$"
              />
            </Field>
          </div>

          <div className="mt-4">
            <Field label="Email" hint="For receipts and order updates">
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                inputMode="email"
              />
            </Field>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-[120px_1fr]">
            <Field label="Quantity">
              <select
                className="input"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Notes" hint="Anything we should know (preferred app, region, etc.)">
              <input
                className="input"
                placeholder="Optional"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Field>
          </div>

          {/* Trust row */}
          <div className="mt-6 flex flex-wrap gap-3 text-xs text-text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-success" /> SSL secured
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-success" /> No data sold
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-accent" /> Cancel anytime before delivery
            </span>
          </div>
        </form>

        {/* ─── Order summary (desktop sticky / mobile inline) ─── */}
        <aside className="lg:sticky lg:top-32 lg:h-max">
          <div className="rounded-xl border border-border bg-bg-elev-2 p-4 sm:p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
              Order summary
            </h2>

            <div className="mt-4 flex items-start gap-3 border-b border-border pb-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-bg-elev-3">
                {product.coverImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.coverImage} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{product.name}</div>
                <div className="text-xs text-text-muted">
                  {product.durationDays || 30} days · qty {quantity}
                </div>
                <div className="mt-1 text-sm font-bold text-text">
                  {formatMoney(product.priceCents, product.currency)}
                </div>
              </div>
            </div>

            <dl className="mt-4 space-y-2.5 text-sm">
              <div className="flex justify-between text-text-muted">
                <dt>Subtotal</dt>
                <dd>{formatMoney(total, product.currency)}</dd>
              </div>
              {save > 0 && (
                <div className="flex justify-between text-success">
                  <dt>Saving</dt>
                  <dd>− {formatMoney(save * quantity, product.currency)}</dd>
                </div>
              )}
              <div className="flex justify-between text-text-muted">
                <dt>Delivery</dt>
                <dd className="inline-flex items-center gap-1 text-success">
                  <Zap className="h-3.5 w-3.5" /> Instant
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-border pt-3 text-base font-semibold text-text">
                <dt>Total</dt>
                <dd>{formatMoney(total, product.currency)}</dd>
              </div>
            </dl>

            <button form="" type="submit" onClick={submit} className="btn-accent mt-4 hidden w-full lg:inline-flex" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting
                ? razorpayEnabled
                  ? 'Opening payment…'
                  : 'Placing order…'
                : `${razorpayEnabled ? 'Pay' : 'Place order —'} ${formatMoney(total, product.currency)}`}
            </button>

            <div className="mt-4 border-t border-border pt-4">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-dim">
                Payment options
              </div>
              <PaymentMethods />
            </div>

            <p className="mt-4 flex items-start gap-2 text-xs text-text-muted">
              <CreditCard className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
              {razorpayEnabled
                ? 'Payments are processed securely by Razorpay. We never store your card details.'
                : "You'll finalise payment after confirming on WhatsApp. We never store card details on our servers."}
            </p>
          </div>
        </aside>
      </div>

      {/* Sticky mobile place-order bar */}
      <div
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-bg-elev-1/95 backdrop-blur lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0)' }}
      >
        <div className="mx-auto flex max-w-page items-center gap-3 px-3 py-3">
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-text-dim">
              Total
            </div>
            <div className="text-lg font-bold text-text">
              {formatMoney(total, product.currency)}
            </div>
          </div>
          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="btn-accent h-11 flex-1 !px-4 text-[14px]"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? (razorpayEnabled ? 'Opening…' : 'Placing…') : razorpayEnabled ? 'Pay now' : 'Place order'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-text">
        {label}
        {required && <span className="text-danger">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-text-muted">{hint}</span>}
    </label>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5 text-sm">
      <span className="text-text-muted">{label}</span>
      <span className="font-semibold text-text">{value}</span>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-[60vh] place-items-center text-text-muted">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      }
    >
      <CheckoutInner />
    </Suspense>
  );
}
