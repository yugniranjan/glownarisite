import Link from 'next/link';
import { CheckCircle2, type LucideIcon } from 'lucide-react';

type AccountGateProps = {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  benefits: string[];
  loginHref: string;
  signupHref: string;
};

export default function AccountGate({
  icon: Icon,
  eyebrow,
  title,
  description,
  benefits,
  loginHref,
  signupHref,
}: AccountGateProps) {
  return (
    <main className="site-container page-content">
      <section className="overflow-hidden rounded-lg border border-border bg-bg-elev-2">
        <div className="grid md:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
          <div className="px-5 py-8 sm:px-8 sm:py-10">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                <Icon className="h-5 w-5" />
              </span>
              <p className="text-[11px] font-bold uppercase tracking-wider text-accent">{eyebrow}</p>
            </div>
            <h1 className="mt-5 max-w-xl text-2xl font-black sm:text-3xl">{title}</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-text-muted sm:text-base">{description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={loginHref} className="btn-accent inline-flex min-w-28">Login</Link>
              <Link href={signupHref} className="btn-ghost inline-flex">Create account</Link>
            </div>
          </div>

          <div className="border-t border-border bg-bg-elev-1 px-5 py-6 sm:px-8 md:border-l md:border-t-0 md:py-10">
            <p className="text-sm font-black">A little easier when you sign in</p>
            <ul className="mt-4 space-y-3">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2.5 text-sm leading-5 text-text-muted">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
