export interface StreamHubCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface StreamHubProduct {
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
  category: StreamHubCategory;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  take: number;
  skip: number;
}

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const demoCategories: StreamHubCategory[] = [
  { id: 'ott', name: 'OTT Plans', slug: 'ott-plans', description: 'Streaming subscriptions and bundles', isActive: true, sortOrder: 1 },
  { id: 'music', name: 'Music', slug: 'music', description: 'Music and podcast apps', isActive: true, sortOrder: 2 },
  { id: 'sports', name: 'Sports', slug: 'sports', description: 'Live match and league access', isActive: true, sortOrder: 3 },
];

export const demoProducts: StreamHubProduct[] = [
  {
    id: 'netflix-premium',
    name: 'Netflix Premium 4K',
    slug: 'netflix-premium-4k',
    shortDescription: 'Private premium profile with UHD streaming for 30 days.',
    description: 'A fast setup Netflix Premium plan with support and delivery updates on WhatsApp.',
    coverImage: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=1400&auto=format&fit=crop',
    badge: 'Best seller',
    serviceType: 'Streaming',
    accountType: 'Private profile',
    durationDays: 30,
    priceCents: 19900,
    compareAtCents: 49900,
    currency: 'INR',
    stockQuantity: 18,
    isFeatured: true,
    isActive: true,
    metaTitle: null,
    metaDescription: null,
    categoryId: 'ott',
    category: demoCategories[0],
  },
  {
    id: 'prime-video',
    name: 'Prime Video Monthly',
    slug: 'prime-video-monthly',
    shortDescription: 'Monthly entertainment plan with fast activation.',
    description: 'Prime Video access for shows, movies, and originals with easy order tracking.',
    coverImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1400&auto=format&fit=crop',
    badge: 'Popular',
    serviceType: 'Streaming',
    accountType: 'Shared slot',
    durationDays: 30,
    priceCents: 14900,
    compareAtCents: 29900,
    currency: 'INR',
    stockQuantity: 24,
    isFeatured: true,
    isActive: true,
    metaTitle: null,
    metaDescription: null,
    categoryId: 'ott',
    category: demoCategories[0],
  },
  {
    id: 'spotify-premium',
    name: 'Spotify Premium',
    slug: 'spotify-premium',
    shortDescription: 'Ad-free music plan with offline listening.',
    description: 'Spotify Premium access with quick onboarding and renewal reminders.',
    coverImage: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1400&auto=format&fit=crop',
    badge: 'Instant',
    serviceType: 'Music',
    accountType: 'Individual',
    durationDays: 30,
    priceCents: 9900,
    compareAtCents: 19900,
    currency: 'INR',
    stockQuantity: 30,
    isFeatured: false,
    isActive: true,
    metaTitle: null,
    metaDescription: null,
    categoryId: 'music',
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
    return await fetchJson<StreamHubCategory[]>('/streamhub/categories');
  } catch {
    return demoCategories;
  }
}

export async function getProducts(params?: { categorySlug?: string; featured?: boolean; take?: number }) {
  const q = new URLSearchParams();
  if (params?.categorySlug) q.set('categorySlug', params.categorySlug);
  if (params?.featured) q.set('featured', 'true');
  if (params?.take) q.set('take', String(params.take));

  try {
    return await fetchJson<Paginated<StreamHubProduct>>(`/streamhub/products${q.toString() ? `?${q}` : ''}`);
  } catch {
    const items = demoProducts.filter((product) => {
      if (params?.categorySlug && product.category.slug !== params.categorySlug) return false;
      if (params?.featured && !product.isFeatured) return false;
      return true;
    });
    return { items, total: items.length, take: params?.take || items.length, skip: 0 };
  }
}

export async function getProduct(slug: string) {
  try {
    return await fetchJson<StreamHubProduct>(`/streamhub/products/${slug}`);
  } catch {
    return demoProducts.find((product) => product.slug === slug) || null;
  }
}

export function formatMoney(cents: number, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
