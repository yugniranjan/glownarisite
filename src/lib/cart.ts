import { API_URL, type GlownariProduct } from '@/lib/api';
import { getAuthToken } from '@/lib/auth';

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  coverImage: string | null;
  priceCents: number;
  compareAtCents: number | null;
  currency: string;
  categoryName: string | null;
  stockQuantity: number | null;
  quantity: number;
};

export const CART_EVENT = 'glownari-cart-change';
export const AUTH_REQUIRED = 'AUTH_REQUIRED';

function emitCartChange(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(CART_EVENT, { detail: items }));
}

function clampQuantity(value: number) {
  return Math.max(1, Math.min(5, Math.round(Number(value) || 1)));
}

function requireToken() {
  const token = getAuthToken();
  if (!token) {
    const error = new Error('Login required');
    error.name = AUTH_REQUIRED;
    throw error;
  }
  return token;
}

async function cartFetch(path = '', init?: RequestInit, emit = true): Promise<CartItem[]> {
  const token = requireToken();
  const res = await fetch(`${API_URL}/glownari/cart${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(init?.headers || {}),
    },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || 'Cart request failed');
  const items = Array.isArray(data) ? data : [];
  if (emit) emitCartChange(items);
  return items;
}

export function productToCartItem(product: GlownariProduct, quantity = 1): CartItem {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    coverImage: product.coverImage,
    priceCents: product.priceCents,
    compareAtCents: product.compareAtCents,
    currency: product.currency,
    categoryName: product.category?.name || product.serviceType || null,
    stockQuantity: product.stockQuantity,
    quantity: clampQuantity(quantity),
  };
}

export async function fetchCart() {
  return cartFetch('', undefined, false);
}

export async function addToCart(product: GlownariProduct, quantity = 1) {
  return cartFetch('', {
    method: 'POST',
    body: JSON.stringify({ productId: product.id, quantity: clampQuantity(quantity) }),
  });
}

export async function updateCartQuantity(productId: string, quantity: number) {
  return cartFetch(`/${encodeURIComponent(productId)}`, {
    method: 'PATCH',
    body: JSON.stringify({ quantity: Math.max(0, Math.min(5, Math.round(Number(quantity) || 0))) }),
  });
}

export async function removeFromCart(productId: string) {
  return cartFetch(`/${encodeURIComponent(productId)}`, { method: 'DELETE' });
}

export async function clearCart() {
  return cartFetch('', { method: 'DELETE' });
}

export function cartCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function cartSubtotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);
}
