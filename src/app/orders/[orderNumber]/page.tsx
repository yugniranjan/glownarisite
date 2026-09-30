'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, Printer } from 'lucide-react';
import { formatMoney, listMyOrders, type GlownariCustomerOrder } from '@/lib/api';

export default function OrderReceipt() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<GlownariCustomerOrder | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    listMyOrders().then((orders) => {
      if (!active) return;
      const found = orders.find((item) => item.orderNumber === orderNumber);
      if (found) setOrder(found); else setError('Order not found in your account.');
    }).catch((error) => { if (active) setError(error.message); });
    return () => { active = false; };
  }, [orderNumber]);
  return <div className="site-container py-8">
    <style>{'@media print { header, footer, body > a, [data-floating-chat] { display: none !important; } }'}</style>
    <div className="mb-6 flex justify-between print:hidden"><Link className="btn-ghost" href="/orders"><ArrowLeft className="h-4 w-4" />My orders</Link><button disabled={!order} onClick={() => window.print()} className="btn-ghost"><Printer className="h-4 w-4" />Print receipt</button></div>
    {error ? <p role="alert" className="text-danger">{error}</p> : !order ? <p role="status">Loading order...</p> : <article className="mx-auto max-w-3xl border-y border-border py-8">
      <img src="/glownari-wordmark.png" alt="Glownari" className="mb-8 w-[200px]" />
      <h1 className="font-display text-2xl">Order receipt #{order.orderNumber}</h1><p className="mt-2 text-sm text-text-muted">{new Date(order.createdAt).toLocaleDateString('en-IN')} | {order.paymentStatus}</p>
      <div className="my-6 text-sm leading-6"><p>{order.customerName}</p><p>{order.deliveryAddress}</p><p>{[order.deliveryCity, order.deliveryState, order.deliveryPincode].filter(Boolean).join(', ')}</p></div>
      <table className="w-full text-left text-sm"><thead><tr className="border-b border-border"><th className="py-3">Item</th><th>Qty</th><th className="text-right">Amount</th></tr></thead><tbody>{(order.items || []).map((item) => <tr className="border-b border-border" key={item.productId}><td className="py-4">{item.name}</td><td>{item.quantity}</td><td className="text-right">{formatMoney(item.lineTotalCents, order.currency)}</td></tr>)}</tbody></table>
      <div className="ml-auto mt-5 max-w-xs space-y-3 text-sm">{Boolean(order.discountCents) && <div className="flex justify-between"><span>Discount {order.couponCode}</span><span>-{formatMoney(order.discountCents!, order.currency)}</span></div>}<div className="flex justify-between"><span>Delivery</span><span>Free</span></div><div className="flex justify-between font-bold"><span>Total</span><span>{formatMoney(order.totalCents, order.currency)}</span></div></div>
      {order.razorpayPaymentId && <p className="mt-6 break-all text-xs text-text-muted">Razorpay payment: {order.razorpayPaymentId}</p>}
    </article>}
  </div>;
}
