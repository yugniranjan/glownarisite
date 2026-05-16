import { Star } from 'lucide-react';

interface Props {
  /** 0–5, decimals allowed (e.g. 4.6). */
  value: number;
  /** Number of reviews, shown as "(8.2k)" etc. */
  count?: number;
  size?: 'xs' | 'sm' | 'md';
  /** Inline compact "4.8 ★ (8.2k)" — no star row. */
  compact?: boolean;
}

function fmtCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return n.toString();
}

const SIZE: Record<NonNullable<Props['size']>, string> = {
  xs: 'h-3 w-3',
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
};

export default function RatingStars({ value, count, size = 'sm', compact }: Props) {
  const rounded = Math.round(value * 10) / 10;

  if (compact) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-text">
        <Star className={`${SIZE[size]} fill-accent text-accent`} />
        <span>{rounded.toFixed(1)}</span>
        {typeof count === 'number' && (
          <span className="font-medium text-text-muted">({fmtCount(count)})</span>
        )}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="flex items-center gap-0.5" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => {
          const filled = i + 1 <= Math.floor(value);
          const half = !filled && i + 0.5 <= value;
          return (
            <Star
              key={i}
              className={`${SIZE[size]} ${
                filled || half ? 'fill-accent text-accent' : 'text-text-dim'
              }`}
            />
          );
        })}
      </span>
      <span className="text-xs font-semibold text-text">{rounded.toFixed(1)}</span>
      {typeof count === 'number' && (
        <span className="text-xs text-text-muted">({fmtCount(count)} reviews)</span>
      )}
    </span>
  );
}
