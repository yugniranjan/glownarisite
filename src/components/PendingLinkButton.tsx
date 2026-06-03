'use client';

import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

type Props = {
  href: string;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
};

export default function PendingLinkButton({ href, className = '', children, ariaLabel }: Props) {
  const [pending, setPending] = useState(false);

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      aria-busy={pending}
      onClick={(event) => {
        if (
          event.defaultPrevented ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          event.button !== 0
        ) {
          return;
        }
        setPending(true);
      }}
      className={`${className} relative overflow-hidden`}
    >
      <span className={pending ? 'invisible' : ''}>{children}</span>
      {pending && (
        <span className="absolute inset-0 grid place-items-center">
          <Loader2 className="h-4 w-4 animate-spin" />
        </span>
      )}
    </Link>
  );
}
