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
}) {
  const borderColors = {
    cyan: 'border-cyber-cyan/30 hover:border-cyber-cyan/60',
    magenta: 'border-cyber-magenta/40 hover:border-cyber-magenta/70',
    green: 'border-cyber-green/40 hover:border-cyber-green/70',
    gold: 'border-cyber-gold/40 hover:border-cyber-gold/70',
    red: 'border-cyber-red/40 hover:border-cyber-red/70',
    purple: 'border-cyber-purple/40 hover:border-cyber-purple/70',
  }[accent] || 'border-cyber-cyan/30';

  const glowShadow = {
    cyan: 'shadow-holo-cyan',
    magenta: 'shadow-holo-purple',
    green: 'shadow-holo-green',
    gold: 'shadow-holo-gold',
    red: 'shadow-holo-red',
    purple: 'shadow-holo-purple',
  }[accent];

  return (
    <div
      className={clsx(
        'relative bg-cyber-panel/85 backdrop-blur-md border-2 rounded-lg p-5 md:p-6 transition-all duration-200',
        borderColors,
        glow && glowShadow,
        cornerCut && 'cyber-corner-tl',
        className
      )}
    >
      {/* Top Header if provided */}
      {(title || badge) && (
        <div className="flex items-center justify-between border-b border-cyber-border/40 pb-3 mb-4">
          <div>
            {title && (
              <h3 className="font-orbitron font-bold text-lg text-cyber-text tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-sm bg-cyber-cyan shadow-cyber-sm" />
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="font-mono text-[11px] text-cyber-muted tracking-wider mt-0.5 uppercase">
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
