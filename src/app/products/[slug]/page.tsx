import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Clock3,
  CreditCard,
  Headphones,
  MessageCircle,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Tag,
  Users,
  Zap,
} from 'lucide-react';
import { formatMoney, getProduct, getSocialProof, plusCount } from '@/lib/api';
import RatingStars from '@/components/RatingStars';
import PaymentMethods from '@/components/PaymentMethods';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918506965129';

type ProductPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: product.metaTitle || product.name,
    description: product.metaDescription || product.shortDescription || undefined,
    openGraph: {
      title: product.name,
      description: product.shortDescription || undefined,
      images: product.coverImage ? [product.coverImage] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const [product, proof] = await Promise.all([getProduct(slug), getSocialProof()]);
  if (!product) notFound();

  const message = encodeURIComponent(`Hi, I want to order ${product.name} from StreamHub.`);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  const save = product.compareAtCents ? Math.max(product.compareAtCents - product.priceCents, 0) : 0;
  const savePct = product.compareAtCents ? Math.round((save / product.compareAtCents) * 100) : 0;

  return (
    <>
      {/* Back link */}
      <div className="mx-auto max-w-page px-3 pt-4 sm:px-4 sm:pt-6">
        <Link
          href="/#products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text sm:text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all plans
        </Link>
      </div>

      <article className="mx-auto max-w-page px-3 pb-32 pt-3 sm:px-4 sm:pb-12 sm:pt-4">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_400px] lg:gap-10">
          {/* ─────── Left: gallery + content ─────── */}
          <div>
            {/* Hero image */}
            <div className="poster-card aspect-video sm:aspect-[16/9]">
              {product.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.coverImage}
                  alt={product.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,184,0,0.3),transparent_50%),var(--bg-elev-3)]" />
              )}
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              <div className="absolute left-3 top-3 flex flex-wrap gap-1.5 sm:left-4 sm:top-4">
                {product.badge && <span className="badge-best">{product.badge}</span>}
                {savePct >= 20 && <span className="badge-off">{savePct}% OFF</span>}
              </div>
            </div>

            {/* Title block */}
            <div className="mt-5 sm:mt-7">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-accent sm:text-xs">
                {product.category?.name || 'Premium plan'}
              </p>
              <h1 className="mt-2 text-2xl font-bold leading-tight tracking-tight sm:text-4xl">
                {product.name}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                <RatingStars value={proof.rating} count={proof.reviews} compact size="sm" />
                <span className="flex items-center gap-1.5 text-xs text-text-muted">
                  <Users className="h-3.5 w-3.5 text-info" />
                  {plusCount(proof.orders)} delivered
                </span>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-success">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {product.stockQuantity && product.stockQuantity > 0 ? 'In stock' : 'Available'}
                </span>
              </div>
            </div>

            {/* Mobile-only inline price block (since sidebar is hidden on mobile until sticky bar appears) */}
            <div className="mt-5 rounded-xl border border-border bg-bg-elev-2 p-4 lg:hidden">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-text">
                  {formatMoney(product.priceCents, product.currency)}
                </span>
                {product.compareAtCents && (
                  <span className="text-sm text-text-muted line-through">
                    {formatMoney(product.compareAtCents, product.currency)}
                  </span>
                )}
              </div>
              {save > 0 && (
                <div className="mt-1.5 text-sm font-semibold text-success">
                  You save {formatMoney(save, product.currency)} ({savePct}% off)
                </div>
              )}
            </div>

            {/* What you get */}
            <div className="mt-6 rounded-xl border border-border bg-bg-elev-2 p-4 sm:mt-8 sm:p-6">
              <h2 className="text-base font-semibold sm:text-lg">What you get</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {[
                  product.serviceType && `${product.serviceType}`,
                  product.accountType && `${product.accountType}`,
                  product.durationDays && `${product.durationDays} days validity`,
                  'Instant delivery on WhatsApp',
                  'Refund for Any Valid Issue',
                  '24×7 chat support',
                ]
                  .filter(Boolean)
                  .map((line) => (
                    <li key={String(line)} className="flex items-start gap-2 text-sm text-text-muted">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      {line}
                    </li>
                  ))}
              </ul>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mt-6 rounded-xl border border-border bg-bg-elev-2 p-4 sm:mt-8 sm:p-6">
                <h2 className="text-base font-semibold sm:text-lg">About this plan</h2>
                <div
                  className="prose-dark mt-3 text-sm sm:text-[15px]"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            )}

            {/* Trust badges grid */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:grid-cols-4 sm:gap-4">
              {[
                { icon: ShieldCheck, label: '100% safe' },
                { icon: Zap,         label: 'Instant activation' },
                { icon: RefreshCw,   label: 'Refund for Any Valid Issue' },
                { icon: Headphones,  label: '24×7 support' },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-2 rounded-xl border border-border bg-bg-elev-2 p-3 text-center sm:p-4"
                >
                  <Icon className="h-5 w-5 text-success sm:h-6 sm:w-6" />
                  <span className="text-xs font-semibold sm:text-sm">{label}</span>
                </div>
              ))}
            </div>

            {/* How delivery works */}
            <div className="mt-6 rounded-xl border border-border bg-bg-elev-2 p-4 sm:mt-8 sm:p-6">
              <h2 className="text-base font-semibold sm:text-lg">How delivery works</h2>
              <ol className="mt-4 space-y-3 text-sm text-text-muted">
                {[
                  { t: 'Tap Buy now', d: 'Fill 3 fields — name, phone, email. Takes 20 seconds.' },
                  { t: 'Pay securely', d: 'UPI, cards. SSL-encrypted payment gateway.' },
                  { t: 'Get your account', d: 'Login details arrive on WhatsApp + email. Usually within 10 minutes.' },
                  { t: 'Start streaming', d: 'Use immediately. Any valid issue? We refund you.' },
                ].map((s, i) => (
                  <li key={s.t} className="flex gap-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent-soft text-xs font-bold text-accent">
                      {i + 1}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-text">{s.t}</div>
                      <div className="text-xs leading-relaxed sm:text-sm">{s.d}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* ─────── Right: sticky purchase panel (desktop only) ─────── */}
          <aside className="hidden lg:sticky lg:top-32 lg:block lg:h-max">
            <div className="rounded-xl border border-border bg-bg-elev-2 p-5 shadow-soft">
              {product.badge && (
                <span className="badge-best mb-3 inline-flex">{product.badge}</span>
              )}
              <div className="rounded-lg border border-border bg-bg-elev-1 p-4">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-text-dim">
                  StreamHub price
                </div>
                <div className="mt-1 flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-text">
                    {formatMoney(product.priceCents, product.currency)}
                  </span>
                  {product.compareAtCents && (
                    <span className="text-sm text-text-muted line-through">
                      {formatMoney(product.compareAtCents, product.currency)}
                    </span>
                  )}
                </div>
                {save > 0 && (
                  <div className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-success">
                    <Tag className="h-3.5 w-3.5" />
                    Save {formatMoney(save, product.currency)} ({savePct}%)
                  </div>
                )}
              </div>

              <dl className="mt-5 space-y-3 text-sm">
                {product.serviceType && (
                  <Row label="Service" value={product.serviceType} />
                )}
                {product.accountType && <Row label="Type" value={product.accountType} />}
                {product.durationDays && <Row label="Validity" value={`${product.durationDays} days`} />}
                <Row
                  label="Delivery"
                  value={
                    <span className="inline-flex items-center gap-1 text-success">
                      <Zap className="h-3.5 w-3.5" />
                      Instant
                    </span>
                  }
                />
              </dl>

              <Link
                href={`/checkout?product=${product.slug}`}
                className="btn-accent mt-5 w-full"
              >
                Buy now — {formatMoney(product.priceCents, product.currency)}
              </Link>
              <a href={whatsappUrl} className="btn-whatsapp mt-2 w-full">
                <MessageCircle className="h-4 w-4" />
                Chat to buy
              </a>

              <div className="mt-5 border-t border-border pt-4">
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-dim">
                  Payment options
                </div>
                <PaymentMethods />
              </div>

              <div className="mt-4 flex items-start gap-2 rounded-lg bg-success-soft p-3 text-xs text-success">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  <strong>Refund for Any Valid Issue.</strong> If your account stops working,
                  message us and we&apos;ll refund you.
                </span>
              </div>
            </div>
          </aside>
        </div>
      </article>

      {/* ─────── Sticky bottom buy bar (mobile only) ─────── */}
      <div
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-bg-elev-1/95 backdrop-blur lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0)' }}
      >
        <div className="mx-auto flex max-w-page items-center gap-3 px-3 py-3">
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-text-dim">
              StreamHub
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-text">
                {formatMoney(product.priceCents, product.currency)}
              </span>
              {savePct > 0 && (
                <span className="text-xs font-semibold text-success">{savePct}% off</span>
              )}
            </div>
          </div>
          <a
            href={whatsappUrl}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-border bg-bg-glass text-whatsapp"
            aria-label="Chat to buy"
          >
            <MessageCircle className="h-5 w-5" />
          </a>
          <Link
            href={`/checkout?product=${product.slug}`}
            className="btn-accent h-11 flex-1 !px-4 text-[14px]"
          >
            Buy now
          </Link>
        </div>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-text-muted">{label}</dt>
      <dd className="font-semibold text-text">{value}</dd>
    </div>
  );
}
