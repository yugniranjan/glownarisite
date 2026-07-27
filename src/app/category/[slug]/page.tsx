import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Star } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import CategoryBadge from '@/components/CategoryBadge';
import { getCategories, getProducts, getSocialProof } from '@/lib/api';

type CategoryPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);
  return {
    title: category ? `${category.name} products` : 'Category',
    description:
      category?.description || `Browse ${category?.name || 'Glownari'} products.`,
  };
}

const HUES = ['#7c1d1d', '#1e3a8a', '#0f3b3b', '#581c87', '#7c2d12', '#831843'];

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const [categories, products, proof] = await Promise.all([
    getCategories(),
    getProducts({ categorySlug: slug, take: 36 }),
    getSocialProof(),
  ]);
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const idx = categories.findIndex((c) => c.id === category.id);
  const hue = HUES[idx % HUES.length] || HUES[0];

  return (
    <>
      {/* ─────── Hero ─────── */}
      <section
        className="relative py-8 sm:py-12"
        style={{ background: `linear-gradient(135deg, ${hue}99, transparent 60%), var(--bg-elev-1)` }}
      >
        <div className="site-container">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text sm:text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back home
          </Link>

          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
            <div>
              {category.badge && (
                <CategoryBadge label={category.badge} color={category.badgeColor} className="mb-2" />
              )}
              <p className="text-[11px] font-semibold uppercase tracking-wider text-white/85">
                Category
              </p>
              <h1 className="mt-1 text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
                {category.name}
              </h1>
              {category.description && (
                <p className="mt-2 max-w-2xl text-sm text-text-muted sm:text-base">
                  {category.description}
                </p>
              )}
            </div>
            <span className="pill inline-flex w-max items-center gap-1.5">
              <Star className="h-4 w-4 text-accent" />
              {products.total} {products.total === 1 ? 'product' : 'products'}
            </span>
          </div>
        </div>
      </section>

      {/* ─────── Filter chips (horizontal scroll on mobile, wrap on desktop) ─────── */}
      <section className="border-y border-border bg-bg sticky top-16 z-20">
        <div className="site-container">
          <div className="no-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto py-3.5 sm:flex-wrap sm:overflow-visible">
            <Chip href="/" active={false}>All</Chip>
            {categories.map((c) => (
              <Chip key={c.id} href={`/category/${c.slug}`} active={c.id === category.id}>
                {c.name}
              </Chip>
            ))}
          </div>
        </div>
      </section>

      {/* ─────── Products grid ─────── */}
      <section className="site-container page-content">
        {products.items.length === 0 ? (
          <div className="rounded-xl border border-border bg-bg-elev-2 p-10 text-center text-text-muted">
            No products in this category yet. Try a different category from above.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {products.items.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                rating={proof.rating}
                reviewCount={proof.reviews}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function Chip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex shrink-0 snap-start items-center rounded-full border px-4 py-2 text-xs font-semibold sm:text-sm ${
        active
          ? 'border-accent bg-accent text-white'
          : 'border-border bg-bg-elev-2 text-text-muted hover:border-border-strong hover:text-text'
      }`}
    >
      {children}
    </Link>
  );
}
