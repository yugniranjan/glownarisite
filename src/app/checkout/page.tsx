'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Copy,
  Loader2,
  Lock,
  MessageCircle,
  QrCode,
  ShieldCheck,
  X,
  Zap,
} from 'lucide-react';
import {
  API_URL, formatMoney, getPaymentConfig, getProduct, type StreamHubProduct,
} from '@/lib/api';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918506965129';
// The live UPI is configured entirely from admin settings and fetched at runtime
// via getPaymentConfig(); there is no env/build-time UPI fallback.
const DEFAULT_UPI_NAME = 'StreamHub';

type CheckoutField = 'name' | 'phone' | 'email' | 'quantity' | 'notes' | 'paymentUtr';
type CheckoutErrors = Partial<Record<CheckoutField, string>>;

function normalizeName(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

function normalizePhone(value: string) {
  let digits = value.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  return digits.length === 10 ? `+91${digits}` : value.trim();
}

function normalizeUtrInput(value: string) {
  return value.replace(/\s+/g, '').toUpperCase();
}

function validateCheckout(values: {
  name: string;
  phone: string;
  email: string;
  quantity: number;
  notes: string;
  paymentUtr: string;
}) {
  const normalized = {
    name: normalizeName(values.name),
    phone: normalizePhone(values.phone),
    email: values.email.trim(),
    quantity: Number(values.quantity),
    notes: values.notes.trim(),
    paymentUtr: normalizeUtrInput(values.paymentUtr),
  };
  const errors: CheckoutErrors = {};
  const phoneDigits = normalized.phone.replace(/\D/g, '').replace(/^91/, '');

  if (normalized.name.length < 2) {
    errors.name = 'Enter your full name.';
  } else if (normalized.name.length > 80) {
    errors.name = 'Name can be up to 80 characters.';
  } else if (!/^[\p{L}][\p{L}\s.'-]*$/u.test(normalized.name)) {
    errors.name = 'Name can contain letters, spaces, dot, apostrophe, or hyphen.';
  }

  if (!/^[6-9]\d{9}$/.test(phoneDigits)) {
    errors.phone = 'Enter a valid 10-digit Indian mobile number.';
  }

  if (normalized.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normalized.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!Number.isInteger(normalized.quantity) || normalized.quantity < 1 || normalized.quantity > 5) {
    errors.quantity = 'Choose a quantity between 1 and 5.';
  }

  if (normalized.notes.length > 500) {
    errors.notes = 'Notes can be up to 500 characters.';
  }

  if (!normalized.paymentUtr) {
    errors.paymentUtr = 'Enter your UTR / transaction reference after payment.';
  } else if (!/^[A-Z0-9-]{6,40}$/.test(normalized.paymentUtr)) {
    errors.paymentUtr = 'UTR must be 6-40 characters using letters, numbers, or hyphen.';
  }

  return { errors, normalized };
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
  const [paymentUtr, setPaymentUtr] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [botTrap, setBotTrap] = useState('');
  const [checkoutStartedAt, setCheckoutStartedAt] = useState(() => Date.now());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<CheckoutErrors>({});
  const [paymentNotice, setPaymentNotice] = useState<string | null>(null);
  const [showQr, setShowQr] = useState(false);
  const [qrImageFailed, setQrImageFailed] = useState(false);
  const [order, setOrder] = useState<{
    orderNumber: string;
    totalCents: number;
    currency: string;
    status: string;
    paymentUtr: string;
  } | null>(null);
  const [upiId, setUpiId] = useState('');
  const [upiName, setUpiName] = useState(DEFAULT_UPI_NAME);

  useEffect(() => {
    getPaymentConfig()
      .then((cfg) => {
        if (cfg.upiId) setUpiId(cfg.upiId);
        if (cfg.upiName) setUpiName(cfg.upiName);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    getProduct(slug)
      .then((p) => {
        setProduct(p);
        setCheckoutStartedAt(Date.now());
      })
      .finally(() => setLoading(false));
  }, [slug]);

  function finishOrder(data: any) {
    setOrder({
      orderNumber: data.orderNumber,
      totalCents: data.totalCents,
      currency: data.currency || product?.currency || 'INR',
      status: data.status,
      paymentUtr: data.paymentUtr || paymentUtr.trim(),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function submit(e?: React.FormEvent | React.MouseEvent) {
    e?.preventDefault();
    if (!product) return;
    setError(null);
    const { errors, normalized } = validateCheckout({
      name,
      phone,
      email,
      quantity,
      notes,
      paymentUtr,
    });
    setFieldErrors(errors);
    const firstError = Object.values(errors)[0];
    if (firstError) {
      setError(firstError);
      return;
    }

    setName(normalized.name);
    setPhone(normalized.phone);
    setEmail(normalized.email);
    setNotes(normalized.notes);
    setPaymentUtr(normalized.paymentUtr);
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/streamhub/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: normalized.name,
          phone: normalized.phone,
          email: normalized.email || null,
          productId: product.id,
          quantity: normalized.quantity,
          paymentUtr: normalized.paymentUtr,
          paymentUpiId: upiId || null,
          notes: normalized.notes || null,
          checkoutStartedAt,
          botTrap,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Order failed');

      finishOrder(data);
      setSubmitting(false);
    } catch (err: any) {
      setError(err?.message || 'Could not place order. Please try again.');
      setSubmitting(false);
    }
  }

  async function copyPaymentDetails(totalCents: number, currency: string) {
    if (!upiId) return;
    try {
      await navigator.clipboard.writeText(
        `UPI ID: ${upiId}\nName: ${upiName}\nAmount: ${formatMoney(totalCents, currency)}`,
      );
    } catch {
      /* clipboard may be blocked; the visible UPI ID is still copyable */
    }
  }

  async function openUpiPayment(upiUrl: string, totalCents: number, currency: string) {
    setError(null);
    setQrImageFailed(false);
    if (!upiId || !upiUrl) {
      setPaymentNotice('UPI ID abhi configure nahi hai. Admin settings me current UPI set karo.');
      return;
    }

    await copyPaymentDetails(totalCents, currency);
    setShowQr(true);
    setPaymentNotice('UPI app open karne ki koshish ho rahi hai. Details clipboard me copy ho gayi hain.');

    window.location.href = upiUrl;
    window.setTimeout(() => {
      setPaymentNotice(
        'Agar UPI app open nahi hua, apne PhonePe/GPay/Paytm app me UPI ID paste karke exact amount pay kar do.',
      );
    }, 900);
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
      `Hi, I submitted payment for order ${order.orderNumber} (${product.name}). UTR: ${order.paymentUtr}. Please verify and share my account details.`,
    );
    return (
      <div className="mx-auto max-w-xl px-3 py-8 sm:px-4 sm:py-14">
        <div className="rounded-2xl border border-success-soft bg-bg-elev-2 p-5 text-center sm:p-8">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success-soft text-success">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="mt-5 text-2xl font-bold sm:text-3xl">Order submitted!</h1>
          <p className="mt-2 text-sm text-text-muted sm:text-base">
            We&apos;ve received your UTR. Our team will verify payment and deliver your account details on WhatsApp.
          </p>

          <div className="mt-5 rounded-xl border border-border bg-bg-elev-1 p-4 text-left">
            <Row
              label="Order number"
              value={
                <span className="inline-flex items-center gap-2">
                  <span className="font-mono">{order.orderNumber}</span>
                  <CopyButton text={order.orderNumber} />
                </span>
              }
            />
            <Row label="Plan" value={product.name} />
            <Row label="Total" value={formatMoney(order.totalCents, order.currency)} />
            <Row
              label="UTR"
              value={<span className="font-mono">{order.paymentUtr}</span>}
            />
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
            Send UTR on WhatsApp
          </a>
          <Link href="/track-order" className="btn-ghost mt-2 w-full">
            Track later
          </Link>

          <p className="mt-5 text-xs text-text-muted">
            Keep your payment screenshot handy. Most verified orders activate in under 10 minutes.
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
  const upiAmount = (total / 100).toFixed(2);
  const upiUrl = upiId
    ? `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}&am=${upiAmount}&cu=${product.currency}&tn=${encodeURIComponent(`StreamHub ${product.name}`)}`
    : '';
  const qrImageUrl = upiUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=12&data=${encodeURIComponent(upiUrl)}`
    : '';

  return (
    <div className="mx-auto max-w-page px-3 pb-28 pt-4 sm:px-4 sm:pb-12 sm:pt-6">
      {showQr && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-black/85 px-3 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl border border-border bg-bg-elev-2 p-4 shadow-soft sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
                  <QrCode className="h-4 w-4" />
                  Scan and pay
                </div>
                <h2 className="mt-1 text-lg font-semibold text-text">
                  {formatMoney(total, product.currency)}
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close QR code"
                onClick={() => setShowQr(false)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-border bg-bg-elev-3 text-text-muted hover:text-text"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 rounded-lg bg-white p-3">
              {qrImageUrl && !qrImageFailed ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrImageUrl}
                  alt="UPI payment QR code"
                  className="mx-auto aspect-square w-full max-w-[300px]"
                  onError={() => setQrImageFailed(true)}
                />
              ) : (
                <div className="grid aspect-square place-items-center rounded-md bg-zinc-100 p-5 text-center text-sm font-semibold text-zinc-800">
                  QR load nahi hua. UPI ID copy karke manually pay karein.
                </div>
              )}
            </div>

            <div className="mt-4 rounded-lg border border-border bg-bg-elev-1 p-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-text-muted">UPI ID</span>
                <span className="min-w-0 truncate font-mono font-semibold">{upiId}</span>
              </div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="text-text-muted">Amount</span>
                <span className="font-semibold">{formatMoney(total, product.currency)}</span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <CopyButton text={upiId} label="Copy UPI" />
              <button
                type="button"
                onClick={() => openUpiPayment(upiUrl, total, product.currency)}
                className="btn-whatsapp h-9 px-3 text-xs"
              >
                Open app
              </button>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-text-muted">
              Payment ke baad app me dikhne wala UTR / reference number niche form me paste karein.
            </p>
          </div>
        </div>
      )}

      <Link
        href={`/products/${product.slug}`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text sm:text-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to plan
      </Link>

      <h1 className="mt-3 text-2xl font-bold sm:text-3xl">Secure checkout</h1>
      <p className="mt-1 text-sm text-text-muted">
        Pay with UPI, enter your UTR / transaction reference, and our team will verify it before delivery.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* ─── Form ─── */}
        <form onSubmit={submit} noValidate className="rounded-xl border border-border bg-bg-elev-2 p-4 sm:p-6">
          <div className="hidden" aria-hidden="true">
            <label>
              Website
              <input
                tabIndex={-1}
                autoComplete="off"
                value={botTrap}
                onChange={(e) => setBotTrap(e.target.value)}
              />
            </label>
          </div>
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
            <Field label="Full name" required error={fieldErrors.name}>
              <input
                className={`input ${fieldErrors.name ? 'border-danger' : ''}`}
                required
                placeholder="e.g. Anita Rao"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: undefined }));
                }}
                maxLength={80}
                aria-invalid={Boolean(fieldErrors.name)}
                autoComplete="name"
                inputMode="text"
                autoCapitalize="words"
              />
            </Field>
            <Field label="Phone number" required error={fieldErrors.phone}>
              <input
                className={`input ${fieldErrors.phone ? 'border-danger' : ''}`}
                required
                placeholder="+91 9999 99 9999"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (fieldErrors.phone) setFieldErrors((prev) => ({ ...prev, phone: undefined }));
                }}
                maxLength={18}
                aria-invalid={Boolean(fieldErrors.phone)}
                autoComplete="tel"
                inputMode="tel"
              />
            </Field>
          </div>

          <div className="mt-4">
            <Field label="Email" hint="For receipts and order updates" error={fieldErrors.email}>
              <input
                type="email"
                className={`input ${fieldErrors.email ? 'border-danger' : ''}`}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
                }}
                maxLength={120}
                aria-invalid={Boolean(fieldErrors.email)}
                autoComplete="email"
                inputMode="email"
              />
            </Field>
          </div>

          <div className="mt-4 rounded-lg border border-border bg-bg-elev-1 p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-text-dim">
              Payment step
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
              <Field label="UPI ID">
                <div className="flex gap-2">
                  <input className="input font-mono" value={upiId || 'UPI ID not configured'} readOnly />
                  {upiId && <CopyButton text={upiId} />}
                </div>
              </Field>
              <button
                type="button"
                onClick={() => openUpiPayment(upiUrl, total, product.currency)}
                disabled={!upiId}
                className="btn-whatsapp h-11 whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-50"
              >
                Pay {formatMoney(total, product.currency)}
              </button>
            </div>
            {paymentNotice && (
              <div className="mt-3 rounded-md border border-info/30 bg-info-soft px-3 py-2 text-xs leading-relaxed text-info">
                {paymentNotice}
              </div>
            )}
            <p className="mt-2 text-xs text-text-muted">
              Mobile par ye button UPI app open karega. Desktop par UPI ID copy karke manually pay karein.
            </p>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-[120px_1fr]">
            <Field label="Quantity" error={fieldErrors.quantity}>
              <select
                className={`input ${fieldErrors.quantity ? 'border-danger' : ''}`}
                value={quantity}
                onChange={(e) => {
                  setQuantity(parseInt(e.target.value, 10));
                  if (fieldErrors.quantity) setFieldErrors((prev) => ({ ...prev, quantity: undefined }));
                }}
                aria-invalid={Boolean(fieldErrors.quantity)}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Notes" hint={`${notes.length}/500 characters`} error={fieldErrors.notes}>
              <input
                className={`input ${fieldErrors.notes ? 'border-danger' : ''}`}
                placeholder="Optional"
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                  if (fieldErrors.notes) setFieldErrors((prev) => ({ ...prev, notes: undefined }));
                }}
                maxLength={500}
                aria-invalid={Boolean(fieldErrors.notes)}
              />
            </Field>
          </div>

          <div className="mt-4">
            <Field
              label="UTR / transaction reference"
              hint="Example: 412345678901 or bank reference shown after UPI payment"
              required
              error={fieldErrors.paymentUtr}
            >
              <input
                className={`input font-mono uppercase ${fieldErrors.paymentUtr ? 'border-danger' : ''}`}
                required
                minLength={6}
                maxLength={40}
                placeholder="Enter UTR after payment"
                value={paymentUtr}
                onChange={(e) => {
                  setPaymentUtr(normalizeUtrInput(e.target.value));
                  if (fieldErrors.paymentUtr) setFieldErrors((prev) => ({ ...prev, paymentUtr: undefined }));
                }}
                aria-invalid={Boolean(fieldErrors.paymentUtr)}
                autoComplete="off"
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
              {submitting ? 'Submitting UTR…' : `Submit UTR — ${formatMoney(total, product.currency)}`}
            </button>

            <div className="mt-4 border-t border-border pt-4">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-dim">
                Manual UPI payment
              </div>
              <div className="rounded-lg border border-border bg-bg-elev-1 p-3">
                <div className="text-[11px] uppercase tracking-wider text-text-dim">Pay to</div>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="truncate font-mono text-sm font-semibold">{upiId || 'Configure UPI ID'}</span>
                  {upiId && <CopyButton text={upiId} />}
                </div>
                <div className="mt-2 text-xs text-text-muted">Amount: {formatMoney(total, product.currency)}</div>
              </div>
            </div>

            <p className="mt-4 flex items-start gap-2 text-xs text-text-muted">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
              Orders are delivered only after manual UTR verification.
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
            {submitting ? 'Submitting…' : 'Submit UTR'}
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
  error,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-text">
        {label}
        {required && <span className="text-danger">*</span>}
      </span>
      {children}
      {error ? (
        <span className="mt-1 block text-[11px] font-semibold text-danger">{error}</span>
      ) : (
        hint && <span className="mt-1 block text-[11px] text-text-muted">{hint}</span>
      )}
    </label>
  );
}

function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label="Copy order number"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* clipboard unavailable — ignore */
        }
      }}
      className="inline-flex items-center gap-1 rounded-md border border-border bg-bg-elev-3 px-2 py-1 text-[11px] font-semibold text-text-muted transition-colors hover:text-text"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Copied' : label}
    </button>
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
