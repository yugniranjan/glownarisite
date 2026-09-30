import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ChevronRight,
  BadgeCheck,
  CheckCircle2,
  Headphones,
  MessageCircle,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  Tag,
  Truck,
} from 'lucide-react';
import { formatMoney, getProduct, getSocialProof } from '@/lib/api';
import PaymentMethods from '@/components/PaymentMethods';
import ProductAnalytics from '@/components/ProductAnalytics';
import ProductPurchaseActions from '@/components/ProductPurchaseActions';
import RatingStars from '@/components/RatingStars';
import ProductGallery from '@/components/ProductGallery';

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

  const message = encodeURIComponent(`Hi, I want to order ${product.name} from Glownari.`);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  const saving = product.compareAtCents
    ? Math.max(product.compareAtCents - product.priceCents, 0)
    : 0;
  const discount = product.compareAtCents
    ? Math.round((saving / product.compareAtCents) * 100)
    : 0;
  const highlights = [
    product.serviceType && `${product.serviceType} collection`,
    product.accountType,
    product.stockQuantity != null && `${product.stockQuantity} pieces available`,
    'Secure Razorpay checkout',
    'Order tracking included',
    'WhatsApp customer support',
  ].filter(Boolean) as string[];

  return (
    <>
      <ProductAnalytics
        productId={product.id}
        productSlug={product.slug}
        productName={product.name}
        priceCents={product.priceCents}
      />

      <main className="site-container pb-28 pt-7 sm:pt-9 lg:pb-14">
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs text-text-muted">
          <Link href="/" className="hover:text-accent">Home</Link><ChevronRight className="h-3 w-3" />
          <Link href="/#products" className="hover:text-accent">{product.category?.name || 'Products'}</Link><ChevronRight className="h-3 w-3" />
          <span aria-current="page" className="text-text">{product.name}</span>
        </nav>

        <section className="grid items-start gap-7 lg:grid-cols-[minmax(0,1.08fr)_minmax(390px,0.92fr)] lg:gap-12">
          <div className="min-w-0 lg:sticky lg:top-40">
            <div className="relative">
              <ProductGallery name={product.name} images={product.images?.length ? product.images : product.coverImage ? [product.coverImage] : []} />

              <div className="absolute left-4 top-4 flex flex-wrap gap-2 sm:left-5 sm:top-5">
                {discount > 0 && (
                  <span className="rounded-md bg-accent px-3 py-1.5 text-xs font-extrabold text-white">
                    {discount}% OFF
                  </span>
                )}
                {product.badge && (
                  <span className="rounded-md bg-text px-3 py-1.5 text-xs font-bold uppercase text-bg">
                    {product.badge}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-border bg-bg-elev-1 px-4 py-3 text-sm sm:px-5">
              <span className="inline-flex items-center gap-2 font-semibold text-text">
                <BadgeCheck className="h-4.5 w-4.5 text-success" />
                Quality checked
              </span>
              <span className="inline-flex items-center gap-2 text-text-muted">
                <Truck className="h-4.5 w-4.5 text-accent" />
                Free delivery
              </span>
            </div>
          </div>

          <div className="lg:pt-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-extrabold uppercase text-accent">
                {product.category?.name || 'Product'}
              </span>
              {product.badge && <span className="h-1 w-1 rounded-full bg-border" />}
              {product.badge && (
                <span className="text-xs font-bold uppercase text-text-muted">{product.badge}</span>
              )}
            </div>

            <h1 className="mt-3 font-display text-2xl font-semibold leading-tight text-text sm:text-3xl">
              {product.name}
            </h1>
            {product.shortDescription && (
              <p className="mt-3 max-w-2xl text-base leading-7 text-text-muted sm:text-lg">
                {product.shortDescription}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-border pb-5 text-sm">
              <RatingStars value={proof.rating} count={proof.reviews} compact size="sm" />
              <span className="text-xs text-text-muted">Store rating</span>
              <span className={`inline-flex items-center gap-1.5 font-semibold ${product.stockQuantity === 0 ? 'text-text-muted' : 'text-success'}`}>
                <CheckCircle2 className="h-4 w-4" />
                {product.stockQuantity === 0 ? 'Out of stock' : product.stockQuantity != null ? `${product.stockQuantity} in stock` : 'In stock'}
              </span>
            </div>

            <div className="py-5">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="text-3xl font-black text-text">
                  {formatMoney(product.priceCents, product.currency)}
                </span>
                {product.compareAtCents && (
                  <span className="text-base text-text-muted line-through">
                    {formatMoney(product.compareAtCents, product.currency)}
                  </span>
                )}
                {discount > 0 && <span className="font-bold text-success">{discount}% off</span>}
              </div>
              <p className="mt-1 text-xs text-text-muted">Inclusive of all taxes</p>
              {saving > 0 && (
                <p className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-success">
                  <Tag className="h-4 w-4" />
                  You save {formatMoney(saving, product.currency)} on this order
                </p>
              )}
            </div>

            <div className="divide-y divide-border border-y border-border">
              {discount > 0 && <div className="flex gap-3 py-3.5">
                <Tag className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <div>
                  <p className="text-sm font-bold text-text">Special price</p>
                  <p className="mt-0.5 text-sm text-text-muted">
                    The displayed discount is already applied.
                  </p>
                </div>
              </div>}
              <div className="flex gap-3 py-3.5">
                <Truck className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <div><p className="text-sm font-semibold text-text">Delivery across India</p><p className="mt-0.5 text-sm text-text-muted">Usually dispatched within 2–7 working days. <Link href="/shipping-policy" className="underline underline-offset-4 hover:text-accent">Shipping policy</Link></p></div>
              </div>
              <div className="flex gap-3 py-3.5">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                <div>
                  <p className="text-sm font-bold text-text">Secure payment</p>
                  <p className="mt-0.5 text-sm text-text-muted">
                    UPI, cards, wallets and netbanking via Razorpay.
                  </p>
                </div>
              </div>
            </div>

            <ProductPurchaseActions product={product} />

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
              <a
                href={whatsappUrl}
                className="inline-flex h-11 items-center gap-2 rounded-md border border-border px-4 text-sm font-bold text-text transition hover:border-success hover:text-success"
              >
                <MessageCircle className="h-4 w-4" />
                Ask before buying
              </a>
              <div className="min-w-[210px]">
                <PaymentMethods />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 border-y border-border py-10 lg:mt-16">
          <p className="text-xs font-extrabold uppercase text-accent">Why you will love it</p>
          <h2 className="mt-2 font-display text-2xl font-black text-text">Product highlights</h2>
          <div className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((highlight) => (
              <div key={highlight} className="flex items-start gap-3 text-sm leading-6 text-text">
                <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-success" />
                <span>{highlight}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_420px] lg:py-14">
          <div>
            <p className="text-xs font-extrabold uppercase text-accent">Know your product</p>
            <h2 className="mt-2 font-display text-2xl font-black text-text">About this product</h2>
            {product.description ? (
              <div
                className="prose-dark mt-4 max-w-3xl text-sm leading-7 text-text-muted sm:text-base"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            ) : (
              <p className="mt-4 text-text-muted">{product.shortDescription}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-6 border-border lg:border-l lg:pl-8">
            {[
              { icon: ShieldCheck, title: 'Secure pay', text: 'Razorpay protected' },
              { icon: PackageCheck, title: 'Order updates', text: 'Clear order status' },
              { icon: RefreshCw, title: 'Buyer care', text: 'Support after order' },
              { icon: Headphones, title: 'Human help', text: 'Real assistance' },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title}>
                <Icon className="h-5 w-5 text-accent" />
                <p className="mt-2 text-sm font-bold text-text">{title}</p>
                <p className="mt-1 text-xs leading-5 text-text-muted">{text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
