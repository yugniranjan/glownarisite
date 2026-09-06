import Link from 'next/link';
import {
  BadgePercent,
  Clock3,
  HeartHandshake,
  MessageCircle,
  MoveRight,
  Star,
  Tag,
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import PendingLinkButton from '@/components/PendingLinkButton';
import HeroPromoSlider from '@/components/HeroPromoSlider';
import {
  getBanners,
  getCategories,
  getProducts,
  getPromo,
  getSocialProof,
  getTestimonials,
  type PromoConfig,
  type GlownariCategory,
  type GlownariProduct,
  type GlownariTestimonial,
} from '@/lib/api';

export const revalidate = 60;

const FESTIVAL_BACKGROUND_IMAGE =
  process.env.NEXT_PUBLIC_FESTIVAL_BACKGROUND_IMAGE ||
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1800&auto=format&fit=crop&q=85';
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918506965129';

export default async function HomePage() {
  const [categories, featured, products, promo, proof, banners] = await Promise.all([
    getCategories(),
    getProducts({ featured: true, take: 12 }),
    getProducts({ take: 40 }),
    getPromo(),
    getSocialProof(),
    getBanners(),
  ]);
  const testimonials = await getTestimonials();

  const allProducts = products.items;
  const hero = featured.items[0] || allProducts[0];
  const saleProducts = (featured.items.length > 0 ? featured.items : allProducts).slice(0, 8);

  return (
    <>
      {hero && (
        <Hero
          product={hero}
          promo={promo}
        />
      )}
      <HeroPromoSlider banners={banners} />
      <CollectionCards categories={categories} products={allProducts} />

      <div id="festival-products" />
      {saleProducts.length > 0 && <section id="products" className="site-container section-content">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[12px] font-black uppercase tracking-[0.18em] text-accent">
              {promo.saleSectionEyebrow || 'Festival sale'}
            </p>
            <h2 className="font-display mt-1 text-3xl sm:text-[34px]">{promo.saleSectionTitle || 'Products in this sale'}</h2>
            <p className="mt-1.5 max-w-xl text-sm leading-6 text-text-muted sm:text-base">
              {promo.saleSectionSubtitle || 'Celebrate the season with our most loved earrings and rings.'}
            </p>
          </div>
          <Link href="#products" className="inline-flex items-center gap-2 text-sm font-bold text-text hover:text-accent">
            See all <MoveRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {saleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              rating={proof.rating}
              reviewCount={proof.reviews}
            />
          ))}
        </div>
      </section>}

      <PersonalShoppingHelp />

      {testimonials.length > 0 && <TestimonialsSection testimonials={testimonials} />}
    </>
  );
}

function PersonalShoppingHelp() {
  const message = encodeURIComponent(
    'Hi Glownari, I need help choosing a product. Can you suggest something for me?',
  );

  return (
    <section id="support" className="border-y border-border bg-bg-elev-3">
      <div className="site-container flex flex-col gap-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:py-8">
        <div className="flex items-start gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-bg-elev-1 text-accent">
            <HeartHandshake className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-accent">
              A little help, from a real person
            </p>
            <h2 className="font-display mt-1 text-xl text-text sm:text-2xl">
              Not sure what to pick?
            </h2>
            <p className="mt-1 max-w-xl text-sm leading-6 text-text-muted">
              Tell us the occasion, budget or who you are shopping for. We will help you narrow it down.
            </p>
          </div>
        </div>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-text px-5 text-sm font-bold text-bg transition hover:bg-accent hover:text-white"
        >
          <MessageCircle className="h-4 w-4" />
          Ask Glownari
        </a>
      </div>
    </section>
  );
}

function Hero({
  product,
  promo,
}: {
  product?: GlownariProduct;
  promo: PromoConfig;
}) {
  if (!product) return null;

  const save = product.compareAtCents ? Math.max(product.compareAtCents - product.priceCents, 0) : 0;
  const savePct = product.compareAtCents ? Math.round((save / product.compareAtCents) * 100) : 0;
  const backgroundImage = promo.heroBackgroundImage || FESTIVAL_BACKGROUND_IMAGE;
  const saleLabel = promo.heroSaleLabel || 'Ring festival sale is live';
  const title = promo.heroTitle || 'Elegant rings for every moment';
  const subtitle = promo.heroSubtitle || 'Discover beautifully crafted rings that add sparkle to your style. Premium quality, perfect for gifting or self-love.';
  const coupon = promo.heroCouponCode || 'RING50';
  const endsIn = promo.heroEndsInLabel || '2 days';

  return (
    <section className="bg-bg-elev-1 py-5 sm:py-6">
      <div className="site-container">
        <div
          className="relative min-h-[420px] overflow-hidden rounded-lg border border-border bg-bg-elev-3 bg-cover bg-center shadow-card sm:min-h-[486px]"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(253,250,251,0.98) 0%, rgba(253,250,251,0.92) 38%, rgba(253,250,251,0.20) 63%, rgba(253,250,251,0.02) 100%), url(${backgroundImage})`,
          }}
        >
          <div className="relative z-10 flex min-h-[420px] max-w-[640px] flex-col justify-center px-5 py-8 sm:min-h-[486px] sm:px-10 lg:px-14">
            <div className="inline-flex w-fit max-w-full items-center gap-2 text-[11px] font-black uppercase tracking-[0.20em] text-accent sm:text-[12px]">
              <Tag className="h-3.5 w-3.5" />
              <span className="truncate">{saleLabel}</span>
            </div>
            <h1 className="font-display mt-4 max-w-[12ch] text-5xl leading-[1.03] text-text sm:text-6xl lg:text-[72px]">
              {title}
            </h1>
            <p className="mt-5 max-w-xl text-base font-medium leading-7 text-text-muted sm:text-xl">
              {subtitle}
            </p>

            <div className="mt-6 flex max-w-xl flex-wrap items-center gap-x-6 gap-y-4 border-y border-border py-4">
              <SaleChip icon={BadgePercent} label="Min. off" value={savePct > 0 ? `${savePct}%` : '45%'} />
              <SaleChip icon={Tag} label="Coupon" value={coupon} />
              <SaleChip icon={Clock3} label="Ends in" value={endsIn} />
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              <Link href="#festival-products" className="inline-flex h-12 items-center justify-center rounded-md bg-accent px-7 text-base font-bold text-white shadow-cta transition hover:bg-accent-strong">
                Shop rings
              </Link>
              <PendingLinkButton href={`/products/${product.slug}`} className="inline-flex h-12 items-center justify-center rounded-md border border-border-strong bg-bg-elev-1/80 px-7 text-base font-bold text-text transition hover:border-accent hover:text-accent">
                View collection
              </PendingLinkButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SaleChip({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Tag;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-[112px] items-center gap-2.5">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-dim">{label}</div>
        <div className="text-base font-black text-text">{value}</div>
      </div>
    </div>
  );
}

function CollectionCards({
  categories,
  products,
}: {
  categories: GlownariCategory[];
  products: GlownariProduct[];
}) {
  const visible = categories
    .filter((category) => category.isActive)
    .slice(0, 6)
    .map((category) => {
      const fallbackImage = products.find((product) => product.category?.id === category.id)?.coverImage;
      return {
        ...category,
        image: category.image || fallbackImage || FESTIVAL_BACKGROUND_IMAGE,
      };
    });

  if (visible.length === 0) return null;

  return (
    <section className="bg-bg-elev-1 pb-4">
      <div className="site-container grid gap-5 lg:grid-cols-2">
        {visible.map((category) => (
          <Link
            key={category.id}
            id={category.slug}
            href={`/category/${category.slug}`}
            className="group relative min-h-[238px] overflow-hidden rounded-lg border border-border bg-bg-elev-3 bg-cover bg-center shadow-card transition hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-hover"
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(253,250,251,0.97) 0%, rgba(253,250,251,0.82) 40%, rgba(253,250,251,0.05) 82%), url(${category.image})`,
            }}
          >
            <div className="flex min-h-[238px] max-w-[430px] flex-col justify-center p-6 sm:p-8">
              <p className="text-[12px] font-black uppercase tracking-[0.20em] text-accent">Explore collection</p>
              <h2 className="font-display mt-2 text-4xl text-text sm:text-5xl">{category.name}</h2>
              {category.description && (
                <p className="mt-3 max-w-[34ch] text-base font-medium leading-7 text-text-muted">
                  {category.description}
                </p>
              )}
              <span className="mt-6 inline-flex h-12 w-fit items-center justify-center rounded-md bg-accent px-6 text-base font-bold text-white transition group-hover:bg-accent-strong">
                Shop {category.name.toLowerCase()}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function TestimonialsSection({ testimonials }: { testimonials: GlownariTestimonial[] }) {
  return (
    <section className="border-y border-border bg-bg-elev-1">
      <div className="site-container section-content">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">Customer stories</p>
            <h2 className="font-display mt-1 text-2xl sm:text-[32px]">Loved by Glownari shoppers</h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-elev-2 px-3 py-2 text-xs font-bold text-text-muted">
            <Star className="h-4 w-4 fill-accent text-accent" />
            Real reviews from admin
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {testimonials.slice(0, 6).map((item) => (
            <article key={item.id} className="flex min-h-[210px] flex-col justify-between border-t border-border bg-bg-elev-2 px-1 py-5 sm:px-4">
              <div>
                <div className="flex items-center gap-3">
                  {item.image ? (
                    <img src={item.image} alt="" className="h-12 w-12 rounded-full object-cover" />
                  ) : (
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-accent-soft text-sm font-black text-accent">
                      {item.customerName.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="truncate font-black text-text">{item.customerName}</div>
                    <div className="truncate text-xs font-semibold text-text-muted">
                      {[item.location, item.productLabel].filter(Boolean).join(' · ') || 'Verified shopper'}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className={`h-4 w-4 ${index < Math.round(item.rating) ? 'fill-accent text-accent' : 'text-text-dim'}`}
                    />
                  ))}
                </div>
                <p className="mt-3 text-sm font-medium leading-6 text-text-muted">“{item.quote}”</p>
              </div>
              <div className="mt-4 text-xs font-black uppercase tracking-wide text-accent">Verified purchase</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
