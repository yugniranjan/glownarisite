'use client';

import { useEffect } from 'react';
import { trackStreamHub } from '@/lib/analytics';

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
    trackStreamHub({
      eventType: 'product_view',
      productId,
      productSlug,
      productName,
      metadata: { priceCents },
    });
  }, [productId, productSlug, productName, priceCents]);

  return null;
}
