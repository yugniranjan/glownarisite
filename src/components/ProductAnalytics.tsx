'use client';

import { useEffect } from 'react';
import { trackGlownari } from '@/lib/analytics';

export default function ProductAnalytics({
  productId,
  productSlug,
  productName,
  priceCents,
}: {
  productId: string;
  productSlug: string;
  productName: string;
  priceCents: number;
}) {
  useEffect(() => {
    trackGlownari({
      eventType: 'product_view',
      productId,
      productSlug,
      productName,
      metadata: { priceCents },
    });
  }, [productId, productSlug, productName, priceCents]);

  return null;
}
