'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { Loader2, Lock, Phone, UserRound } from 'lucide-react';
import { startLogin, verifyLoginOtp } from '@/lib/auth';
import PageLoader from '@/components/PageLoader';

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/';
  const [step, setStep] = useState<'password' | 'otp'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [recipient, setRecipient] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submitPassword(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await startLogin({ email: email.trim(), password });
      setRecipient(res.recipient);
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  }

  async function submitOtp(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await verifyLoginOtp({ email: email.trim(), otp });
      router.replace(next);
    } catch (err: any) {
      setError(err.message || 'OTP verification failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="site-container grid min-h-[calc(100vh-160px)] place-items-center py-10 sm:py-12">
      <div className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-bg-elev-2 shadow-card">
        <div className="bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] px-5 py-6 text-white">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-white/15">
            <UserRound className="h-5 w-5" />
          </div>
          <h1 className="mt-4 text-2xl font-black">Login to your account</h1>
          <p className="mt-1 text-sm text-white/80">Track orders faster and checkout with saved customer details.</p>
        </div>

        <form onSubmit={step === 'password' ? submitPassword : submitOtp} className="space-y-4 p-5">
          {error && <div className="rounded-md border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger">{error}</div>}

          {step === 'password' ? (
            <>
              <label className="block">
                <span className="mb-1.5 block text-sm font-bold">Email</span>
                <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-bold">Password</span>
                <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
              </label>
              <button className="btn-accent w-full" disabled={busy}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                Continue
              </button>
            </>
          ) : (
            <>
              <div className="rounded-lg border border-border bg-bg-elev-1 p-3 text-sm text-text-muted">
                <Phone className="mr-2 inline h-4 w-4 text-accent" />
                OTP sent to {recipient || 'your WhatsApp number'}.
              </div>
              <label className="block">
                <span className="mb-1.5 block text-sm font-bold">6-digit OTP</span>
                <input className="input text-center text-lg font-black tracking-[0.4em]" inputMode="numeric" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" required />
              </label>
              <button className="btn-accent w-full" disabled={busy || otp.length !== 6}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                Verify & login
              </button>
              <button type="button" onClick={() => setStep('password')} className="btn-ghost w-full">
                Change email
              </button>
            </>
          )}

          <p className="text-center text-sm text-text-muted">
            New customer? <Link href={`/signup?next=${encodeURIComponent(next)}`} className="font-black text-accent">Create account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<PageLoader label="Loading login..." />}>
      <LoginInner />
    </Suspense>
  );
}
