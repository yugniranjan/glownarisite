'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { trackGlownari } from '@/lib/analytics';

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const qs = window.location.search.replace(/^\?/, '');
    trackGlownari({ eventType: 'page_view', path: `${pathname}${qs ? `?${qs}` : ''}` });
  }, [pathname]);

  return null;
}
