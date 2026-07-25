'use client';

import { API_URL } from '@/lib/api';

export type StoreUser = {
  id: string;
  email: string;
  name: string | null;
  whatsappNumber: string | null;
};

type AuthPayload = { user: StoreUser; token: string };

const TOKEN_KEY = 'glownari_auth_token';
const USER_KEY = 'glownari_auth_user';
export const AUTH_EVENT = 'glownari-auth-change';

function emitAuthChange() {
  window.dispatchEvent(new CustomEvent(AUTH_EVENT));
}

export function getAuthToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): StoreUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveAuth(payload: AuthPayload) {
  localStorage.setItem(TOKEN_KEY, payload.token);
  localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
  emitAuthChange();
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  emitAuthChange();
}

async function authFetch<T>(path: string, body?: unknown, token?: string | null): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: body ? 'POST' : 'GET',
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || 'Request failed');
  return data;
}

export async function signup(body: {
  name: string;
  email: string;
  password: string;
  whatsappNumber: string;
}) {
  const payload = await authFetch<AuthPayload>('/auth/signup', body);
  saveAuth(payload);
  return payload.user;
}

export async function startLogin(body: { email: string; password: string }) {
  return authFetch<{ otpRequired: boolean; email: string; recipient: string; message: string }>('/auth/login', body);
}

export async function verifyLoginOtp(body: { email: string; otp: string }) {
  const payload = await authFetch<AuthPayload>('/auth/verify-otp', body);
  saveAuth(payload);
  return payload.user;
}

export async function fetchMe() {
  const token = getAuthToken();
  if (!token) return null;
  try {
    const user = await authFetch<StoreUser>('/auth/me', undefined, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    emitAuthChange();
    return user;
  } catch {
    logout();
    return null;
  }
}
