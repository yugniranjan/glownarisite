import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'Refund policy, privacy policy and disclaimer for StreamHub.',
};

const SECTIONS: { id: string; heading: string; intro?: string; points: string[] }[] = [
  {
    id: 'refund-policy',
    heading: 'Refund Policy',
    points: [
      'If you face any login issue at the time of purchase, or if we are unable to provide the service, your full payment will be refunded without any deduction.',
      'Once the plan is successfully delivered and working properly, no refund will be provided.',
      'If any issue occurs after 2–3 days of purchase, our support team will properly assist you.',
      'In such cases, replacement details or a new account will be provided within 30 minutes whenever possible.',
      'Refunds will not be given for issues caused by misuse, policy violations, or unauthorized changes by the user.',
    ],
  },
  {
    id: 'privacy-policy',
    heading: 'Privacy Policy',
    intro: 'Your privacy is important to us. By using our website, you agree to the following privacy policy:',
    points: [
      'We only collect basic information required to provide your subscription service.',
      'User data is used only for order processing and account delivery purposes.',
      'We do not misuse, sell, or share your personal information with unauthorized parties.',
      'Your details are only forwarded where necessary to activate or deliver the service.',
      'We do not permanently store sensitive user information on our servers.',
      'Payment-related information is handled securely through trusted payment providers.',
      'We take reasonable steps to protect user information from unauthorized access.',
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

export default function RefundPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-3 py-8 sm:px-4 sm:py-12">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Refund Policy</h1>
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
