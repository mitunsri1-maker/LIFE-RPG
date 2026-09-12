import React from 'react';
import { clsx } from 'clsx';

export function HoloPanel({
  children,
  title = null,
  subtitle = null,
  badge = null,
  accent = 'cyan', // cyan, magenta, green, gold, red, purple
  className = '',
  cornerCut = true,
  glow = false,
  tag = null,
}) {
  const borderColors = {
    cyan: 'border-cyber-cyan/35 hover:border-cyber-cyan/60 shadow-[0_0_20px_rgba(0,240,255,0.1)]',
    magenta: 'border-cyber-magenta/40 hover:border-cyber-magenta/70 shadow-[0_0_20px_rgba(255,0,127,0.1)]',
    green: 'border-cyber-green/40 hover:border-cyber-green/70 shadow-[0_0_20px_rgba(0,255,157,0.1)]',
    gold: 'border-cyber-amber/40 hover:border-cyber-amber/70 shadow-[0_0_20px_rgba(255,184,0,0.1)]',
    red: 'border-cyber-coral/45 hover:border-cyber-coral/75 shadow-[0_0_20px_rgba(255,51,102,0.1)]',
    purple: 'border-cyber-violet/40 hover:border-cyber-violet/70 shadow-[0_0_20px_rgba(139,92,246,0.1)]',
  }[accent] || 'border-cyber-cyan/35';

  const glowShadow = {
    cyan: 'shadow-holo-cyan',
    magenta: 'shadow-holo-purple',
    green: 'shadow-holo-green',
    gold: 'shadow-holo-gold',
    red: 'shadow-holo-red',
    purple: 'shadow-holo-purple',
  }[accent];

  const dotColor = {
    cyan: 'bg-cyber-cyan shadow-[0_0_8px_#00F0FF]',
    magenta: 'bg-cyber-magenta shadow-[0_0_8px_#FF007F]',
    green: 'bg-cyber-green shadow-[0_0_8px_#00FF9D]',
    gold: 'bg-cyber-amber shadow-[0_0_8px_#FFB800]',
    red: 'bg-cyber-coral shadow-[0_0_8px_#FF3366]',
    purple: 'bg-cyber-violet shadow-[0_0_8px_#8B5CF6]',
  }[accent] || 'bg-cyber-cyan';

  return (
    <div
      className={clsx(
        'relative city-glass border rounded-xl p-5 md:p-6 transition-all duration-300 overflow-hidden',
        borderColors,
        glow && glowShadow,
        cornerCut && 'cyber-corner-tl',
        className
      )}
    >
      {/* Decorative top coordinate tag */}
      {tag && (
        <div className="absolute top-2 right-3 font-mono text-[9px] text-cyber-muted/60 tracking-widest pointer-events-none select-none">
          {tag}
        </div>
      )}

      {/* Top Header if provided */}
      {(title || badge) && (
        <div className="flex items-center justify-between border-b border-cyber-border/30 pb-3 mb-4">
          <div>
            {title && (
              <h3 className="font-orbitron font-bold text-base md:text-lg text-cyber-text tracking-wide flex items-center gap-2">
                <span className={`w-2 h-2 rounded-sm ${dotColor}`} />
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="font-mono text-[11px] text-cyber-textMuted tracking-wider mt-0.5 uppercase">
                {subtitle}
              </p>
            )}
          </div>
          {badge && <div>{badge}</div>}
        </div>
      )}

      {/* Children content */}
      {children}
    </div>
  );
}

export default HoloPanel;
