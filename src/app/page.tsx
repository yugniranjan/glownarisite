import Link from 'next/link';
import {
  Package,
  Search,
  Sparkles,
  Star,
  ShoppingBag,
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import Rail, { RailItem } from '@/components/Rail';
import CategoryBadge from '@/components/CategoryBadge';
import PendingLinkButton from '@/components/PendingLinkButton';
import HeroPromoSlider from '@/components/HeroPromoSlider';
import {
  compactCount,
  formatMoney,
  getBanners,
  getCategories,
  getProducts,
  getPromo,
  getSocialProof,
  getTestimonials,
  plusCount,
  type PromoConfig,
  type SocialProof,
  type GlownariCategory,
  type GlownariProduct,
  type GlownariTestimonial,
} from '@/lib/api';

export const revalidate = 60;

const FESTIVAL_BACKGROUND_IMAGE =
  process.env.NEXT_PUBLIC_FESTIVAL_BACKGROUND_IMAGE ||
  'https://images.unsplash.com/photo-1605292356183-a77d0a9c9d1d?w=1800&auto=format&fit=crop&q=85';

export default async function HomePage() {
  const [categories, featured, products, proof, promo] = await Promise.all([
    getCategories(),
    getProducts({ featured: true, take: 12 }),
    getProducts({ take: 40 }),
    getSocialProof(),
    getPromo(),
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
          proof={proof}
          totalProducts={products.total || allProducts.length}
          saleProducts={trending.slice(0, 10)}
          promo={promo}
        />
      )}
      <CategoryStrip categories={categories} productCounts={productCounts} />

      <div id="trending" />
      {trending.length > 0 && (
        <Rail eyebrow="Limited-time picks" title="Today&apos;s scrolling deals" seeAllHref="#products">
          {trending.map((product) => (
            <RailItem key={product.id} className="w-[64vw] sm:w-[34vw] md:w-[220px] lg:w-[230px]">
              <ProductCard product={product} poster />
            </RailItem>
          ))}
        </Rail>
      )}

      {budget.length > 0 && (
        <Rail eyebrow="Smart shopping" title="Best value products">
          {budget.map((product) => (
            <RailItem key={product.id} className="w-[64vw] sm:w-[34vw] md:w-[220px] lg:w-[230px]">
              <ProductCard product={product} poster />
            </RailItem>
          ))}
        </Rail>
      )}

      {latest.length > 0 && <section id="products" className="mx-auto max-w-page px-3 py-8 sm:px-4 sm:py-12">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3 sm:mb-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">
              Fresh collection
            </p>
            <h2 className="mt-1 text-xl font-bold sm:text-3xl">Recommended for your store</h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-md border border-border bg-bg-elev-2 px-3 py-2 text-xs font-semibold text-text-muted">
            <Search className="h-4 w-4 text-accent" />
            {products.total || latest.length} products listed
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {latest.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>}

      {testimonials.length > 0 && <TestimonialsSection testimonials={testimonials} />}
    </>
  );
}

function Hero({
  product,
  proof,
  totalProducts,
  saleProducts,
  promo,
}: {
  product?: GlownariProduct;
  proof: SocialProof;
  totalProducts: number;
  saleProducts: GlownariProduct[];
  promo: PromoConfig;
}) {
  if (!product) return null;

  const save = product.compareAtCents ? Math.max(product.compareAtCents - product.priceCents, 0) : 0;
  const savePct = product.compareAtCents ? Math.round((save / product.compareAtCents) * 100) : 0;
  const productsForSale = saleProducts.length > 0 ? saleProducts : [product];
  const backgroundImage = promo.heroBackgroundImage || FESTIVAL_BACKGROUND_IMAGE;
  const saleLabel = promo.heroSaleLabel || 'Diwali festival sale is live';

  return (
    <section className="bg-[linear-gradient(180deg,#f4f4f6_0%,var(--bg)_100%)] py-2 dark:bg-[linear-gradient(180deg,#18181c_0%,var(--bg)_100%)]">
      <div className="mx-auto max-w-page px-2 py-2 sm:px-4 sm:py-4">
        <div
          className="relative overflow-hidden rounded-xl border border-white/15 bg-[#18181c] bg-cover bg-center shadow-card"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,10,20,0.88)_0%,rgba(8,17,31,0.72)_44%,rgba(20,15,35,0.44)_100%)]" />
          <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_70%_20%,rgba(252,39,121,0.28),transparent_14rem),radial-gradient(circle_at_88%_85%,rgba(255,255,255,0.18),transparent_16rem)] lg:block" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(0deg,rgba(252,39,121,0.14),transparent)]" />

          <div className="relative z-10 grid min-w-0 items-stretch gap-3 p-3 sm:gap-4 sm:p-5 lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,0.8fr)] lg:p-5">
            <div className="flex min-w-0 flex-col justify-between lg:min-h-[354px]">
              <div>
              <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/25 bg-white/12 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-rose-100 sm:text-[11px]">
                <Sparkles className="h-3.5 w-3.5 text-rose-100" />
                <span className="truncate">{saleLabel}</span>
              </div>
              <h1 className="mt-3 max-w-2xl text-3xl font-black leading-[1.04] text-white sm:text-5xl">
                Premium festive deals on favourite products
              </h1>
              <p className="mt-2 max-w-xl text-sm font-medium leading-5 text-slate-200 sm:mt-3 sm:leading-6">
                Diwali campaign background, scrolling product cards, cart, coupons, Razorpay checkout, and order tracking.
              </p>

              <div className="mt-3 grid max-w-xl grid-cols-3 gap-1.5 sm:mt-4 sm:gap-2">
                <SaleChip label="Min. off" value={savePct > 0 ? `${savePct}%` : '45%'} />
                <SaleChip label="Coupon" value="SALE50" />
                <SaleChip label="Ends in" value="2 days" />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:flex sm:flex-row">
                <Link href="#festival-products" className="inline-flex h-10 items-center justify-center rounded-md bg-white px-5 text-sm font-black text-text shadow-[0_10px_28px_rgba(255,255,255,0.18)] transition hover:-translate-y-0.5 hover:bg-[#fff4f8]">
                  Shop sale
                </Link>
                <PendingLinkButton href={`/products/${product.slug}`} className="inline-flex h-10 items-center justify-center rounded-md border border-white/20 bg-white/10 px-5 text-sm font-black text-white backdrop-blur transition hover:bg-white/15">
                  View best deal
                </PendingLinkButton>
              </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-1.5 sm:mt-4 sm:max-w-lg sm:gap-2">
                <Metric label="Products" value={compactCount(totalProducts)} />
                <Metric label="Orders" value={plusCount(proof.orders)} />
                <Metric label="Rating" value={proof.rating.toFixed(1)} />
              </div>
            </div>

            <div className="min-w-0 overflow-hidden rounded-xl border border-white/5 bg-black/28 p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_18px_46px_rgba(0,0,0,0.30)] backdrop-blur-xl sm:p-3 lg:h-full">
              <div className="flex items-start justify-between gap-3 px-1 pb-2">
                <div className="min-w-0">
                  <p className="truncate text-[10px] font-black uppercase tracking-[0.16em] text-rose-100 sm:text-[11px]">Scrolling festival picks</p>
                  <h2 className="mt-0.5 text-base font-black text-white sm:text-lg">Products in this sale</h2>
                </div>
                <div className="rounded-md bg-accent px-3 py-1 text-xs font-black text-white shadow-cta">LIVE</div>
              </div>
              <div id="festival-products" className="no-scrollbar flex max-w-full snap-x gap-2 overflow-x-auto pb-1 sm:gap-3">
                {productsForSale.map((saleProduct) => (
                  <FestivalProductCard key={saleProduct.id} product={saleProduct} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FestivalProductCard({ product }: { product: GlownariProduct }) {
  const save = product.compareAtCents ? Math.max(product.compareAtCents - product.priceCents, 0) : 0;
  const savePct = product.compareAtCents ? Math.round((save / product.compareAtCents) * 100) : 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group min-w-[126px] snap-start overflow-hidden rounded-lg border border-white/16 bg-white text-slate-950 shadow-[0_14px_34px_rgba(0,0,0,0.28)] transition hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(0,0,0,0.36)] sm:min-w-[158px]"
    >
      <div className="relative aspect-square bg-slate-100">
        {product.coverImage ? (
          <img src={product.coverImage} alt={product.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
        ) : (
          <div className="grid h-full place-items-center bg-slate-100">
            <Package className="h-8 w-8 text-slate-400" />
          </div>
        )}
        {savePct > 0 && <span className="absolute left-1.5 top-1.5 rounded-md bg-accent px-1.5 py-0.5 text-[10px] font-black text-white shadow-sm sm:left-2 sm:top-2 sm:px-2 sm:py-1 sm:text-[11px]">{savePct}% OFF</span>}
      </div>
      <div className="p-2 sm:p-2.5">
        <div className="line-clamp-2 min-h-[34px] text-xs font-black leading-tight text-slate-950 sm:min-h-[36px] sm:text-sm">{product.name}</div>
        <div className="mt-2 flex items-end justify-between gap-2">
          <div>
            <div className="text-sm font-black text-slate-950 sm:text-base">{formatMoney(product.priceCents, product.currency)}</div>
            {product.compareAtCents && (
              <div className="text-xs font-semibold text-slate-500 line-through">
                {formatMoney(product.compareAtCents, product.currency)}
              </div>
            )}
          </div>
          <span className="rounded-md border border-accent/15 bg-accent-soft px-1.5 py-1 text-[10px] font-black text-accent sm:px-2 sm:text-[11px]">ADD</span>
        </div>
        {save > 0 && <div className="mt-1.5 text-[11px] font-black text-emerald-700">Save {formatMoney(save, product.currency)}</div>}
      </div>
    </Link>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/10 px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_10px_26px_rgba(0,0,0,0.18)] backdrop-blur">
      <div className="text-lg font-black text-white">{value}</div>
      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-300">{label}</div>
    </div>
  );
}

function SaleChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/10 px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_10px_26px_rgba(0,0,0,0.18)] backdrop-blur">
      <div className="text-[10px] font-black uppercase tracking-wide text-rose-200">{label}</div>
      <div className="mt-0.5 text-sm font-black text-white sm:text-base">{value}</div>
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
    <section className="border-y border-border bg-bg-elev-1">
      <div className="mx-auto max-w-page px-3 py-3 sm:px-4">
        <div className="no-scrollbar flex snap-x gap-3 overflow-x-auto">
          {visible.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group relative flex min-h-[126px] min-w-[142px] snap-start flex-col justify-end overflow-hidden rounded-lg border border-border bg-bg-elev-2 p-3 text-left shadow-card transition hover:-translate-y-0.5 hover:border-accent/35 sm:min-w-[166px]"
            >
              {category.image ? (
                <>
                  <img
                    src={category.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0.28)_48%,rgba(0,0,0,0.74)_100%)]" />
                </>
              ) : (
                <span className="absolute left-3 top-3 grid h-11 w-11 place-items-center rounded-full bg-marketplace-chip text-accent">
                  <ShoppingBag className="h-5 w-5" />
                </span>
              )}
              <div className="relative z-10">
                {category.badge && <CategoryBadge label={category.badge} color={category.badgeColor} className="mb-2" />}
                <span className={`line-clamp-1 text-sm font-black ${category.image ? 'text-white' : 'text-text'}`}>{category.name}</span>
                <span className={`mt-0.5 block text-[11px] font-semibold ${category.image ? 'text-white/82' : 'text-text-muted'}`}>
                  {productCounts[category.slug] || 0} items
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection({ testimonials }: { testimonials: GlownariTestimonial[] }) {
  return (
    <section className="border-y border-border bg-bg-elev-1 py-8 sm:py-10">
      <div className="mx-auto max-w-page px-3 sm:px-4">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">Customer stories</p>
            <h2 className="mt-1 text-2xl font-black sm:text-3xl">Loved by Glownari shoppers</h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-elev-2 px-3 py-2 text-xs font-bold text-text-muted">
            <Star className="h-4 w-4 fill-accent text-accent" />
            Real reviews from admin
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {testimonials.slice(0, 6).map((item) => (
            <article key={item.id} className="flex min-h-[220px] flex-col justify-between rounded-xl border border-border bg-bg-elev-2 p-4 shadow-card">
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
