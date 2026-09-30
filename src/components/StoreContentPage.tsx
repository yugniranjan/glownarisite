import Link from 'next/link';
import { storeContent } from '@/lib/store-content';

export default function StoreContentPage({ contentKey }: { contentKey: string }) {
  const content = storeContent[contentKey];
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 text-text sm:py-14">
      <h1 className="font-display text-3xl sm:text-4xl">{content.title}</h1>
      <article className="mt-8 space-y-8 text-base leading-8 text-text-muted">
        {content.sections.map((section, index) => (
          <section key={index} className="space-y-4">
            {section.heading && <h2 className="text-xl font-semibold text-text">{section.heading}</h2>}
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph.split(/(Refund Policy|Privacy Policy)/).map((part, i) =>
                part === 'Refund Policy' || part === 'Privacy Policy'
                  ? <Link key={i} className="text-accent underline" href={part === 'Refund Policy' ? '/refund-policy' : '/privacy-policy'}>{part}</Link>
                  : part,
              )}</p>
            ))}
          </section>
        ))}
      </article>
    </div>
  );
}
