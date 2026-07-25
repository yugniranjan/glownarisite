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
  { id: 'fashion', name: 'Fashion', slug: 'fashion', description: 'Clothing, accessories, and style essentials', image: null, badge: null, badgeColor: null, isActive: true, sortOrder: 1 },
  { id: 'beauty', name: 'Beauty', slug: 'beauty', description: 'Beauty, self-care, and grooming products', image: null, badge: null, badgeColor: null, isActive: true, sortOrder: 2 },
  { id: 'home', name: 'Home', slug: 'home', description: 'Useful everyday home products', image: null, badge: null, badgeColor: null, isActive: true, sortOrder: 3 },
  { id: 'bags', name: 'Bags', slug: 'bags', description: 'Totes, slings, wallets, and travel bags', image: null, badge: 'Hot', badgeColor: 'red', isActive: true, sortOrder: 4 },
  { id: 'jewellery', name: 'Jewellery', slug: 'jewellery', description: 'Daily wear and occasion jewellery', image: null, badge: null, badgeColor: null, isActive: true, sortOrder: 5 },
  { id: 'kitchen', name: 'Kitchen', slug: 'kitchen', description: 'Kitchen helpers and organizers', image: null, badge: null, badgeColor: null, isActive: true, sortOrder: 6 },
  { id: 'wellness', name: 'Wellness', slug: 'wellness', description: 'Wellness, care, and lifestyle items', image: null, badge: null, badgeColor: null, isActive: true, sortOrder: 7 },
  { id: 'gifts', name: 'Gifts', slug: 'gifts', description: 'Gift-ready curated products', image: null, badge: 'New', badgeColor: 'green', isActive: true, sortOrder: 8 },
];

export const demoProducts: GlownariProduct[] = [
  {
    id: 'everyday-tote',
    name: 'Everyday Tote Bag',
    slug: 'everyday-tote-bag',
    shortDescription: 'Roomy daily-use tote with a clean premium look.',
    description: 'A practical everyday product listing. Replace this from admin with your real stock, images, and descriptions.',
    coverImage: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=1400&auto=format&fit=crop',
    badge: 'Best seller',
    serviceType: 'Accessories',
    accountType: 'In stock',
    durationDays: null,
    priceCents: 59900,
    compareAtCents: 99900,
    currency: 'INR',
    stockQuantity: 18,
    isFeatured: true,
    isActive: true,
    metaTitle: null,
    metaDescription: null,
    categoryId: 'bags',
    category: demoCategories[3],
  },
  {
    id: 'beauty-kit',
    name: 'Beauty Essentials Kit',
    slug: 'beauty-essentials-kit',
    shortDescription: 'A curated kit for gifting, travel, or daily care.',
    description: 'Use admin to customize variants, stock, pricing, and product copy for any category you sell.',
    coverImage: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1400&auto=format&fit=crop',
    badge: 'Popular',
    serviceType: 'Beauty',
    accountType: 'Ready to ship',
    durationDays: null,
    priceCents: 79900,
    compareAtCents: 129900,
    currency: 'INR',
    stockQuantity: 24,
    isFeatured: true,
    isActive: true,
    metaTitle: null,
    metaDescription: null,
    categoryId: 'beauty',
    category: demoCategories[1],
  },
  {
    id: 'desk-organizer',
    name: 'Minimal Desk Organizer',
    slug: 'minimal-desk-organizer',
    shortDescription: 'A clean organizer for desk, vanity, or bedside storage.',
    description: 'Generic product demo data. Real items should come from the admin product catalog.',
    coverImage: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1400&auto=format&fit=crop',
    badge: 'New',
    serviceType: 'Home',
    accountType: 'In stock',
    durationDays: null,
    priceCents: 49900,
    compareAtCents: 79900,
    currency: 'INR',
    stockQuantity: 30,
    isFeatured: false,
    isActive: true,
    metaTitle: null,
    metaDescription: null,
    categoryId: 'home',
    category: demoCategories[2],
  },
  {
    id: 'cotton-kurti-set',
    name: 'Printed Cotton Kurti Set',
    slug: 'printed-cotton-kurti-set',
    shortDescription: 'Soft breathable kurti set for daily and festive wear.',
    description: 'A comfortable cotton kurti set with premium print, easy fit, and admin-editable size/color notes.',
    coverImage: 'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=1400&auto=format&fit=crop',
    badge: 'Trending',
    serviceType: 'Fashion',
    accountType: 'Ready to ship',
    durationDays: null,
    priceCents: 99900,
    compareAtCents: 199900,
    currency: 'INR',
    stockQuantity: 15,
    isFeatured: true,
    isActive: true,
    metaTitle: null,
    metaDescription: null,
    categoryId: 'fashion',
    category: demoCategories[0],
  },
  {
    id: 'minimal-jewellery-combo',
    name: 'Minimal Jewellery Combo',
    slug: 'minimal-jewellery-combo',
    shortDescription: 'Daily wear necklace and earrings combo.',
    description: 'Elegant lightweight jewellery combo for gifting, office, and everyday outfits.',
    coverImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1400&auto=format&fit=crop',
    badge: 'Gift pick',
    serviceType: 'Jewellery',
    accountType: 'In stock',
    durationDays: null,
    priceCents: 39900,
    compareAtCents: 89900,
    currency: 'INR',
    stockQuantity: 32,
    isFeatured: true,
    isActive: true,
    metaTitle: null,
    metaDescription: null,
    categoryId: 'jewellery',
    category: demoCategories[4],
  },
  {
    id: 'kitchen-storage-jars',
    name: 'Airtight Kitchen Jar Set',
    slug: 'airtight-kitchen-jar-set',
    shortDescription: 'Space-saving jars for clean kitchen storage.',
    description: 'A practical storage jar set for pantry, snacks, dry fruits, spices, and daily kitchen organization.',
    coverImage: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1400&auto=format&fit=crop',
    badge: 'Value',
    serviceType: 'Kitchen',
    accountType: 'In stock',
    durationDays: null,
    priceCents: 64900,
    compareAtCents: 119900,
    currency: 'INR',
    stockQuantity: 22,
    isFeatured: false,
    isActive: true,
    metaTitle: null,
    metaDescription: null,
    categoryId: 'kitchen',
    category: demoCategories[5],
  },
  {
    id: 'wellness-gift-hamper',
    name: 'Wellness Gift Hamper',
    slug: 'wellness-gift-hamper',
    shortDescription: 'A curated self-care hamper for gifting.',
    description: 'Gift-ready wellness hamper with self-care essentials. Replace items and pricing from admin anytime.',
    coverImage: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1400&auto=format&fit=crop',
    badge: 'New',
    serviceType: 'Wellness',
    accountType: 'Gift packed',
    durationDays: null,
    priceCents: 119900,
    compareAtCents: 219900,
    currency: 'INR',
    stockQuantity: 10,
    isFeatured: true,
    isActive: true,
    metaTitle: null,
    metaDescription: null,
    categoryId: 'gifts',
    category: demoCategories[7],
  },
  {
    id: 'travel-sling-bag',
    name: 'Travel Sling Bag',
    slug: 'travel-sling-bag',
    shortDescription: 'Compact sling bag for travel and daily use.',
    description: 'Lightweight sling with useful pockets and a clean modern look.',
    coverImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1400&auto=format&fit=crop',
    badge: 'Deal',
    serviceType: 'Bags',
    accountType: 'Ready to ship',
    durationDays: null,
    priceCents: 44900,
    compareAtCents: 99900,
    currency: 'INR',
    stockQuantity: 28,
    isFeatured: false,
    isActive: true,
    metaTitle: null,
    metaDescription: null,
    categoryId: 'bags',
    category: demoCategories[3],
  },
];

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export async function getCategories() {
  try {
    return await fetchJson<GlownariCategory[]>('/glownari/categories');
  } catch {
    return [];
  }
}

export async function getProducts(params?: { categorySlug?: string; featured?: boolean; take?: number; q?: string }) {
  const q = new URLSearchParams();
  if (params?.categorySlug) q.set('categorySlug', params.categorySlug);
  if (params?.featured) q.set('featured', 'true');
  if (params?.take) q.set('take', String(params.take));
  if (params?.q) q.set('q', params.q);

  try {
    return await fetchJson<Paginated<GlownariProduct>>(`/glownari/products${q.toString() ? `?${q}` : ''}`);
  } catch {
    return { items: [], total: 0, take: params?.take || 0, skip: 0 };
  }
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
  heroBackgroundImage?: string | null;
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
