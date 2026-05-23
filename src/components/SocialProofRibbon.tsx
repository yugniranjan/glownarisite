import { Star, Users, Zap } from 'lucide-react';
import { compactCount, plusCount, type SocialProof } from '@/lib/api';

const TONES = {
  hero: { text: 'text-white/85 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]', sep: 'text-white/30' },
  muted: { text: 'text-text-muted', sep: 'text-text-dim' },
} as const;

/**
 * The social-proof ribbon shown across the site (hero, product pages, etc.).
 * All numbers come from admin-controlled settings via getSocialProof().
 */
export default function SocialProofRibbon({
  proof,
  tone = 'muted',
  className = '',
}: {
  proof: SocialProof;
  tone?: keyof typeof TONES;
  className?: string;
}) {
  const t = TONES[tone];
  return (
    <div
      className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium sm:text-sm ${t.text} ${className}`}
    >
      <span className="flex items-center gap-1.5">
        <Star className="h-4 w-4 fill-accent text-accent" />
        {proof.rating} from {compactCount(proof.reviews)} reviews
      </span>
      <span className={`hidden sm:inline ${t.sep}`}>·</span>
      <span className="flex items-center gap-1.5">
        <Users className="h-4 w-4 text-success" />
        {plusCount(proof.orders)} orders delivered
      </span>
      <span className={`hidden sm:inline ${t.sep}`}>·</span>
      <span className="flex items-center gap-1.5">
        <Zap className="h-4 w-4 text-info" />
        {proof.activationLabel}
      </span>
    </div>
  );
}
