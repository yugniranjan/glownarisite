export interface GlownariCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  badge: string | null;
  badgeColor: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface GlownariProduct {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  coverImage: string | null;
  images?: string[];
  badge: string | null;
  serviceType: string | null;
  accountType: string | null;
  durationDays: number | null;
  priceCents: number;
  compareAtCents: number | null;
  currency: string;
  stockQuantity: number | null;
  isFeatured: boolean;
  isActive: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  categoryId: string;
  category: GlownariCategory;
}

export interface GlownariBanner {
  id: string;
  eyebrow: string | null;
  title: string;
  subtitle: string | null;
  priceLabel: string | null;
  href: string;
  image: string;
  productId?: string | null;
  product?: Pick<GlownariProduct, 'id' | 'name' | 'slug'> | null;
  brand: string | null;
  theme: 'pink' | 'charcoal' | 'gold' | 'green' | 'blue' | 'purple';
  isActive: boolean;
  sortOrder: number;
}

export interface GlownariTestimonial {
  id: string;
  customerName: string;
  location: string | null;
  quote: string;
  rating: number;
  image: string | null;
  productLabel: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface Paginated<T> {
  error?: string;
  items: T[];
  total: number;
  take: number;
  skip: number;
}

export interface GlownariStats {
  deliveredOrders: number;
  totalOrders: number;
}

export interface GlownariAddress {
  id: string;
  label: string | null;
  fullName: string | null;
  phone: string | null;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GlownariOrderItem {
  productId: string;
  slug?: string;
  name: string;
  coverImage?: string | null;
  quantity: number;
  priceCents: number;
  lineTotalCents: number;
  currency?: string;
}

export interface GlownariCustomerOrder {
  discountCents?: number;
  couponCode?: string | null;
  courierName?: string | null;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
  refundStatus?: string | null;
  refundedCents?: number;
  id: string;
  orderNumber: string;
  customerName: string;
  email: string | null;
  phone: string;
  productId: string;
  quantity: number;
  items?: GlownariOrderItem[] | null;
  totalCents: number;
  currency: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  razorpayPaymentId: string | null;
  deliveryAddress: string | null;
  deliveryCity: string | null;
  deliveryState: string | null;
  deliveryPincode: string | null;
  deliveryLandmark: string | null;
  statusReason: string | null;
  deliveredAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  product?: GlownariProduct;
}

export type GlownariAddressInput = {
  label?: string | null;
  fullName?: string | null;
  phone?: string | null;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string | null;
  isDefault?: boolean;
};

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';


function apiBaseUrl() {
  if (typeof window !== 'undefined' || !API_URL.startsWith('/')) return API_URL;
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (host ? `https://${host}` : 'http://localhost:3000');
  return new URL(API_URL, siteUrl).toString().replace(/\/$/, '');
}

async function fetchJson<T>(path: string, fresh = false): Promise<T> {
  const res = await fetch(`${apiBaseUrl()}${path}`, fresh ? { cache: 'no-store' } : { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export async function getCategories() {
  try {
    const categories = await fetchJson<GlownariCategory[]>('/glownari/categories');
    return categories;
  } catch {
    return [];
  }
}

export async function getProducts(params?: { categorySlug?: string; featured?: boolean; take?: number; skip?: number; q?: string; sort?: string }) {
  const q = new URLSearchParams();
  if (params?.categorySlug) q.set('categorySlug', params.categorySlug);
  if (params?.featured) q.set('featured', 'true');
  if (params?.take) q.set('take', String(params.take));
  if (params?.skip) q.set('skip', String(params.skip));
  if (params?.q) q.set('q', params.q);
  if (params?.sort === 'price-asc') q.set('sort', params.sort);

  try {
    const data = await fetchJson<Paginated<GlownariProduct>>(`/glownari/products${q.toString() ? `?${q}` : ''}`, true);
    return data;
  } catch {
    return { items: [], total: 0, take: params?.take || 20, skip: params?.skip || 0, error: 'Products could not load. Please try again shortly.' };
  }
}

export async function getProduct(slug: string) {
  try {
    return await fetchJson<GlownariProduct>(`/glownari/products/${slug}`, true);
  } catch {
    return null;
  }
}

export async function getBanners() {
  try {
    return await fetchJson<GlownariBanner[]>('/glownari/banners');
  } catch {
    return [];
  }
}

export async function getTestimonials() {
  try {
    return await fetchJson<GlownariTestimonial[]>('/glownari/testimonials');
  } catch {
    return [];
  }
}

export async function getStats(): Promise<GlownariStats> {
  try {
    return await fetchJson<GlownariStats>('/glownari/stats');
  } catch {
    return { deliveredOrders: 0, totalOrders: 0 };
  }
}

/** Admin-controlled storefront social proof, already computed by the API. */
export interface SocialProof {
  rating: number;
  reviews: number;
  orders: number;
  activationLabel: string;
}

const SOCIAL_PROOF_FALLBACK: SocialProof = {
  rating: 0,
  reviews: 0,
  orders: 0,
  activationLabel: '',
};

export async function getSocialProof(): Promise<SocialProof> {
  try {
    return await fetchJson<SocialProof>('/glownari/social-proof');
  } catch {
    return SOCIAL_PROOF_FALLBACK;
  }
}

/** Compact count: 500 → "500", 1.2k, 8.2k, 12k. */
export function compactCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return n.toLocaleString('en-IN');
}

/** Thousands-separated with a trailing "+". 1000 → "1,000+". */
export function plusCount(n: number) {
  return `${n.toLocaleString('en-IN')}+`;
}

type PaymentConfig = {
  mode: 'razorpay' | 'unavailable';
  onlineGatewayEnabled: boolean;
  razorpayKeyId?: string | null;
};

export async function getPaymentConfig(): Promise<PaymentConfig> {
  try {
    return await fetchJson<PaymentConfig>('/glownari/payment-config');
  } catch {
    return { mode: 'unavailable', onlineGatewayEnabled: false, razorpayKeyId: null };
  }
}

export type PromoConfig = {
  bannerEnabled: boolean;
  bannerText: string | null;
  festivalEnabled?: boolean;
  heroSaleLabel?: string | null;
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  heroCouponCode?: string | null;
  heroEndsInLabel?: string | null;
  heroBackgroundImage?: string | null;
  saleSectionEyebrow?: string | null;
  saleSectionTitle?: string | null;
  saleSectionSubtitle?: string | null;
};

export async function getPromo(): Promise<PromoConfig> {
  try {
    const res = await fetch(`${apiBaseUrl()}/glownari/promo`, { cache: 'no-store' });
    if (!res.ok) throw new Error('promo failed');
    return await res.json();
  } catch {
    return { bannerEnabled: false, bannerText: null, festivalEnabled: false, heroSaleLabel: null, heroBackgroundImage: null };
  }
}

export type CouponPreview = {
  valid: boolean;
  code?: string;
  discountCents?: number;
  subtotalCents?: number;
  finalCents?: number;
  message?: string;
};

export async function previewCoupon(body: {
  code: string;
  productId?: string;
  quantity?: number;
  items?: Array<{ productId: string; quantity: number }>;
  phone?: string;
  email?: string;
}): Promise<CouponPreview> {
  try {
    const { getAuthToken } = await import('@/lib/auth');
    const res = await fetch(`${API_URL}/glownari/coupon/preview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAuthToken()}` },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) return { valid: false, message: data?.error || 'Coupon could not be applied' };
    return data;
  } catch {
    return { valid: false, message: 'Network error — try again' };
  }
}

export async function createRazorpayOrder(body: {
  checkoutKey: string;
  customerName: string;
  phone: string;
  email?: string | null;
  productId?: string;
  quantity?: number;
  items?: Array<{ productId: string; quantity: number }>;
  deliveryAddress: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string | null;
  };
  couponCode?: string | null;
  notes?: string | null;
  checkoutStartedAt: number;
  botTrap?: string | null;
}) {
  const { getAuthToken } = await import('@/lib/auth');
  const token = getAuthToken();
  if (!token) throw new Error('Login required');
  const res = await fetch(`${API_URL}/glownari/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Order failed');
  return data as {
    id: string;
    orderNumber: string;
    totalCents: number;
    currency: string;
    status: string;
    customerName: string;
    email?: string | null;
    phone: string;
    deliveryAddress?: string | null;
    deliveryCity?: string | null;
    deliveryState?: string | null;
    deliveryPincode?: string | null;
    deliveryLandmark?: string | null;
    items?: Array<{ productId: string; name: string; quantity: number; priceCents: number; lineTotalCents: number }>;
    payment: {
      provider: 'razorpay';
      keyId: string;
      orderId: string;
      amount: number;
      currency: string;
    };
  };
}

export async function verifyRazorpayPayment(body: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  const { getAuthToken } = await import('@/lib/auth');
  const token = getAuthToken();
  if (!token) throw new Error('Login required');
  const res = await fetch(`${API_URL}/glownari/orders/verify-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Payment verification failed');
  return data;
}

export async function cancelCheckout(id: string) {
  const { getAuthToken } = await import('@/lib/auth');
  const res = await fetch(`${API_URL}/glownari/orders/${encodeURIComponent(id)}/cancel`, {
    method: 'POST', headers: { Authorization: `Bearer ${getAuthToken()}` },
  });
  if (!res.ok) throw new Error('Could not close checkout. Check your orders before retrying.');
}

async function addressFetch<T>(path = '', init?: RequestInit): Promise<T> {
  const { getAuthToken } = await import('@/lib/auth');
  const token = getAuthToken();
  if (!token) {
    const error = new Error('Login required');
    error.name = 'AUTH_REQUIRED';
    throw error;
  }
  const res = await fetch(`${API_URL}/glownari/addresses${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(init?.headers || {}),
    },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || 'Address request failed');
  return data as T;
}

export function listAddresses() {
  return addressFetch<GlownariAddress[]>();
}

export function createAddress(body: GlownariAddressInput) {
  return addressFetch<GlownariAddress>('', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function updateAddress(id: string, body: GlownariAddressInput) {
  return addressFetch<GlownariAddress>(`/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export function deleteAddress(id: string) {
  return addressFetch<GlownariAddress[]>(`/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export async function listMyOrders() {
  const { getAuthToken } = await import('@/lib/auth');
  const token = getAuthToken();
  if (!token) {
    const error = new Error('Login required');
    error.name = 'AUTH_REQUIRED';
    throw error;
  }
  const res = await fetch(`${API_URL}/glownari/orders/mine`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || 'Could not load orders');
  return data as GlownariCustomerOrder[];
}

export function formatMoney(cents: number, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
