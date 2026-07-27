import Link from 'next/link';
import {
  Clock3,
  HeartHandshake,
  MessageCircle,
  Search,
  Star,
  ShoppingBag,
  Tag,
  TicketPercent,
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import Rail, { RailItem } from '@/components/Rail';
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
  'https://images.unsplash.com/photo-1605292356183-a77d0a9c9d1d?w=1800&auto=format&fit=crop&q=85';
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918506965129';

export default async function HomePage() {
  const [categories, featured, products, promo, proof] = await Promise.all([
    getCategories(),
    getProducts({ featured: true, take: 12 }),
    getProducts({ take: 40 }),
    getPromo(),
    getSocialProof(),
  ]);
  const banners = await getBanners();
  const testimonials = await getTestimonials();

  const allProducts = products.items;
  const hero = featured.items[0] || allProducts[0];
  const trending = featured.items.length > 0 ? featured.items : allProducts.slice(0, 12);
  const budget = [...allProducts]
    .filter((product) => product.priceCents > 0)
    .sort((a, b) => a.priceCents - b.priceCents)
    .slice(0, 12);
  const latest = allProducts.slice(0, 16);

  const productCounts = allProducts.reduce<Record<string, number>>((acc, product) => {
    const slug = product.category?.slug || 'other';
    acc[slug] = (acc[slug] || 0) + 1;
    return acc;
  }, {});

  return (
    <>
      {banners.length > 0 && <HeroPromoSlider banners={banners} />}
      {hero && (
        <Hero
          product={hero}
          promo={promo}
        />
      )}
      <CategoryStrip categories={categories} productCounts={productCounts} />

      <div id="trending" />
      <div id="festival-products" />
      {trending.length > 0 && (
        <Rail
          eyebrow="Festival edit"
          title="Products in this sale"
          description="Celebration-ready favourites chosen for gifting, dressing up and everyday joy."
          seeAllHref="#products"
        >
          {trending.map((product) => (
            <RailItem key={product.id} className="w-[72vw] sm:w-[42vw] md:w-[224px] lg:w-[232px]">
              <ProductCard product={product} poster rating={proof.rating} reviewCount={proof.reviews} />
            </RailItem>
          ))}
        </Rail>
      )}

      {budget.length > 0 && (
        <Rail
          eyebrow="Beauty on budget"
          title="Best value finds"
          description="Useful little upgrades that feel special without stretching your budget."
        >
          {budget.map((product) => (
            <RailItem key={product.id} className="w-[72vw] sm:w-[42vw] md:w-[224px] lg:w-[232px]">
              <ProductCard product={product} poster rating={proof.rating} reviewCount={proof.reviews} />
            </RailItem>
          ))}
        </Rail>
      )}

      <PersonalShoppingHelp />

      {latest.length > 0 && <section id="products" className="site-container section-content">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-accent">
              Glownari collection
            </p>
            <h2 className="font-display mt-1 text-2xl sm:text-[32px]">Shop the look</h2>
            <p className="mt-1.5 max-w-xl text-xs leading-5 text-text-muted sm:text-sm">
              A mix of practical favourites and feel-good finds, all in one place.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-md border border-border bg-bg-elev-2 px-3 py-2 text-xs font-semibold text-text-muted">
            <Search className="h-4 w-4 text-accent" />
            {products.total || latest.length} products listed
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {latest.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              rating={proof.rating}
              reviewCount={proof.reviews}
            />
          ))}
        </div>
      </section>}

      {testimonials.length > 0 && <TestimonialsSection testimonials={testimonials} />}
    </>
  );
}

function PersonalShoppingHelp() {
  const message = encodeURIComponent(
    'Hi Glownari, I need help choosing a product. Can you suggest something for me?',
  );

  return (
    <section className="border-y border-border bg-bg-elev-3">
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
  const saleLabel = promo.heroSaleLabel || 'Diwali festival sale is live';

  return (
    <section className="bg-bg-elev-1 py-5 sm:py-6">
      <div className="site-container">
        <div
          className="relative min-h-[320px] overflow-hidden rounded-lg border border-border bg-bg-elev-3 bg-cover bg-center shadow-card sm:min-h-[338px]"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black/20 sm:hidden" />
          <div className="hero-copy-surface absolute inset-y-0 left-0 w-full sm:w-[64%] lg:w-[58%]" />

          <div className="relative z-10 flex min-h-[320px] max-w-[790px] flex-col justify-center px-5 py-6 sm:min-h-[338px] sm:px-10 lg:px-12">
            <div className="inline-flex w-fit max-w-full items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-accent sm:text-[11px]">
              <Tag className="h-3.5 w-3.5" />
              <span className="truncate">{saleLabel}</span>
            </div>
            <h1 className="font-display mt-3 max-w-[19ch] text-4xl leading-[1.04] text-text sm:text-5xl lg:text-[52px]">
              Premium festive deals on favourite products
            </h1>
            <p className="mt-3 max-w-lg text-sm font-medium leading-6 text-text-muted sm:text-base">
              Thoughtfully curated fashion, beauty, jewellery and gifting picks at prices worth celebrating.
            </p>

            <div className="mt-5 flex max-w-xl flex-wrap items-center gap-x-5 gap-y-3 border-y border-border py-3">
              <SaleChip icon={TicketPercent} label="Min. off" value={savePct > 0 ? `${savePct}%` : '45%'} />
              <SaleChip icon={Tag} label="Coupon" value="SALE50" />
              <SaleChip icon={Clock3} label="Ends in" value="2 days" />
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="#festival-products" className="inline-flex h-11 items-center justify-center rounded-md bg-accent px-6 text-sm font-bold text-white transition hover:bg-accent-strong">
                Shop sale
              </Link>
              <PendingLinkButton href={`/products/${product.slug}`} className="inline-flex h-11 items-center justify-center rounded-md border border-border-strong bg-bg-elev-1/80 px-6 text-sm font-bold text-text transition hover:border-accent hover:text-accent">
                View best deal
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
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-text-dim">{label}</div>
        <div className="text-sm font-black text-text">{value}</div>
      </div>
    </div>
  );
}

function CategoryStrip({
  categories,
  productCounts,
}: {
  categories: GlownariCategory[];
  productCounts: Record<string, number>;
}) {
  const visible = categories.filter((category) => (productCounts[category.slug] || 0) > 0).slice(0, 12);
  if (visible.length === 0) return null;
  return (
    <section className="border-b border-border bg-bg-elev-1">
      <div className="site-container py-5 sm:py-6">
        <div className="no-scrollbar flex snap-x justify-start gap-6 overflow-x-auto lg:justify-between">
          {visible.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group flex min-w-[86px] snap-start flex-col items-center text-center transition hover:text-accent sm:min-w-[96px]"
            >
              <span className="relative grid h-16 w-16 place-items-center overflow-hidden rounded-full border border-border bg-bg-elev-3 text-accent transition group-hover:border-accent">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <ShoppingBag className="h-5 w-5" strokeWidth={2.4} />
                )}
              </span>
              <span className="mt-2.5 line-clamp-1 text-xs font-bold text-text group-hover:text-accent sm:text-sm">{category.name}</span>
              <span className="mt-1 text-[10px] font-medium text-text-dim">
                {productCounts[category.slug] || 0} items
              </span>
            </Link>
          ))}
        </div>
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
