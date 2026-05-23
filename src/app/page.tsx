import Link from 'next/link';
import {
  Award,
  CheckCircle2,
  ChevronDown,
  IndianRupee,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import Rail, { RailItem } from '@/components/Rail';
import RatingStars from '@/components/RatingStars';
import PaymentMethods from '@/components/PaymentMethods';
import SocialProofRibbon from '@/components/SocialProofRibbon';
import CategoryBadge from '@/components/CategoryBadge';
import {
  compactCount,
  formatMoney,
  getCategories,
  getProducts,
  getSocialProof,
  plusCount,
  type SocialProof,
  type StreamHubProduct,
} from '@/lib/api';

export const revalidate = 60;

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918506965129';

const SERVICE_TILES = [
  'Netflix', 'Prime', 'Hotstar', 'Spotify', 'YouTube', 'SonyLIV',
  'ZEE5', 'Canva', 'Adobe', 'ChatGPT', 'IPTV', 'VPN',
];

const FAQS = [
  ['How fast is delivery?', 'Most orders are activated in under 10 minutes after payment confirmation. Some plans require a 1–2 hour manual setup — we always tell you upfront on the product page.'],
  ['Are these accounts safe to use?', 'Yes. All accounts are verified, fully personal, and come with Refund for Any Valid Issue. We never ask for your existing account credentials.'],
  ['Can I track my order?', 'Yes. After ordering you get an order number — use the Track Order page or your WhatsApp confirmation to see status at any time.'],
  ['What payment methods do you accept?', 'All payments are processed securely through Razorpay — UPI, credit/debit cards, net banking, wallets and more.'],
  ['What if the account stops working?', 'Reach us on WhatsApp within the validity period — we refund you, no questions asked. That\'s our Refund for Any Valid Issue policy.'],
];

const TESTIMONIALS = [
  { name: 'Aman Sharma',  city: 'Pune',     rating: 5, quote: 'Ordered Netflix Premium late at night, got the login in 8 minutes. Genuine site, worth every rupee.' },
  { name: 'Riya Patel',   city: 'Mumbai',   rating: 5, quote: 'Prices feel almost too good but everything checked out. Support replied on WhatsApp in 2 minutes.' },
  { name: 'Kunal Mehta',  city: 'Bengaluru',rating: 4, quote: 'Tried 3 different OTT sites this year — StreamHub is the only one that actually delivers what they promise.' },
  { name: 'Tanya Iyer',   city: 'Delhi',    rating: 5, quote: 'Spotify Premium for a year at this price? Done. Activation was instant, refund promise feels reassuring.' },
];

const CAT_HUES = ['#7c1d1d', '#1e3a8a', '#0f3b3b', '#581c87', '#7c2d12', '#831843'];

const HERO_BG = '/hero-section-bg.svg';

export default async function HomePage() {
  const [categories, featured, products, proof] = await Promise.all([
    getCategories(),
    getProducts({ featured: true, take: 10 }),
    getProducts({ take: 36 }),
    getSocialProof(),
  ]);

  const hero = featured.items[0] || products.items[0];
  const heroBg = HERO_BG;
  const trending = featured.items.length > 0 ? featured.items : products.items.slice(0, 10);
  const newArrivals = products.items.slice(0, 12);
  const underBudget = [...products.items]
    .filter((p) => p.priceCents > 0)
    .sort((a, b) => a.priceCents - b.priceCents)
    .slice(0, 10);

  const productCounts = products.items.reduce<Record<string, number>>((acc, p) => {
    const slug = p.category?.slug || 'other';
    acc[slug] = (acc[slug] || 0) + 1;
    return acc;
  }, {});

  return (
    <>
      {/* ────────── HERO — Netflix.com/in landing-page style ────────── */}
      {hero && <Hero product={hero} bg={heroBg} proof={proof} />}

      {/* ────────── Service tiles ────────── */}
      <section className="mx-auto max-w-page px-3 py-6 sm:px-4 sm:py-10">
        <div className="mb-3 flex items-end justify-between sm:mb-5">
          <h2 className="text-base font-semibold sm:text-lg">All your favourite platforms</h2>
          <span className="text-xs text-text-muted">{SERVICE_TILES.length} services</span>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 md:grid-cols-6 lg:grid-cols-12">
          {SERVICE_TILES.map((tile) => (
            <div
              key={tile}
              className="flex h-14 items-center justify-center rounded-md border border-border bg-bg-elev-2 text-center text-xs font-semibold text-text transition-colors hover:border-border-strong hover:bg-bg-elev-3 sm:h-16 sm:text-sm"
            >
              {tile}
            </div>
          ))}
        </div>
      </section>

      {/* ────────── Trending rail ────────── */}
      <div id="trending" />
      <Rail eyebrow="Trending this week" title="Most ordered today" seeAllHref="#products">
        {trending.map((p) => (
          <RailItem key={p.id} className="w-[55vw] sm:w-[36vw] md:w-[220px] lg:w-[220px]">
            <ProductCard product={p} poster />
          </RailItem>
        ))}
      </Rail>

      {/* ────────── Under ₹199 rail ────────── */}
      {underBudget.length > 0 && (
        <Rail eyebrow="Smart picks" title="Under ₹199 — great value">
          {underBudget.map((p) => (
            <RailItem key={p.id} className="w-[55vw] sm:w-[36vw] md:w-[220px] lg:w-[220px]">
              <ProductCard product={p} poster />
            </RailItem>
          ))}
        </Rail>
      )}

      {/* ────────── Categories ────────── */}
      <section className="border-y border-border bg-bg-elev-1 py-8 sm:py-12">
        <div className="mx-auto max-w-page px-3 sm:px-4">
          <div className="mb-4 sm:mb-6">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">
              Browse by category
            </p>
            <h2 className="mt-1 text-xl font-semibold sm:text-2xl">Find what you actually want</h2>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5">
            {categories.map((c, i) => {
              const hue = CAT_HUES[i % CAT_HUES.length];
              return (
                <Link
                  key={c.id}
                  href={`/category/${c.slug}`}
                  className="group relative flex min-h-[84px] flex-col justify-between overflow-hidden rounded-lg border border-border p-3 transition-transform hover:-translate-y-0.5 sm:min-h-[92px] sm:p-3.5"
                  style={{ background: `linear-gradient(135deg, ${hue}, #0a0a0a)` }}
                >
                  {c.badge && (
                    <CategoryBadge
                      label={c.badge}
                      color={c.badgeColor}
                      className="absolute right-2 top-2 z-10"
                    />
                  )}
                  <div className="pr-10 text-sm font-semibold leading-tight text-white sm:text-base">
                    {c.name}
                  </div>
                  <div className="mt-2 text-[11px] font-medium text-white/65">
                    {productCounts[c.slug] || 0} plans
                  </div>
                  <div
                    aria-hidden
                    className="absolute -right-5 -top-5 h-16 w-16 rounded-full bg-white/10 blur-2xl transition-opacity group-hover:opacity-80"
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ────────── Newly added grid ────────── */}
      <section id="products" className="mx-auto max-w-page px-3 py-8 sm:px-4 sm:py-12">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2 sm:mb-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">
              Newly added
            </p>
            <h2 className="mt-1 text-xl font-semibold sm:text-2xl">Latest subscription deals</h2>
          </div>
          <Link
            href="/category/ott-plans"
            className="text-xs font-semibold text-text-muted hover:text-text sm:text-sm"
          >
            See all OTT →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <ComparisonBlock items={products.items.slice(0, 6)} />
      <WhyTrust proof={proof} />
      <Testimonials />

      {/* ────────── FAQ ────────── */}
      <section id="faq" className="mx-auto max-w-page px-3 py-8 sm:px-4 sm:py-12">
        <div className="mb-4 sm:mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">
            Questions, answered
          </p>
          <h2 className="mt-1 text-xl font-semibold sm:text-2xl">Before you buy</h2>
        </div>
        <div className="grid gap-2.5 sm:gap-3">
          {FAQS.map(([q, a]) => (
            <details key={q} className="group rounded-md border border-border bg-bg-elev-2 px-4 py-3 sm:px-5 sm:py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-text sm:text-base">
                {q}
                <ChevronDown className="h-4 w-4 shrink-0 text-text-muted transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-6 text-text-muted sm:text-[15px]">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ────────── Final CTA ────────── */}
      <section className="border-t border-border bg-bg-elev-1 px-3 py-10 sm:py-14">
        <div className="mx-auto flex max-w-page flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <div>
            <h2 className="text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
              Ready to start streaming?
            </h2>
            <p className="mt-2 text-sm text-text-muted sm:text-base">
              Pick your plan now, activate in minutes. Refund for Any Valid Issue.
            </p>
            <PaymentMethods className="mt-4" />
          </div>
          <Link href="#products" className="btn-accent w-full sm:w-auto">
            Browse all plans →
          </Link>
        </div>
      </section>
    </>
  );
}

// ─────────── Netflix-style Hero ──────────────────────────────────────────────

interface HeroProps {
  product: StreamHubProduct;
  /** Single cinematic background image URL — fills the hero behind content. */
  bg: string;
  proof: SocialProof;
}

function Hero({ product, bg, proof }: HeroProps) {
  const save = product.compareAtCents ? Math.max(product.compareAtCents - product.priceCents, 0) : 0;
  const savePct = product.compareAtCents ? Math.round((save / product.compareAtCents) * 100) : 0;

  return (
    <section
      className="relative isolate overflow-hidden bg-bg"
      style={{ minHeight: '78vh' }}
    >
      {/* ── Full-bleed cinematic background (Netflix-style app hero) ──
           Inline styles are used in addition to CSS classes so the hero
           renders even if Tailwind/CSS is being served stale. */}
      <div
        aria-hidden
        className="hero-bg"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          background:
            'radial-gradient(ellipse 80% 60% at 20% 35%, rgba(229,9,20,0.35) 0%, transparent 60%),' +
            'radial-gradient(ellipse 60% 50% at 80% 70%, rgba(124,29,29,0.45) 0%, transparent 55%),' +
            'radial-gradient(ellipse 50% 40% at 50% 0%, rgba(88,28,135,0.35) 0%, transparent 50%),' +
            'linear-gradient(160deg, #1a0a0a 0%, #0a0a0a 45%, #000000 100%)',
        }}
      />
      <div
        aria-hidden
        className="hero-bg-photo"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          backgroundImage: `url(${bg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          backgroundRepeat: 'no-repeat',
          opacity: 0.95,
        }}
      />

      {/* ── Red glow + heavy vignette ── */}
      <div
        aria-hidden
        className="hero-glow"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
          background:
            'radial-gradient(circle at 25% 75%, rgba(229,9,20,0.18) 0%, transparent 42%)',
        }}
      />
      <div
        aria-hidden
        className="hero-vignette"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 3,
          pointerEvents: 'none',
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.10) 25%, rgba(0,0,0,0.78) 78%, #000 100%),' +
            'linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.18) 55%, rgba(0,0,0,0) 100%)',
        }}
      />

      {/* ── Foreground content (Netflix landing layout) ── */}
      <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-page flex-col justify-end px-4 pb-12 pt-16 sm:min-h-[88vh] sm:px-6 sm:pb-16 sm:pt-40 lg:min-h-[92vh] lg:items-center lg:justify-center lg:py-24 lg:text-center">
        <div className="max-w-3xl lg:mx-auto">
          {product.badge && (
            <span className="badge-best mb-3 inline-flex sm:mb-4">
              <Sparkles className="mr-1 h-3 w-3" /> {product.badge}
            </span>
          )}

          {/* Headline — Netflix scale */}
          <h1 className="text-4xl font-bold leading-[1.02] tracking-tight text-white break-words drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)] sm:text-6xl md:text-7xl lg:text-[88px]">
            Premium OTT subscriptions.{' '}
            <br className="hidden sm:block" />
            <span className="text-accent">Honest prices.</span>
          </h1>

          <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-white/85 drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] sm:mt-6 sm:text-xl md:text-2xl lg:mx-auto">
            Netflix, Prime, Hotstar, Spotify and 50+ more — verified accounts,
            instant delivery, real human support.
          </p>

          {/* Trust ribbon — admin-controlled social proof */}
          <SocialProofRibbon proof={proof} tone="hero" className="mt-4 sm:mt-6 lg:justify-center" />

          {/* CTA */}
          <div className="mt-6 flex flex-col sm:mt-8 sm:flex-row lg:justify-center">
            <Link href="#products" className="btn-accent !h-14 !px-7 text-base">
              See all plans
            </Link>
          </div>

          {/* Featured product strip — Netflix-style "now playing" chip */}
          <div className="mt-8 sm:mt-10 lg:mx-auto lg:max-w-2xl">
            <div className="flex items-center gap-3 rounded-md border border-border-strong bg-black/55 p-3 backdrop-blur-md sm:gap-4 sm:p-4">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded sm:h-16 sm:w-16">
                {product.coverImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.coverImage}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1 text-left">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-accent sm:text-[11px]">
                  Today&apos;s top deal
                </div>
                <div className="truncate text-sm font-semibold text-white sm:text-base">
                  {product.name}
                </div>
                <div className="flex items-baseline gap-2 text-sm">
                  <span className="font-bold text-white">
                    {formatMoney(product.priceCents, product.currency)}
                  </span>
                  {product.compareAtCents && (
                    <>
                      <span className="text-xs text-white/50 line-through">
                        {formatMoney(product.compareAtCents, product.currency)}
                      </span>
                      {savePct > 0 && (
                        <span className="text-xs font-semibold text-success">
                          {savePct}% off
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
              <Link
                href={`/products/${product.slug}`}
                className="hidden h-10 items-center rounded-md border border-border-strong bg-white/10 px-3 text-xs font-semibold text-white hover:bg-white/15 sm:inline-flex"
              >
                Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────── Comparison ──────────────────────────────────────────────────────

function ComparisonBlock({ items }: { items: StreamHubProduct[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mx-auto max-w-page px-3 py-8 sm:px-4 sm:py-12">
      <div className="mb-4 sm:mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-success">
          Honest comparison
        </p>
        <h2 className="mt-1 text-xl font-semibold sm:text-2xl">
          Why pay official prices when ours are honest?
        </h2>
      </div>

      <div className="overflow-hidden rounded-md border border-border bg-bg-elev-2">
        <ul className="divide-y divide-border md:hidden">
          {items.map((p) => {
            const save = p.compareAtCents ? Math.max(p.compareAtCents - p.priceCents, 0) : 0;
            return (
              <li key={p.id} className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{p.name}</div>
                  <div className="text-xs text-text-muted">{p.durationDays || 30} days · {p.category?.name}</div>
                </div>
                <div className="text-right">
                  {p.compareAtCents && (
                    <div className="text-xs text-text-dim line-through">
                      {formatMoney(p.compareAtCents, p.currency)}
                    </div>
                  )}
                  <div className="text-base font-bold text-white">
                    {formatMoney(p.priceCents, p.currency)}
                  </div>
                  {save > 0 && (
                    <div className="text-[10px] font-semibold text-success">
                      save {formatMoney(save, p.currency)}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
        <table className="hidden w-full text-sm md:table">
          <thead className="bg-bg-elev-3 text-left text-xs uppercase tracking-wider text-text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Plan</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Validity</th>
              <th className="px-4 py-3 text-right font-semibold">Official</th>
              <th className="px-4 py-3 text-right font-semibold">StreamHub</th>
              <th className="px-4 py-3 text-right font-semibold">You save</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((p) => {
              const save = p.compareAtCents ? Math.max(p.compareAtCents - p.priceCents, 0) : 0;
              return (
                <tr key={p.id} className="hover:bg-bg-elev-3">
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-text-muted">{p.category?.name}</td>
                  <td className="px-4 py-3 text-text-muted">{p.durationDays || 30} days</td>
                  <td className="px-4 py-3 text-right text-text-dim line-through">
                    {p.compareAtCents ? formatMoney(p.compareAtCents, p.currency) : '—'}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-white">
                    {formatMoney(p.priceCents, p.currency)}
                  </td>
                  <td className="px-4 py-3 text-right text-success">
                    {save > 0 ? formatMoney(save, p.currency) : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ─────────── Why trust ────────────────────────────────────────────────────────

function WhyTrust({ proof }: { proof: SocialProof }) {
  const items = [
    { icon: ShieldCheck, value: plusCount(proof.orders),       label: 'orders delivered',                       sub: 'Across India' },
    { icon: Zap,         value: '< 10 min',                    label: 'average delivery',                       sub: '93% delivered instantly' },
    { icon: Award,       value: `${proof.rating} ★`,           label: `from ${compactCount(proof.reviews)} reviews`, sub: 'Verified buyer ratings' },
    { icon: IndianRupee, value: 'Lowest',                      label: 'price guarantee',                        sub: 'Find lower? We match it.' },
  ];

  return (
    <section className="border-y border-border bg-bg-elev-1 py-8 sm:py-12">
      <div className="mx-auto max-w-page px-3 sm:px-4">
        <div className="mb-5 text-center sm:mb-7">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">
            Why people pick StreamHub
          </p>
          <h2 className="mt-1 text-xl font-semibold sm:text-2xl">Numbers that earn the click</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {items.map(({ icon: Icon, value, label, sub }) => (
            <div key={label} className="rounded-md border border-border bg-bg-elev-2 p-4 text-center sm:p-5">
              <Icon className="mx-auto h-6 w-6 text-accent sm:h-7 sm:w-7" />
              <div className="mt-3 text-xl font-bold leading-none text-white sm:text-2xl">{value}</div>
              <div className="mt-1.5 text-sm font-medium text-text">{label}</div>
              <div className="mt-1 text-xs text-text-muted">{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────── Testimonials ────────────────────────────────────────────────────

function Testimonials() {
  return (
    <section className="mx-auto max-w-page px-3 py-8 sm:px-4 sm:py-12">
      <div className="mb-4 sm:mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">
          From real customers
        </p>
        <h2 className="mt-1 text-xl font-semibold sm:text-2xl">What buyers actually say</h2>
      </div>

      <div className="no-scrollbar -mx-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-3 sm:mx-0 sm:gap-4 sm:px-0 md:grid md:grid-cols-2 md:overflow-visible lg:grid-cols-4">
        {TESTIMONIALS.map((t) => (
          <article
            key={t.name}
            className="min-w-[80vw] snap-start rounded-md border border-border bg-bg-elev-2 p-5 sm:min-w-[60vw] md:min-w-0"
          >
            <RatingStars value={t.rating} size="sm" />
            <p className="mt-4 text-sm leading-relaxed text-text-muted">&ldquo;{t.quote}&rdquo;</p>
            <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-accent-soft text-sm font-semibold text-accent">
                {t.name[0]}
              </div>
              <div>
                <div className="text-sm font-semibold text-text">{t.name}</div>
                <div className="text-xs text-text-muted">{t.city} · Verified buyer</div>
              </div>
              <CheckCircle2 className="ml-auto h-4 w-4 text-success" />
            </div>
          </article>
        ))}
      </div>

      <div className="mt-5 flex justify-center sm:mt-6">
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-text-muted hover:text-text"
        >
          <MessageCircle className="h-4 w-4 text-whatsapp" />
          Not sure which plan? Chat with our team
        </a>
      </div>
    </section>
  );
}
