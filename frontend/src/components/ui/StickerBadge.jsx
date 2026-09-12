export function StickerBadge({ children, rotate = -4, accent = 'gold', className = '' }) {
  const bg = {
    gold: 'bg-brand-gold text-ink',
    mint: 'bg-brand-mint text-ink',
    coral: 'bg-brand-coral text-ink',
    violet: 'bg-brand-violet text-line',
  }[accent] || 'bg-brand-gold text-ink';

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${bg} font-display font-bold text-xs
                  px-2.5 py-0.5 rounded-md border-3 border-line
                  shadow-brutal-sm-line select-none ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </span>
  );
}

export default StickerBadge;
