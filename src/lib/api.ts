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

const demoCategories: GlownariCategory[] = [
  { id: 'earrings', name: 'Earrings', slug: 'earrings', description: 'Elegant earrings for daily wear and celebrations', image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&auto=format&fit=crop&q=85', badge: 'Popular', badgeColor: 'pink', isActive: true, sortOrder: 1 },
  { id: 'rings', name: 'Rings', slug: 'rings', description: 'Sparkling rings for gifting and self-love', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=85', badge: 'Sale', badgeColor: 'red', isActive: true, sortOrder: 2 },
];

export const demoProducts: GlownariProduct[] = [
  {
    id: 'rose-gold-drop-earrings',
    name: 'Rose Gold Drop Earrings',
    slug: 'rose-gold-drop-earrings',
    shortDescription: 'A soft rose gold drop pair with a delicate sparkle.',
    description: 'Elegant drop earrings made for celebrations, gifting and everyday polish.',
    coverImage: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=1400&auto=format&fit=crop&q=85',
    badge: 'Best seller',
    serviceType: 'Earrings',
    accountType: 'In stock',
    durationDays: null,
    priceCents: 49900,
    compareAtCents: 99900,
    currency: 'INR',
    stockQuantity: 18,
    isFeatured: true,
    isActive: true,
    metaTitle: null,
    metaDescription: null,
    categoryId: 'earrings',
    category: demoCategories[0],
  },
  {
    id: 'silver-jhumka-earrings',
    name: 'Silver Jhumka Earrings',
    slug: 'silver-jhumka-earrings',
    shortDescription: 'Statement silver jhumkas with a festive finish.',
    description: 'Oxidised-style jhumka earrings with pearl details and occasion-ready shine.',
    coverImage: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1400&auto=format&fit=crop&q=85',
    badge: 'Popular',
    serviceType: 'Earrings',
    accountType: 'Ready to ship',
    durationDays: null,
    priceCents: 59900,
    compareAtCents: 119900,
    currency: 'INR',
    stockQuantity: 24,
    isFeatured: true,
    isActive: true,
    metaTitle: null,
    metaDescription: null,
    categoryId: 'earrings',
    category: demoCategories[0],
  },
  {
    id: 'gold-hoop-earrings',
    name: 'Gold Hoop Earrings',
    slug: 'gold-hoop-earrings',
    shortDescription: 'Slim gold hoops lined with crystal accents.',
    description: 'Lightweight hoops with clean gold plating and soft sparkle.',
    coverImage: 'https://images.unsplash.com/photo-1615655114865-4cc92168b8aa?w=1400&auto=format&fit=crop&q=85',
    badge: 'New',
    serviceType: 'Earrings',
    accountType: 'In stock',
    durationDays: null,
    priceCents: 39900,
    compareAtCents: 79900,
    currency: 'INR',
    stockQuantity: 30,
    isFeatured: true,
    isActive: true,
    metaTitle: null,
    metaDescription: null,
    categoryId: 'earrings',
    category: demoCategories[0],
  },
  {
    id: 'pearl-drop-earrings',
    name: 'Pearl Drop Earrings',
    slug: 'pearl-drop-earrings',
    shortDescription: 'Pearl drops with a graceful floral gold stem.',
    description: 'A refined pearl pair designed for gifting, workwear, and evening styling.',
    coverImage: 'https://images.unsplash.com/photo-1611107683227-e9060eccd846?w=1400&auto=format&fit=crop&q=85',
    badge: 'Gift pick',
    serviceType: 'Earrings',
    accountType: 'Ready to ship',
    durationDays: null,
    priceCents: 44900,
    compareAtCents: 89900,
    currency: 'INR',
    stockQuantity: 15,
    isFeatured: true,
    isActive: true,
    metaTitle: null,
    metaDescription: null,
    categoryId: 'earrings',
    category: demoCategories[0],
  },
  {
    id: 'classic-solitaire-ring',
    name: 'Classic Solitaire Ring',
    slug: 'classic-solitaire-ring',
    shortDescription: 'A timeless solitaire ring with a bright centre stone.',
    description: 'Classic solitaire styling with a rose gold finish and gift-ready sparkle.',
    coverImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1400&auto=format&fit=crop&q=85',
    badge: 'Sale',
    serviceType: 'Rings',
    accountType: 'In stock',
    durationDays: null,
    priceCents: 69900,
    compareAtCents: 139900,
    currency: 'INR',
    stockQuantity: 32,
    isFeatured: true,
    isActive: true,
    metaTitle: null,
    metaDescription: null,
    categoryId: 'rings',
    category: demoCategories[1],
  },
  {
    id: 'twist-gold-ring',
    name: 'Twist Gold Ring',
    slug: 'twist-gold-ring',
    shortDescription: 'A polished twist band with subtle stone detail.',
    description: 'Modern gold ring with a comfortable band and elegant crossover setting.',
    coverImage: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1400&auto=format&fit=crop&q=85',
    badge: 'Trending',
    serviceType: 'Rings',
    accountType: 'In stock',
    durationDays: null,
    priceCents: 54900,
    compareAtCents: 109900,
    currency: 'INR',
    stockQuantity: 22,
    isFeatured: true,
    isActive: true,
    metaTitle: null,
    metaDescription: null,
    categoryId: 'rings',
    category: demoCategories[1],
  },
  {
    id: 'heart-solitaire-ring',
    name: 'Heart Solitaire Ring',
    slug: 'heart-solitaire-ring',
    shortDescription: 'A heart-shaped solitaire framed with crystal shine.',
    description: 'Sweet and sparkling heart ring for anniversaries, gifts, and daily wear.',
    coverImage: 'https://images.unsplash.com/photo-1603561596112-db1d3c7c90d8?w=1400&auto=format&fit=crop&q=85',
    badge: 'New',
    serviceType: 'Rings',
    accountType: 'Ready to ship',
    durationDays: null,
    priceCents: 59900,
    compareAtCents: 119900,
    currency: 'INR',
    stockQuantity: 10,
    isFeatured: true,
    isActive: true,
    metaTitle: null,
    metaDescription: null,
    categoryId: 'rings',
    category: demoCategories[1],
  },
  {
    id: 'rose-gold-eternity-ring',
    name: 'Rose Gold Eternity Ring',
    slug: 'rose-gold-eternity-ring',
    shortDescription: 'Full-stone eternity band in a soft rose gold tone.',
    description: 'A delicate eternity band with continuous sparkle and a premium finish.',
    coverImage: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=1400&auto=format&fit=crop&q=85',
    badge: 'Deal',
    serviceType: 'Rings',
    accountType: 'Ready to ship',
    durationDays: null,
    priceCents: 64900,
    compareAtCents: 129900,
    currency: 'INR',
    stockQuantity: 28,
    isFeatured: true,
    isActive: true,
    metaTitle: null,
    metaDescription: null,
    categoryId: 'rings',
    category: demoCategories[1],
  },
];

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export async function getCategories() {
  try {
    const categories = await fetchJson<GlownariCategory[]>('/glownari/categories');
    return categories.length > 0 ? categories : demoCategories;
  } catch {
    return demoCategories;
  }
}

export async function getProducts(params?: { categorySlug?: string; featured?: boolean; take?: number; q?: string }) {
  const q = new URLSearchParams();
  if (params?.categorySlug) q.set('categorySlug', params.categorySlug);
  if (params?.featured) q.set('featured', 'true');
  if (params?.take) q.set('take', String(params.take));
  if (params?.q) q.set('q', params.q);

  try {
    const data = await fetchJson<Paginated<GlownariProduct>>(`/glownari/products${q.toString() ? `?${q}` : ''}`);
    return data.items.length > 0 ? data : fallbackProducts(params);
  } catch {
    return fallbackProducts(params);
  }
}

function fallbackProducts(params?: { categorySlug?: string; featured?: boolean; take?: number; q?: string }): Paginated<GlownariProduct> {
  const query = params?.q?.trim().toLowerCase();
  let items = demoProducts;
  if (params?.categorySlug) items = items.filter((product) => product.category.slug === params.categorySlug);
  if (params?.featured) items = items.filter((product) => product.isFeatured);
  if (query) {
    items = items.filter((product) =>
      [product.name, product.shortDescription, product.serviceType, product.category?.name]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(query)),
    );
  }
  const total = items.length;
  if (params?.take) items = items.slice(0, params.take);
  return { items, total, take: params?.take || items.length, skip: 0 };
}

export async function getProduct(slug: string) {
  try {
    return await fetchJson<GlownariProduct>(`/glownari/products/${slug}`);
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
  rating: 4.8,
  reviews: 500,
  orders: 1000,
  activationLabel: 'Under 10 min activation',
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
  mode: 'razorpay' | 'utr';
  onlineGatewayEnabled: boolean;
  razorpayKeyId?: string | null;
  upiId?: string | null;
  upiName?: string | null;
};

export async function getPaymentConfig(): Promise<PaymentConfig> {
  try {
    return await fetchJson<PaymentConfig>('/glownari/payment-config');
  } catch {
    return { mode: 'razorpay', onlineGatewayEnabled: true, razorpayKeyId: null };
  }
}

export type PromoConfig = {
  bannerEnabled: boolean;
  bannerText: string | null;
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
    const res = await fetch(`${API_URL}/glownari/promo`, { next: { revalidate: 30 } });
    if (!res.ok) throw new Error('promo failed');
    return await res.json();
  } catch {
    return { bannerEnabled: false, bannerText: null, heroSaleLabel: null, heroBackgroundImage: null };
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
    const res = await fetch(`${API_URL}/glownari/coupon/preview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
  const res = await fetch(`${API_URL}/glownari/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Order failed');
  return data as {
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
  const res = await fetch(`${API_URL}/glownari/orders/verify-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Payment verification failed');
  return data;
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
