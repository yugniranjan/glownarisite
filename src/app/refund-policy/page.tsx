import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund & Return Policy',
  description: 'Refund and return policy for Glownari.',
};

export default function RefundPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 text-text sm:px-6 sm:py-14">
      <article className="space-y-7 text-lg leading-8 text-text sm:text-xl sm:leading-9">
        <p>
          Every product from Glownari is created to make you feel a little more you, a little
          more positive and a little more glowing. But if for some XYZ reason it doesn't do that,
          we understand and do our best to help you.
        </p>

        <p>
          No judgement, no guilt and no struggle. This Refund & Return Policy covers how
          easily you can request an exchange or refund, because we believe that your glow
          should never come with added stress.
        </p>

        <section className="space-y-6">
          <h1 className="text-xl font-bold sm:text-2xl">Refund Policy:</h1>

          <p>
            A repayment or refund will be processed once your replacement or return request
            has been approved under our Return Policy. To make sure we can continue with it,
            your situation shall fall under any of the following:
          </p>

          <ul className="space-y-1">
            <li>→ Size or fit concerns</li>
            <li>→ Colour-related concerns</li>
            <li>→ The product does not meet your preference</li>
            <li>→ The product arrives damaged or defective</li>
          </ul>

          <p>
            Note* We will review your refund/return request first. Once we approve it, you may
            have to send the product back to us.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-bold sm:text-2xl">Refund or Exchange?</h2>

          <p>
            After your request is approved from our end, you have the power to choose between
            two options depending on what suits you best:
          </p>

          <p>
            → Get your money back : If you want to get your money back, then in such a
            scenario we will process a refund for the amount paid for the product.
          </p>

          <p>
            → Choose an exchange: If you wouldn't be in the favour of taking a refund, then you
            can opt for the same product instead.
          </p>

          <p>
            Make the selection that feels right and leave the rest to us. We will work our way
            through it and have things sorted within 2 to 7 working days.
          </p>
        </section>
      </article>
    </main>
  );
}
