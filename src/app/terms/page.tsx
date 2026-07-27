import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms & conditions for Glownari.',
};

const SECTIONS: { id: string; heading: string; intro?: string; points: string[] }[] = [
  {
    id: 'terms',
    heading: 'Terms & Conditions',
    intro: 'By purchasing any product from our website, you agree to the following terms:',
    points: [
      'Product names, prices, stock, images, descriptions, and offers are managed from the admin panel and may change without prior notice.',
      'Orders are accepted only after successful payment verification through Razorpay or another enabled payment method.',
      'Customers must provide accurate name, phone, email, quantity, and delivery/support notes where required.',
      'We may cancel or refund an order if the product is unavailable, payment is disputed, or order details appear invalid.',
      'Misuse, fraudulent payments, repeated false claims, or abusive communication may lead to order cancellation.',
      'Delivery timelines depend on product availability, customer response, and operational conditions.',
      'Refunds and replacements are handled according to the refund policy shown on this website.',
    ],
  },
  {
    id: 'disclaimer',
    heading: 'Disclaimer',
    points: [
      'Product photos, names, and descriptions should be reviewed by the store owner before publishing.',
      'All third-party names, brands, logos, and payment marks belong to their respective owners.',
      'Razorpay handles payment collection; we do not store card, UPI, wallet, or netbanking credentials on this website.',
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-9 sm:px-6 sm:py-12">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Terms &amp; Conditions</h1>
      <p className="mt-2 text-sm text-text-muted">Last updated 23 May 2026</p>

      <div className="mt-7 space-y-6 sm:mt-9">
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
