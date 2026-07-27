'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { Loader2, ShieldCheck, UserPlus } from 'lucide-react';
import { signup } from '@/lib/auth';
import PageLoader from '@/components/PageLoader';

function SignupInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await signup({
        name: name.trim(),
        email: email.trim(),
        whatsappNumber: phone,
        password,
      });
      router.replace(next);
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="site-container grid min-h-[calc(100vh-160px)] place-items-center py-10 sm:py-12">
      <div className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-bg-elev-2 shadow-card">
        <div className="bg-[linear-gradient(135deg,var(--accent-strong),var(--accent))] px-5 py-6 text-white">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-white/15">
            <UserPlus className="h-5 w-5" />
          </div>
          <h1 className="mt-4 text-2xl font-black">Create your account</h1>
          <p className="mt-1 text-sm text-white/80">Save your details and get faster order support.</p>
        </div>

        <form onSubmit={submit} className="space-y-4 p-5">
          {error && <div className="rounded-md border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger">{error}</div>}
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold">Full name</span>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" required />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold">Email</span>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold">WhatsApp number</span>
            <div className="flex h-11 overflow-hidden rounded-md border border-border bg-[var(--bg-elev-3)] focus-within:border-[var(--accent)]">
              <span className="grid place-items-center border-r border-border px-3 text-sm font-semibold text-text-muted">+91</span>
              <input className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="98765 43210" inputMode="numeric" required />
            </div>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold">Password</span>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 8 chars with number" required />
          </label>
          <div className="rounded-lg border border-success/20 bg-success-soft p-3 text-xs leading-5 text-success">
            <ShieldCheck className="mr-1.5 inline h-4 w-4" />
            Password must contain at least 8 characters, one letter, and one digit.
          </div>
          <button className="btn-accent w-full" disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
            Create account
          </button>
          <p className="text-center text-sm text-text-muted">
            Already have an account? <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-black text-accent">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<PageLoader label="Loading signup..." />}>
      <SignupInner />
    </Suspense>
  );
}
