'use client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const VISITOR_KEY = 'streamhub_visitor_id';
const SESSION_KEY = 'streamhub_session_id';

export type StreamHubEvent =
  | 'page_view'
  | 'product_view'
  | 'checkout_started'
  | 'payment_started'
  | 'order_submitted';

type Payload = {
  eventType: StreamHubEvent;
  path?: string;
  productId?: string | null;
  productSlug?: string | null;
  productName?: string | null;
  orderNumber?: string | null;
  metadata?: Record<string, string | number | boolean | null>;
};

function id() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
}

function storageId(storage: Storage, key: string) {
  let value = storage.getItem(key);
  if (!value) {
    value = id();
    storage.setItem(key, value);
  }
  return value;
}

function visitorId() {
  try { return storageId(localStorage, VISITOR_KEY); } catch { return id(); }
}

function sessionId() {
  try { return storageId(sessionStorage, SESSION_KEY); } catch { return id(); }
}

function utmSource() {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get('utm_source') || params.get('source') || null;
  } catch {
    return null;
  }
}

export function trackStreamHub(payload: Payload) {
  if (typeof window === 'undefined') return;
  const body = JSON.stringify({
    ...payload,
    visitorId: visitorId(),
    sessionId: sessionId(),
    path: payload.path || `${window.location.pathname}${window.location.search}`,
    referrer: document.referrer || null,
    utmSource: utmSource(),
  });
  const url = `${API_URL}/streamhub/analytics/track`;

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      if (navigator.sendBeacon(url, blob)) return;
    }
  } catch {
    /* fall back to fetch */
  }

  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => undefined);
}
