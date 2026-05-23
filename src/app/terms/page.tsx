import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms & conditions and disclaimer for StreamHub.',
};

const SECTIONS: { id: string; heading: string; intro?: string; points: string[] }[] = [
  {
    id: 'terms',
    heading: 'Terms & Conditions',
    intro: 'By purchasing any subscription from our website, you agree to the following terms:',
    points: [
      'All subscriptions are shared plans.',
      'Only one screen/device is allowed at a time unless mentioned otherwise.',
      'Using multiple screens/devices may result in account removal without notice.',
      'Do not change password, email, profile details, or recovery information.',
      'Sharing account details with others is strictly prohibited.',
      'Any unauthorized changes or misuse will lead to account suspension/block.',
      'No refund will be provided once a plan is successfully delivered and working properly.',
      'We are not responsible for OTT server issues or temporary downtime.',
      'We reserve the right to remove access if any policy is violated.',
    ],
  },
  {
    id: 'disclaimer',
    heading: 'Disclaimer',
    points: [
      'We do not own any OTT platform or its content.',
      'All trademarks and logos belong to their respective owners.',
      'Services are provided for personal entertainment use only.',
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-3 py-8 sm:px-4 sm:py-12">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Terms &amp; Conditions</h1>
      <p className="mt-2 text-sm text-text-muted">Last updated 23 May 2026</p>

      <div className="mt-6 space-y-5 sm:mt-8 sm:space-y-6">
        {SECTIONS.map((s) => (
          <section
            key={s.id}
            id={s.id}
            className="scroll-mt-24 rounded-xl border border-border bg-bg-elev-2 p-4 sm:p-6"
          >
            <h2 className="text-lg font-semibold sm:text-xl">{s.heading}</h2>
            {s.intro && <p className="mt-2 text-sm leading-relaxed text-text-muted">{s.intro}</p>}
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text-muted">
              {s.points.map((point, i) => (
                <li key={i} className="flex gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
