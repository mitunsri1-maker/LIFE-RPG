export function StatCard({ icon, value, label, accent = 'violet', badge = null, className = '' }) {
  const shadow = {
    violet: 'shadow-brutal-violet',
    gold: 'shadow-brutal-gold',
    mint: 'shadow-brutal-mint',
    coral: 'shadow-brutal-coral',
    line: 'shadow-brutal-line',
  }[accent] || 'shadow-brutal-violet';

  return (
    <div
      className={`relative bg-panel border-3 border-line rounded-lg p-5
                  ${shadow} transition-all duration-150
                  hover:-translate-y-0.5
                  active:translate-x-[5px] active:translate-y-[5px] active:shadow-none select-none ${className}`}
    >
      {badge && (
        <div className="absolute -top-3 -right-2 z-10">
          {badge}
        </div>
      )}
      <div className="text-2xl mb-2">{icon}</div>
      <div className="font-display font-bold text-3xl text-line tracking-tight">{value}</div>
      <div className="font-body text-xs font-semibold uppercase tracking-wider text-line/60 mt-1">{label}</div>
    </div>
  );
}

export default StatCard;
