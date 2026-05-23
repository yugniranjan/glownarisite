/** Colour presets must match the admin picker (api badgeColor enum). */
const COLORS: Record<string, string> = {
  red: 'bg-accent text-white',
  green: 'bg-success text-black',
  blue: 'bg-info text-black',
  amber: 'bg-danger text-black',
  purple: 'bg-[#7c3aed] text-white',
  slate: 'bg-white/15 text-white',
};

export default function CategoryBadge({
  label,
  color,
  className = '',
}: {
  label: string;
  color?: string | null;
  className?: string;
}) {
  const cls = COLORS[color || 'red'] || COLORS.red;
  return (
    <span
      className={`inline-flex w-max items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide shadow-lg shadow-black/30 ${cls} ${className}`}
    >
      {label}
    </span>
  );
}
