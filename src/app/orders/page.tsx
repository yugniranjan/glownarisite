'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Clock, Loader2, MapPin, Package, ReceiptText, Search, XCircle } from 'lucide-react';
import { formatMoney, listMyOrders, type GlownariCustomerOrder } from '@/lib/api';
import { getAuthToken } from '@/lib/auth';
import AccountGate from '@/components/AccountGate';

const STATUS_META: Record<string, { label: string; className: string; icon: typeof Clock }> = {
  PENDING: { label: 'Pending', className: 'bg-danger-soft text-danger', icon: Clock },
  CONFIRMED: { label: 'Confirmed', className: 'bg-info-soft text-info', icon: CheckCircle2 },
  PROCESSING: { label: 'Processing', className: 'bg-info-soft text-info', icon: Package },
  DELIVERED: { label: 'Delivered', className: 'bg-success-soft text-success', icon: CheckCircle2 },
  CANCELLED: { label: 'Cancelled', className: 'bg-danger-soft text-danger', icon: XCircle },
  REFUNDED: { label: 'Refunded', className: 'bg-bg-elev-3 text-text-muted', icon: XCircle },
  BANNED: { label: 'Banned', className: 'bg-danger-soft text-danger', icon: XCircle },
};

const DEMO_ORDERS: GlownariCustomerOrder[] = [
  {
    id: 'demo-order-1',
    orderNumber: '2500001',
    customerName: 'Demo Customer',
    email: 'demo@glownari.local',
    phone: '+919876543210',
    productId: 'everyday-tote',
    quantity: 1,
    items: [{
      productId: 'everyday-tote',
      name: 'Everyday Tote Bag',
      coverImage: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&auto=format&fit=crop',
      quantity: 1,
      priceCents: 59900,
      lineTotalCents: 59900,
      currency: 'INR',
    }],
    totalCents: 59900,
    currency: 'INR',
    status: 'PROCESSING',
    paymentStatus: 'PAID',
    paymentMethod: 'RAZORPAY',
    razorpayPaymentId: 'pay_demo_1001',
    deliveryAddress: '221, Market Road, Near Metro Gate',
    deliveryCity: 'Delhi',
    deliveryState: 'Delhi',
    deliveryPincode: '110098',
    deliveryLandmark: 'Blue building',
    statusReason: 'Demo order for preview',
    deliveredAt: null,
    expiresAt: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'demo-order-2',
    orderNumber: '2500002',
    customerName: 'Demo Customer',
    email: 'demo@glownari.local',
    phone: '+919876543210',
    productId: 'beauty-kit',
    quantity: 2,
    items: [{
      productId: 'beauty-kit',
      name: 'Beauty Essentials Kit',
      coverImage: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&auto=format&fit=crop',
      quantity: 2,
      priceCents: 79900,
      lineTotalCents: 159800,
      currency: 'INR',
    }],
    totalCents: 159800,
    currency: 'INR',
    status: 'DELIVERED',
    paymentStatus: 'PAID',
    paymentMethod: 'RAZORPAY',
    razorpayPaymentId: 'pay_demo_1002',
    deliveryAddress: 'Flat 204, Sunrise Apartments',
    deliveryCity: 'Jaipur',
    deliveryState: 'Rajasthan',
    deliveryPincode: '302001',
    deliveryLandmark: null,
    statusReason: null,
    deliveredAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    expiresAt: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<GlownariCustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getAuthToken()) {
      setNeedsLogin(true);
      setLoading(false);
      return;
    }
    listMyOrders()
      .then(setOrders)
      .catch((err) => {
        if (err?.name === 'AUTH_REQUIRED') setNeedsLogin(true);
        else setError(err?.message || 'Could not load orders');
      })
      .finally(() => setLoading(false));
  }, []);

  const totalSpend = useMemo(
    () => (orders.length ? orders : DEMO_ORDERS).filter((order) => order.paymentStatus === 'PAID').reduce((sum, order) => sum + order.totalCents, 0),
    [orders],
  );
  const displayOrders = orders.length ? orders : DEMO_ORDERS;
  const usingDemo = orders.length === 0;
  const currency = displayOrders[0]?.currency || 'INR';

  if (loading) {
    return (
      <div className="site-container grid min-h-[320px] place-items-center py-10">
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-text-muted">
          <Loader2 className="h-4 w-4 animate-spin text-accent" />
          Loading orders...
        </div>
      </div>
    );
  }

  if (needsLogin) {
    return (
      <AccountGate
        icon={ReceiptText}
        eyebrow="Your purchases"
        title="Every order, easy to find"
        description="Sign in to see payment status, delivery details and tracking for everything you have ordered."
        benefits={['See every item in an order', 'Check payment and delivery status', 'Open tracking in one tap']}
        loginHref="/login?next=%2Forders"
        signupHref="/signup?next=%2Forders"
      />
    );
  }

  return (
    <div className="site-container page-content">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">Purchases</p>
          <h1 className="mt-1 text-2xl font-black sm:text-3xl">My orders</h1>
          <p className="mt-1 text-sm text-text-muted">Track current deliveries and revisit past purchases.</p>
        </div>
        <div className="border-l-2 border-accent px-4 py-1 text-right">
          <div className="text-xs font-semibold text-text-muted">Paid total</div>
          <div className="text-lg font-black">{formatMoney(totalSpend, currency)}</div>
        </div>
      </div>

      {error && <div className="mb-4 rounded-md border border-danger/40 bg-danger-soft px-3 py-2 text-sm text-danger">{error}</div>}

      {usingDemo && (
        <div className="mb-4 rounded-lg border border-info/30 bg-info-soft px-4 py-3 text-sm font-semibold text-info">
          Demo orders shown. Real orders placed from this account will appear here after payment.
        </div>
      )}

      {displayOrders.length > 0 && (
        <div className="space-y-4">
          {displayOrders.map((order) => {
            const meta = STATUS_META[order.status] || STATUS_META.PENDING;
            const StatusIcon = meta.icon;
            const items = Array.isArray(order.items) && order.items.length > 0
              ? order.items
              : [{
                  productId: order.productId,
                  name: order.product?.name || 'Product',
                  coverImage: order.product?.coverImage,
                  quantity: order.quantity,
                  priceCents: order.totalCents,
                  lineTotalCents: order.totalCents,
                  currency: order.currency,
                }];
            return (
              <article key={order.id} className="overflow-hidden rounded-lg border border-border bg-bg-elev-2 shadow-card">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border bg-bg-elev-1 px-4 py-4 sm:px-5">
                  <div>
                    <div className="font-mono text-xs text-text-muted">{order.orderNumber}</div>
                    <h2 className="mt-1 text-lg font-black">{items.length > 1 ? `${items.length} items` : items[0]?.name}</h2>
                    <div className="mt-1 text-xs text-text-muted">{formatDate(order.createdAt)}</div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black ${meta.className}`}>
                    <StatusIcon className="h-3.5 w-3.5" />
                    {meta.label}
                  </span>
                </div>

                <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_280px]">
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.productId} className="flex gap-3 rounded-lg border border-border bg-bg-elev-1 p-3">
                        <div className="h-16 w-14 shrink-0 overflow-hidden rounded-md bg-bg-elev-3">
                          {item.coverImage && <img src={item.coverImage} alt="" className="h-full w-full object-cover" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="line-clamp-2 text-sm font-black">{item.name}</div>
                          <div className="mt-1 text-xs text-text-muted">Qty {item.quantity}</div>
                        </div>
                        <div className="text-sm font-black">{formatMoney(item.lineTotalCents, item.currency || order.currency)}</div>
                      </div>
                    ))}

                    {order.deliveryAddress && (
                      <div className="rounded-lg border border-border bg-bg-elev-1 p-3 text-sm">
                        <div className="mb-1 flex items-center gap-2 font-black">
                          <MapPin className="h-4 w-4 text-accent" />
                          Delivery address
                        </div>
                        <div>{order.deliveryAddress}</div>
                        <div className="text-text-muted">{[order.deliveryCity, order.deliveryState, order.deliveryPincode].filter(Boolean).join(', ')}</div>
                        {order.deliveryLandmark && <div className="text-text-muted">Landmark: {order.deliveryLandmark}</div>}
                      </div>
                    )}
                  </div>

                  <aside className="h-fit rounded-lg border border-border bg-bg-elev-1 p-4">
                    <div className="space-y-2 text-sm">
                      <Summary label="Payment" value={order.paymentStatus} />
                      <Summary label="Method" value={order.paymentMethod} />
                      <Summary label="Total" value={formatMoney(order.totalCents, order.currency)} strong />
                    </div>
                    {order.statusReason && (
                      <p className="mt-3 rounded-md bg-bg-elev-3 p-2 text-xs text-text-muted">{order.statusReason}</p>
                    )}
                    <Link
                      href={`/track-order?order=${encodeURIComponent(order.orderNumber)}`}
                      className="btn-ghost mt-4 w-full"
                    >
                      <Search className="h-4 w-4" />
                      Track order
                    </Link>
                  </aside>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Summary({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-4 ${strong ? 'border-t border-border pt-2 text-base font-black' : 'text-text-muted'}`}>
      <span>{label}</span>
      <span className={strong ? 'text-text' : 'font-semibold text-text'}>{value}</span>
    </div>
  );
}
