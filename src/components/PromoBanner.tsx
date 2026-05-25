import { getPromo } from '@/lib/api';

/** Optional storefront-wide promo bar, controlled from the admin settings. */
export default async function PromoBanner() {
  const { bannerEnabled, bannerText } = await getPromo();
  if (!bannerEnabled || !bannerText) return null;
  return (
    <div className="bg-accent text-white">
      <div className="mx-auto max-w-page px-3 py-2 text-center text-xs font-semibold tracking-wide sm:text-sm">
        {bannerText}
      </div>
    </div>
  );
}
