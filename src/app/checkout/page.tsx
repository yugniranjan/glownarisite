'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import { ArrowLeft, CheckCircle2, CreditCard, Loader2, Lock, MapPin, MessageCircle, ShieldCheck, Tag, UserRound, X } from 'lucide-react';
import {
  createRazorpayOrder,
  formatMoney,
  getPaymentConfig,
  getProduct,
  listAddresses,
  previewCoupon,
  verifyRazorpayPayment,
  type GlownariAddress,
  type GlownariProduct,
} from '@/lib/api';
import { trackGlownari } from '@/lib/analytics';
import { AUTH_REQUIRED, cartSubtotal, clearCart, fetchCart, removeFromCart, type CartItem } from '@/lib/cart';
import { getAuthToken, getStoredUser } from '@/lib/auth';
import PageLoader from '@/components/PageLoader';
import ModernSelect from '@/components/ModernSelect';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918506965129';

type Field = 'name' | 'phone' | 'pincode' | 'address' | 'city' | 'state' | 'landmark' | 'quantity';
type Errors = Partial<Record<Field, string>>;

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function normalizeName(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

function normalizePhone(value: string) {
  let digits = value.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  return digits.length === 10 ? `+91${digits}` : value.trim();
}

function formatPhoneDisplay(digits: string) {
  const d = digits.slice(0, 10);
  return d.length > 5 ? `${d.slice(0, 5)} ${d.slice(5)}` : d;
}

function validate(values: {
  name: string;
  phone: string;
  pincode: string;
  address: string;
  city: string;
  state: string;
  landmark: string;
  quantity: number;
}) {
  const normalized = {
    name: normalizeName(values.name),
    phone: normalizePhone(values.phone),
    pincode: values.pincode.replace(/\D/g, '').slice(0, 6),
    address: values.address.trim().replace(/\s+/g, ' '),
    city: values.city.trim().replace(/\s+/g, ' '),
    state: values.state.trim().replace(/\s+/g, ' '),
    landmark: values.landmark.trim().replace(/\s+/g, ' '),
    quantity: Number(values.quantity),
  };
  const errors: Errors = {};
  const phoneDigits = normalized.phone.replace(/\D/g, '').replace(/^91/, '');

  if (normalized.name.length < 2) errors.name = 'Enter your full name.';
  else if (normalized.name.length > 80) errors.name = 'Name can be up to 80 characters.';
  else if (!/^[\p{L}][\p{L}\s.'-]*$/u.test(normalized.name)) errors.name = 'Name can contain letters, spaces, dot, apostrophe, or hyphen.';

  if (!/^[6-9]\d{9}$/.test(phoneDigits)) errors.phone = 'Enter a valid 10-digit Indian mobile number.';
  if (!/^\d{6}$/.test(normalized.pincode)) errors.pincode = 'Enter a valid 6-digit pincode.';
  if (normalized.address.length < 8) errors.address = 'Enter complete house/street address.';
  else if (normalized.address.length > 180) errors.address = 'Address can be up to 180 characters.';
  if (normalized.city.length < 2) errors.city = 'Enter city.';
  else if (normalized.city.length > 60) errors.city = 'City can be up to 60 characters.';
  if (normalized.state.length < 2) errors.state = 'Enter state.';
  else if (normalized.state.length > 60) errors.state = 'State can be up to 60 characters.';
  if (normalized.landmark.length > 80) errors.landmark = 'Landmark can be up to 80 characters.';
  if (!Number.isInteger(normalized.quantity) || normalized.quantity < 1 || normalized.quantity > 5) errors.quantity = 'Choose a quantity between 1 and 5.';

  return { errors, normalized };
}

function loadRazorpayScript() {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function CheckoutInner() {
  const params = useSearchParams();
  const slug = params.get('product');
  const cartMode = params.get('cart') === '1';
  const initialQty = Math.max(1, Math.min(5, Number(params.get('qty')) || 1));
  const [product, setProduct] = useState<GlownariProduct | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [savedAddresses, setSavedAddresses] = useState<GlownariAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState('new');
  const [loading, setLoading] = useState(true);
  const [authRequired, setAuthRequired] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pincode, setPincode] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [landmark, setLandmark] = useState('');
  const [quantity, setQuantity] = useState(initialQty);
  const [botTrap, setBotTrap] = useState('');
  const [checkoutStartedAt, setCheckoutStartedAt] = useState(() => Date.now());
  const [errors, setErrors] = useState<Errors>({});
  const [error, setError] = useState<string | null>(null);
  const [razorpayKeyId, setRazorpayKeyId] = useState<string | null>(null);
  const [couponInput, setCouponInput] = useState('');
  const [coupon, setCoupon] = useState<{ code: string; discountCents: number } | null>(null);
  const [couponMsg, setCouponMsg] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [order, setOrder] = useState<{ orderNumber: string; totalCents: number; currency: string; status: string; paymentId?: string } | null>(null);
  const trackedRef = useRef<string | null>(null);
  const addressOptions = [
    ...savedAddresses.map((item) => ({
      value: item.id,
      label: `${item.label || 'Address'}${item.isDefault ? ' - Default' : ''}`,
      description: `${item.city}, ${item.pincode}`,
    })),
    { value: 'new', label: 'Use a new address', description: 'Add or manage addresses in profile' },
  ];

  useEffect(() => {
    if (!getAuthToken()) {
      setAuthRequired(true);
      setLoading(false);
      return;
    }
    getPaymentConfig().then((cfg) => setRazorpayKeyId(cfg.razorpayKeyId || null)).catch(() => undefined);
    const user = getStoredUser();
    if (user) {
      if (user.name) setName(user.name);
      if (user.whatsappNumber) {
        const digits = user.whatsappNumber.replace(/\D/g, '').replace(/^91/, '').slice(0, 10);
        setPhone(digits);
      }
    }
    listAddresses()
      .then((items) => {
        setSavedAddresses(items);
        const preferred = items.find((item) => item.isDefault) || items[0];
        if (preferred) applySavedAddress(preferred);
      })
      .catch(() => undefined);
  }, []);

  function applySavedAddress(item: GlownariAddress) {
    setSelectedAddressId(item.id);
    setName(item.fullName || getStoredUser()?.name || '');
    const digits = (item.phone || getStoredUser()?.whatsappNumber || '').replace(/\D/g, '').replace(/^91/, '').slice(0, 10);
    if (digits) setPhone(digits);
    setPincode(item.pincode);
    setAddress(item.address);
    setCity(item.city);
    setStateName(item.state);
    setLandmark(item.landmark || '');
  }

  useEffect(() => {
    if (authRequired) return;
    if (!getAuthToken()) return;
    if (cartMode) {
      fetchCart()
        .then((items) => {
          setCartItems(items);
          setCheckoutStartedAt(Date.now());
          if (items[0]) {
            trackGlownari({
              eventType: 'checkout_started',
              productId: items[0].id,
              productSlug: items[0].slug,
              productName: items.length > 1 ? `${items.length} cart items` : items[0].name,
              metadata: { cartItems: items.length, subtotalCents: cartSubtotal(items) },
            });
          }
        })
        .catch((err) => {
          if (err?.name === AUTH_REQUIRED) {
            setError('Login is required to checkout cart items.');
          } else {
            setError(err?.message || 'Could not load cart.');
          }
        })
        .finally(() => setLoading(false));
      return;
    }
    if (!slug) {
      setLoading(false);
      return;
    }
    getProduct(slug)
      .then((item) => {
        setProduct(item);
        setCheckoutStartedAt(Date.now());
        if (item && trackedRef.current !== item.id) {
          trackedRef.current = item.id;
          trackGlownari({
            eventType: 'checkout_started',
            productId: item.id,
            productSlug: item.slug,
            productName: item.name,
            metadata: { priceCents: item.priceCents },
          });
        }
      })
      .finally(() => setLoading(false));
  }, [authRequired, cartMode, slug]);

  useEffect(() => {
    setCoupon(null);
    setCouponMsg('');
  }, [quantity]);

  async function applyCoupon() {
    if (!product && !cartMode) return;
    if (cartMode && cartItems.length === 0) return;
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setCouponMsg('Enter a coupon code');
      return;
    }
    setCouponLoading(true);
    setCouponMsg('');
    try {
      const res = await previewCoupon({
        code,
        productId: cartMode ? undefined : product?.id,
        quantity: cartMode ? undefined : quantity,
        items: cartMode ? cartItems.map((item) => ({ productId: item.id, quantity: item.quantity })) : undefined,
        phone: phone ? `+91${phone}` : undefined,
        email: undefined,
      });
      if (res.valid && res.discountCents) {
        setCoupon({ code: res.code || code, discountCents: res.discountCents });
      } else {
        setCoupon(null);
        setCouponMsg(res.message || 'Coupon could not be applied');
      }
    } finally {
      setCouponLoading(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!product && !cartMode) return;
    if (cartMode && cartItems.length === 0) {
      setError('Your cart is empty.');
      return;
    }
    setError(null);
    const result = validate({ name, phone, pincode, address, city, state: stateName, landmark, quantity });
    setErrors(result.errors);
    const firstError = Object.values(result.errors)[0];
    if (firstError) {
      setError(firstError);
      return;
    }
    if (!razorpayKeyId) {
      setError('Razorpay is not configured yet. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in the API environment.');
      return;
    }

    const ready = await loadRazorpayScript();
    if (!ready || !window.Razorpay) {
      setError('Razorpay checkout could not load. Please check your connection and try again.');
      return;
    }

    const deliveryNote = [
      `Address: ${result.normalized.address}`,
      `City: ${result.normalized.city}`,
      `State: ${result.normalized.state}`,
      `Pincode: ${result.normalized.pincode}`,
      result.normalized.landmark ? `Landmark: ${result.normalized.landmark}` : null,
    ].filter(Boolean).join('\n');

    setSubmitting(true);
    try {
      const user = getStoredUser();
      const created = await createRazorpayOrder({
        customerName: result.normalized.name,
        phone: result.normalized.phone,
        email: user?.email || null,
        productId: cartMode ? undefined : product!.id,
        quantity: cartMode ? undefined : result.normalized.quantity,
        items: cartMode ? cartItems.map((item) => ({ productId: item.id, quantity: item.quantity })) : undefined,
        deliveryAddress: {
          address: result.normalized.address,
          city: result.normalized.city,
          state: result.normalized.state,
          pincode: result.normalized.pincode,
          landmark: result.normalized.landmark || null,
        },
        couponCode: coupon?.code || null,
        notes: deliveryNote,
        checkoutStartedAt,
        botTrap,
      });

      trackGlownari({
        eventType: 'payment_started',
        productId: cartMode ? cartItems[0]?.id : product!.id,
        productSlug: cartMode ? cartItems[0]?.slug : product!.slug,
        productName: cartMode ? `${cartItems.length} cart items` : product!.name,
        metadata: { totalCents: created.totalCents, currency: created.currency, cartItems: cartItems.length || 1 },
      });

      const checkout = new window.Razorpay({
        key: created.payment.keyId,
        amount: created.payment.amount,
        currency: created.payment.currency,
        name: 'Glownari',
        description: cartMode ? `${cartItems.length} cart items` : product!.name,
        order_id: created.payment.orderId,
        prefill: {
          name: result.normalized.name,
          email: user?.email || '',
          contact: result.normalized.phone.replace(/^\+91/, ''),
        },
        notes: { orderNumber: created.orderNumber },
        theme: { color: '#e50914' },
        handler: async (response: any) => {
          try {
            const verified = await verifyRazorpayPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            setOrder({
              orderNumber: verified.orderNumber,
              totalCents: verified.totalCents,
              currency: verified.currency || (cartMode ? cartItems[0]?.currency || 'INR' : product!.currency),
              status: verified.status,
              paymentId: response.razorpay_payment_id,
            });
            if (cartMode) clearCart().catch(() => undefined);
            else removeFromCart(product!.id).catch(() => undefined);
            trackGlownari({
              eventType: 'order_submitted',
              productId: cartMode ? cartItems[0]?.id : product!.id,
              productSlug: cartMode ? cartItems[0]?.slug : product!.slug,
              productName: cartMode ? `${cartItems.length} cart items` : product!.name,
              orderNumber: verified.orderNumber,
              metadata: { totalCents: verified.totalCents, quantity, couponApplied: Boolean(coupon?.code) },
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } catch (err: any) {
            setError(err?.message || 'Payment captured, but verification failed. Contact support with your payment ID.');
          } finally {
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => setSubmitting(false),
        },
      });
      checkout.open();
    } catch (err: any) {
      setError(err?.message || 'Could not start checkout. Please try again.');
      setSubmitting(false);
    }
  }

  if (loading) return <PageLoader label="Loading checkout..." />;

  if (authRequired) {
    const next = `/checkout?${params.toString()}`;
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Login to checkout</h1>
        <p className="mt-3 text-text-muted">
          Checkout is available only after login so cart, address, and order details are saved to your account.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href={`/login?next=${encodeURIComponent(next)}`} className="btn-accent inline-flex">
            Login
          </Link>
          <Link href={`/signup?next=${encodeURIComponent(next)}`} className="btn-ghost inline-flex">
            Create account
          </Link>
        </div>
      </div>
    );
  }

  if ((!cartMode && (!slug || !product)) || (cartMode && cartItems.length === 0)) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">
          {cartMode && error ? 'Login to checkout cart' : cartMode ? 'Your cart is empty' : 'Pick a product first'}
        </h1>
        <p className="mt-3 text-text-muted">
          {error || 'Head back to the store and choose items to start checkout.'}
        </p>
        {cartMode && error ? (
          <Link href={`/login?next=${encodeURIComponent('/cart')}`} className="btn-accent mt-6 inline-flex">Login to cart</Link>
        ) : (
          <Link href="/" className="btn-accent mt-6 inline-flex">Browse products</Link>
        )}
      </div>
    );
  }

  if (order) {
    const orderName = cartMode ? `${cartItems.length} cart items` : product!.name;
    const message = encodeURIComponent(`Hi, I paid for order ${order.orderNumber} (${orderName}). Payment ID: ${order.paymentId || 'paid via Razorpay'}. Please confirm delivery.`);
    return (
      <div className="mx-auto max-w-xl px-3 py-8 sm:px-4 sm:py-14">
        <div className="rounded-xl border border-success-soft bg-bg-elev-2 p-5 text-center sm:p-8">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success-soft text-success">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="mt-5 text-2xl font-bold sm:text-3xl">Payment successful</h1>
          <p className="mt-2 text-sm text-text-muted sm:text-base">
            Your order is confirmed. We will process delivery and share updates on WhatsApp.
          </p>
          <div className="mt-5 rounded-lg border border-border bg-bg-elev-1 p-4 text-left">
            <Row label="Order number" value={<span className="font-mono">{order.orderNumber}</span>} />
            <Row label="Items" value={orderName} />
            <Row label="Total" value={formatMoney(order.totalCents, order.currency)} />
            <Row label="Status" value={order.status} />
            {order.paymentId && <Row label="Payment ID" value={<span className="font-mono">{order.paymentId}</span>} />}
          </div>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`} className="btn-whatsapp mt-5 w-full">
            <MessageCircle className="h-4 w-4" />
            WhatsApp support
          </a>
          <Link href="/track-order" className="btn-ghost mt-2 w-full">Track order</Link>
        </div>
      </div>
    );
  }

  const subtotal = cartMode ? cartSubtotal(cartItems) : product!.priceCents * quantity;
  const discount = coupon?.discountCents ?? 0;
  const total = subtotal - discount;
  const currency = cartMode ? (cartItems[0]?.currency || 'INR') : product!.currency;

  return (
    <div className="mx-auto max-w-page px-3 pb-24 pt-4 sm:px-4 sm:pb-12 sm:pt-6">
      <Link href={cartMode ? '/cart' : `/products/${product!.slug}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text sm:text-sm">
        <ArrowLeft className="h-4 w-4" />
        {cartMode ? 'Back to cart' : 'Back to product'}
      </Link>

      <h1 className="mt-3 text-2xl font-black sm:text-3xl">Complete your order</h1>
      <p className="mt-1 text-sm text-text-muted">
        {cartMode
          ? 'Your cart is loaded from your account. Add delivery address, review your cart, and pay securely with Razorpay.'
          : 'Add delivery address, review your product, and pay securely with Razorpay.'}
      </p>

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_400px]">
        <form onSubmit={submit} noValidate className="space-y-4">
          <div className="hidden" aria-hidden="true">
            <label>Website<input tabIndex={-1} autoComplete="off" value={botTrap} onChange={(e) => setBotTrap(e.target.value)} /></label>
          </div>

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-md border border-danger/40 bg-danger-soft px-3 py-2 text-sm text-danger">
              <X className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <section className="overflow-hidden rounded-2xl border border-border bg-bg-elev-2 shadow-card">
            <div className="border-b border-border bg-bg-elev-1 px-4 py-3 sm:px-5">
            <div className="mb-4 flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent-soft text-accent"><UserRound className="h-4 w-4" /></span>
              <div>
                <h2 className="text-base font-black sm:text-lg">Contact details</h2>
                <p className="text-xs text-text-muted">Used for delivery updates and order support.</p>
              </div>
            </div>
            </div>
            <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
            <Field label="Full name" error={errors.name} required>
              <input className={`input ${errors.name ? 'border-danger' : ''}`} value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" autoComplete="name" />
            </Field>
            <Field label="Phone number" error={errors.phone} required>
              <div className={`flex h-11 overflow-hidden rounded-md border bg-[var(--bg-elev-3)] focus-within:border-[var(--accent)] ${errors.phone ? 'border-danger' : 'border-border'}`}>
                <span className="grid place-items-center border-r border-border px-3 text-sm font-semibold text-text-muted">+91</span>
                <input
                  className="min-w-0 flex-1 bg-transparent px-3 text-sm text-text outline-none placeholder:text-text-dim"
                  value={formatPhoneDisplay(phone)}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="98765 43210"
                  inputMode="numeric"
                  autoComplete="tel"
                />
              </div>
            </Field>
            {!cartMode && (
              <Field label="Quantity" error={errors.quantity} required>
                <ModernSelect
                  value={String(quantity)}
                  onChange={(value) => setQuantity(Number(value))}
                  options={[1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: `${n}`, description: `${n} item${n > 1 ? 's' : ''}` }))}
                />
              </Field>
            )}
            </div>
          </section>

          <section className="overflow-visible rounded-2xl border border-border bg-bg-elev-2 shadow-card">
            <div className="border-b border-border bg-bg-elev-1 px-4 py-3 sm:px-5">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent-soft text-accent"><MapPin className="h-4 w-4" /></span>
              <div>
                <h2 className="text-base font-black sm:text-lg">Delivery address</h2>
                <p className="text-xs text-text-muted">Select a saved address or manage addresses in profile.</p>
              </div>
            </div>
            </div>
            <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
            {savedAddresses.length > 0 && (
              <Field label="Saved address" className="sm:col-span-2">
                <ModernSelect
                  value={selectedAddressId}
                  options={addressOptions}
                  onChange={(value) => {
                    setSelectedAddressId(value);
                    if (value === 'new') {
                      window.location.href = `/profile?next=${encodeURIComponent(`/checkout?${params.toString()}`)}`;
                      return;
                    }
                    const selected = savedAddresses.find((item) => item.id === value);
                    if (selected) applySavedAddress(selected);
                  }}
                />
              </Field>
            )}
            {savedAddresses.length === 0 && (
              <div className="sm:col-span-2 rounded-xl border border-dashed border-border bg-bg-elev-1 p-4">
                <div className="font-bold">No saved address</div>
                <p className="mt-1 text-sm text-text-muted">Add an address in profile before checkout.</p>
                <Link href={`/profile?next=${encodeURIComponent(`/checkout?${params.toString()}`)}`} className="btn-accent mt-3 inline-flex h-10 px-4">
                  Add address
                </Link>
              </div>
            )}
            <Field label="Pincode" error={errors.pincode} required>
              <input className={`input ${errors.pincode ? 'border-danger' : ''}`} value={pincode} onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="6-digit pincode" inputMode="numeric" autoComplete="postal-code" />
            </Field>
            <Field label="City" error={errors.city} required>
              <input className={`input ${errors.city ? 'border-danger' : ''}`} value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" autoComplete="address-level2" />
            </Field>
            <Field label="State" error={errors.state} required>
              <input className={`input ${errors.state ? 'border-danger' : ''}`} value={stateName} onChange={(e) => setStateName(e.target.value)} placeholder="State" autoComplete="address-level1" />
            </Field>
            <Field label="Landmark" error={errors.landmark}>
              <input className={`input ${errors.landmark ? 'border-danger' : ''}`} value={landmark} onChange={(e) => setLandmark(e.target.value)} placeholder="Optional" />
            </Field>
            <Field label="House no., building, area" error={errors.address} required className="sm:col-span-2">
              <textarea className={`input min-h-20 py-3 ${errors.address ? 'border-danger' : ''}`} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House no., street, area, colony" maxLength={180} autoComplete="street-address" />
            </Field>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-border bg-bg-elev-2 shadow-card">
            <div className="border-b border-border bg-bg-elev-1 px-4 py-3 sm:px-5">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent-soft text-accent"><CreditCard className="h-4 w-4" /></span>
              <div>
                <h2 className="text-base font-black">Offers & payment</h2>
                <p className="text-xs text-text-muted">Apply coupon, then pay once for the full cart.</p>
              </div>
            </div>
            </div>
            <div className="p-4 sm:p-5">
            <div className="flex gap-2">
              <input className="input" value={couponInput} onChange={(e) => setCouponInput(e.target.value.toUpperCase())} placeholder="Coupon code" />
              {coupon ? (
                <button type="button" className="btn-ghost h-11 px-4" onClick={() => { setCoupon(null); setCouponInput(''); }}>Remove</button>
              ) : (
                <button type="button" className="btn-ghost h-11 px-4" onClick={applyCoupon} disabled={couponLoading}>
                  {couponLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Tag className="h-4 w-4" />}
                  Apply
                </button>
              )}
            </div>
            {coupon && <p className="mt-2 text-xs font-semibold text-success">Coupon {coupon.code} applied.</p>}
            {couponMsg && <p className="mt-2 text-xs text-danger">{couponMsg}</p>}

          <button type="submit" disabled={submitting} className="btn-accent mt-4 w-full">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
            Pay {formatMoney(total, currency)}
          </button>
          </div>
          </section>
        </form>

        <aside className="h-fit rounded-2xl border border-border bg-bg-elev-2 p-4 shadow-card sm:p-5 lg:sticky lg:top-24">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-black">Order summary</h2>
            <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-bold text-accent">
              {cartMode ? `${cartItems.length} items` : `Qty ${quantity}`}
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {(cartMode ? cartItems : [{
              id: product!.id,
              name: product!.name,
              coverImage: product!.coverImage,
              categoryName: product!.category?.name || 'Product',
              quantity,
              priceCents: product!.priceCents,
              currency: product!.currency,
            }]).map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="h-16 w-14 shrink-0 overflow-hidden rounded-md bg-bg-elev-3">
                  {item.coverImage && <img src={item.coverImage} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="line-clamp-2 text-sm font-semibold">{item.name}</div>
                  <div className="mt-1 text-xs text-text-muted">Qty {item.quantity}</div>
                </div>
                <div className="text-sm font-black">{formatMoney(item.priceCents * item.quantity, item.currency)}</div>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
            <SummaryRow label="Subtotal" value={formatMoney(subtotal, currency)} />
            <SummaryRow label="Discount" value={discount ? `-${formatMoney(discount, currency)}` : formatMoney(0, currency)} />
            <SummaryRow label="Total" value={formatMoney(total, currency)} strong />
          </div>
          <div className="mt-4 rounded-lg border border-success/25 bg-success-soft p-3 text-xs leading-5 text-success">
            <div className="flex items-center gap-2 font-semibold text-text">
              <ShieldCheck className="h-4 w-4 text-success" />
              Secure Razorpay checkout
            </div>
            <p className="mt-1 text-success">Cards, UPI, wallets, and netbanking are handled by Razorpay.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, required, error, className, children }: { label: string; required?: boolean; error?: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={className}>
      <span className="mb-1.5 block text-sm font-semibold">
        {label}{required && <span className="text-accent"> *</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
    </label>
  );
}

function SummaryRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-3 ${strong ? 'text-base font-bold text-text' : 'text-text-muted'}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border py-2 last:border-0">
      <span className="text-sm text-text-muted">{label}</span>
      <span className="text-right text-sm font-semibold">{value}</span>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<PageLoader label="Loading checkout..." />}>
      <CheckoutInner />
    </Suspense>
  );
}
