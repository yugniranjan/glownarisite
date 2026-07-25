import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'Refund policy, privacy policy and disclaimer for Glownari.',
};

const SECTIONS: { id: string; heading: string; intro?: string; points: string[] }[] = [
  {
    id: 'refund-policy',
    heading: 'Refund Policy',
    points: [
      'If we are unable to fulfill a paid order because the product is unavailable, your payment can be refunded or adjusted against another product.',
      'Refund eligibility depends on product condition, fulfillment status, and the reason shared by the customer.',
      'Digital or custom items may have different refund handling if work has already started or delivery has been completed.',
      'For damaged, wrong, or incomplete items, contact support with order number, photos, and details as soon as possible.',
      'Refunds will not be given for misuse, fraudulent claims, incorrect customer details, or policy violations.',
    ],
  },
  {
    id: 'privacy-policy',
    heading: 'Privacy Policy',
    intro: 'Your privacy is important to us. By using our website, you agree to the following privacy policy:',
    points: [
      'We only collect basic information required to process and support your order.',
      'User data is used only for order processing, fulfillment, support, analytics, and fraud prevention.',
      'We do not misuse, sell, or share your personal information with unauthorized parties.',
      'Your details are only shared where necessary for payment, delivery, or support.',
      'We do not store card, UPI, wallet, or netbanking credentials on our servers.',
      'Payment-related information is handled securely through Razorpay or another trusted payment provider.',
      'We take reasonable steps to protect user information from unauthorized access.',
    ],
  },
  {
    id: 'disclaimer',
    heading: 'Disclaimer',
    points: [
      'Product photos, names, and descriptions should be reviewed before publishing.',
      'All third-party names, brands, logos, and payment marks belong to their respective owners.',
      'Store policies may be updated as operations, products, and payment methods change.',
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
