import { getPromo } from '@/lib/api';

/** Optional storefront-wide promo bar, controlled from the admin settings. */
export default async function PromoBanner() {
  const { bannerEnabled, bannerText } = await getPromo();
  if (!bannerEnabled || !bannerText) return null;
  return (
    <div className="bg-accent text-white">
      <div className="site-container py-1.5 text-center text-[11px] font-semibold tracking-wide sm:text-xs">
        {bannerText}
      </div>
    </div>
  );
}
