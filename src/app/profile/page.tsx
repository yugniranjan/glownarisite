'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Edit3, Loader2, LogOut, MapPin, Package, Plus, ShoppingCart, Trash2, UserRound } from 'lucide-react';
import {
  createAddress,
  deleteAddress,
  formatMoney,
  listAddresses,
  updateAddress,
  type GlownariAddress,
  type GlownariAddressInput,
} from '@/lib/api';
import { fetchMe, getAuthToken, getStoredUser, logout, type StoreUser } from '@/lib/auth';
import { AUTH_REQUIRED, cartCount, cartSubtotal, fetchCart, type CartItem } from '@/lib/cart';

const EMPTY_ADDRESS: GlownariAddressInput = {
  label: '',
  fullName: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  landmark: '',
  isDefault: false,
};

function numericAccountId(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) % 9000000;
  }
  return String(1000000 + hash).padStart(7, '0');
}

export default function ProfilePage() {
  const [user, setUser] = useState<StoreUser | null>(null);
  const [addresses, setAddresses] = useState<GlownariAddress[]>([]);
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<GlownariAddressInput>(EMPTY_ADDRESS);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [error, setError] = useState('');

  function refreshAddresses() {
    return listAddresses().then(setAddresses);
  }

  useEffect(() => {
    if (!getAuthToken()) {
      setNeedsLogin(true);
      setLoading(false);
      return;
    }

    setUser(getStoredUser());
    Promise.all([
      fetchMe().then(setUser).catch(() => null),
      fetchCart()
        .then(setItems)
        .catch((err) => {
          if (err?.name === AUTH_REQUIRED) setNeedsLogin(true);
          return [];
        }),
      refreshAddresses().catch((err) => setError(err?.message || 'Could not load addresses')),
    ]).finally(() => setLoading(false));
  }, []);

  const totalItems = useMemo(() => cartCount(items), [items]);
  const subtotal = useMemo(() => cartSubtotal(items), [items]);
  const currency = items[0]?.currency || 'INR';

  function startAdd() {
    setEditingId('new');
    setForm({ ...EMPTY_ADDRESS, fullName: user?.name || '', phone: user?.whatsappNumber || '', isDefault: addresses.length === 0 });
    setError('');
  }

  function startEdit(address: GlownariAddress) {
    setEditingId(address.id);
    setForm({
      label: address.label || '',
      fullName: address.fullName || user?.name || '',
      phone: address.phone || user?.whatsappNumber || '',
      address: address.address,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      landmark: address.landmark || '',
      isDefault: address.isDefault,
    });
    setError('');
  }

  function setField<K extends keyof GlownariAddressInput>(key: K, value: GlownariAddressInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submitAddress(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        pincode: String(form.pincode || '').replace(/\D/g, '').slice(0, 6),
        phone: form.phone || null,
        landmark: form.landmark || null,
        label: form.label || null,
        fullName: form.fullName || null,
      };
      if (editingId && editingId !== 'new') await updateAddress(editingId, payload);
      else await createAddress(payload);
      await refreshAddresses();
      setEditingId(null);
      setForm(EMPTY_ADDRESS);
    } catch (err: any) {
      setError(err?.message || 'Could not save address');
    } finally {
      setSaving(false);
    }
  }

  async function removeAddress(id: string) {
    if (!window.confirm('Delete this address?')) return;
    setSaving(true);
    setError('');
    try {
      setAddresses(await deleteAddress(id));
      if (editingId === id) {
        setEditingId(null);
        setForm(EMPTY_ADDRESS);
      }
    } catch (err: any) {
      setError(err?.message || 'Could not delete address');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto grid min-h-[320px] max-w-page place-items-center px-3 py-10 sm:px-4">
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-text-muted">
          <Loader2 className="h-4 w-4 animate-spin text-accent" />
          Loading profile...
        </div>
      </div>
    );
  }

  if (needsLogin || !user) {
    return (
      <div className="mx-auto max-w-page px-3 py-10 sm:px-4 sm:py-16">
        <div className="rounded-lg border border-border bg-bg-elev-2 px-4 py-14 text-center shadow-card">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-marketplace-chip text-accent">
            <UserRound className="h-8 w-8" />
          </div>
          <h1 className="mt-5 text-2xl font-black">Login to view profile</h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-muted">
            Your profile keeps account details, saved addresses, cart, and order shortcuts together.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/login?next=%2Fprofile" className="btn-accent inline-flex">Login</Link>
            <Link href="/signup?next=%2Fprofile" className="btn-ghost inline-flex">Create account</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-page px-3 py-6 sm:px-4 sm:py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">Account</p>
          <h1 className="mt-1 text-2xl font-black sm:text-3xl">My profile</h1>
        </div>
        <button type="button" onClick={logout} className="btn-ghost h-10 px-4">
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>

      {error && <div className="mb-4 rounded-md border border-danger/40 bg-danger-soft px-3 py-2 text-sm text-danger">{error}</div>}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="space-y-5">
          <div className="rounded-lg border border-border bg-bg-elev-2 p-4 shadow-card sm:p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-accent-soft text-accent">
                <UserRound className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-lg font-black">{user.name || 'Customer'}</h2>
                <p className="truncate text-sm text-text-muted">{user.email}</p>
              </div>
            </div>
            <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
              <Info label="Name" value={user.name || 'Not added'} />
              <Info label="WhatsApp" value={user.whatsappNumber || 'Not added'} />
              <Info label="Email" value={user.email} />
              <Info label="Account ID" value={numericAccountId(user.id)} mono />
            </dl>
          </div>

          <div className="rounded-lg border border-border bg-bg-elev-2 p-4 shadow-card sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-accent" />
                <h2 className="text-lg font-black">Delivery addresses</h2>
              </div>
              <button type="button" onClick={startAdd} className="btn-ghost h-9 px-3 text-xs">
                <Plus className="h-4 w-4" />
                Add address
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {addresses.length === 0 ? (
                <p className="text-sm text-text-muted">No saved addresses yet.</p>
              ) : (
                addresses.map((item) => (
                  <div key={item.id} className="rounded-md border border-border bg-bg-elev-1 p-3 text-sm leading-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="font-black">
                          {item.label || 'Address'} {item.isDefault && <span className="text-xs text-success">Default</span>}
                        </div>
                        <div className="font-semibold">{item.fullName || user.name || 'Customer'} {item.phone ? `- ${item.phone}` : ''}</div>
                        <div>{item.address}</div>
                        <div className="text-text-muted">{[item.city, item.state, item.pincode].filter(Boolean).join(', ')}</div>
                        {item.landmark && <div className="text-text-muted">Landmark: {item.landmark}</div>}
                      </div>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => startEdit(item)} className="grid h-9 w-9 place-items-center rounded-md border border-border text-text-muted hover:text-accent" aria-label="Edit address">
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => removeAddress(item.id)} className="grid h-9 w-9 place-items-center rounded-md border border-border text-text-muted hover:text-danger" aria-label="Delete address">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {(editingId !== null || addresses.length === 0) && (
              <form onSubmit={submitAddress} className="mt-5 grid gap-3 rounded-lg border border-border bg-bg-elev-1 p-3 sm:grid-cols-2">
                <input className="input" value={form.label || ''} onChange={(e) => setField('label', e.target.value)} placeholder="Label, e.g. Home" />
                <input className="input" value={form.fullName || ''} onChange={(e) => setField('fullName', e.target.value)} placeholder="Full name" />
                <input className="input" value={(form.phone || '').replace(/^\+91/, '')} onChange={(e) => setField('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="Phone" inputMode="numeric" />
                <input className="input" value={form.pincode || ''} onChange={(e) => setField('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="Pincode" inputMode="numeric" required />
                <input className="input" value={form.city || ''} onChange={(e) => setField('city', e.target.value)} placeholder="City" required />
                <input className="input" value={form.state || ''} onChange={(e) => setField('state', e.target.value)} placeholder="State" required />
                <input className="input sm:col-span-2" value={form.landmark || ''} onChange={(e) => setField('landmark', e.target.value)} placeholder="Landmark optional" />
                <textarea className="input min-h-20 py-3 sm:col-span-2" value={form.address || ''} onChange={(e) => setField('address', e.target.value)} placeholder="House no., street, area" required />
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <input type="checkbox" checked={Boolean(form.isDefault)} onChange={(e) => setField('isDefault', e.target.checked)} />
                  Make default
                </label>
                <div className="flex justify-end gap-2 sm:col-span-2">
                  <button type="button" onClick={() => { setEditingId(null); setForm(EMPTY_ADDRESS); }} className="btn-ghost h-10 px-4">Cancel</button>
                  <button type="submit" disabled={saving} className="btn-accent h-10 px-4">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Save address
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        <aside className="space-y-5">
          <div className="rounded-lg border border-border bg-bg-elev-2 p-4 shadow-card sm:p-5">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-accent" />
              <h2 className="text-lg font-black">Cart summary</h2>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <Summary label="Items" value={String(totalItems)} />
              <Summary label="Subtotal" value={formatMoney(subtotal, currency)} />
            </div>
            <Link href="/cart" className="btn-accent mt-5 w-full">Open cart</Link>
          </div>

          <div className="rounded-lg border border-border bg-bg-elev-2 p-4 shadow-card sm:p-5">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-accent" />
              <h2 className="text-lg font-black">Orders</h2>
            </div>
            <p className="mt-2 text-sm leading-6 text-text-muted">
              Apne account se placed orders, payment status, aur delivery details dekh sakte ho.
            </p>
            <Link href="/orders" className="btn-ghost mt-5 w-full">View orders</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Info({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wider text-text-dim">{label}</dt>
      <dd className={`mt-1 break-words font-semibold ${mono ? 'font-mono text-xs' : ''}`}>{value}</dd>
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border pb-2 last:border-0 last:pb-0">
      <span className="text-text-muted">{label}</span>
      <span className="font-black">{value}</span>
    </div>
  );
}
