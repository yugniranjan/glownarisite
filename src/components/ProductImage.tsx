'use client';

import { useState } from 'react';
import { ImageOff } from 'lucide-react';

export default function ProductImage({ src, alt, className, loading }: { src: string; alt: string; className?: string; loading?: 'lazy' | 'eager' }) {
  const [failedSrc, setFailedSrc] = useState('');
  if (!src || failedSrc === src) return <span role="img" aria-label={`${alt || 'Product'} image unavailable`} className={`${className || ''} grid place-items-center bg-bg-elev-3 text-text-dim`}><ImageOff className="h-8 w-8" /></span>;
  return <img src={src} alt={alt} loading={loading} onError={() => setFailedSrc(src)} className={className} />;
}
