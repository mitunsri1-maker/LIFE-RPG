import React from 'react';

function xpForLevel(level) {
  if (level <= 1) return 100;
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

export function XPBar({ xp = 0, level = 1, compact = false, current, total, nextLevel }) {
  let cur = current;
  let tot = total;
  let nxt = nextLevel || level + 1;

  if (cur === undefined) {
    let accumulated = 0;
    for (let i = 1; i < level; i++) accumulated += xpForLevel(i + 1);
    const needed = xpForLevel(level + 1);
    cur = Math.max(0, xp - accumulated);
    tot = needed;
  }

  const pct = Math.min(100, Math.max(0, Math.round((cur / (tot || 1)) * 100)));

  if (compact) {
    return (
      <div className="w-full space-y-1">
        <div className="flex justify-between text-[10px] font-mono font-bold text-cyber-textMuted">
          <span className="text-cyber-cyan font-bold">{cur} ENERGY</span>
          <span>{tot} CAP [LVL {nxt}]</span>
        </div>
        <div className="h-2.5 w-full bg-cyber-navy/80 border border-cyber-cyan/30 rounded-full overflow-hidden p-0.5 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-cyber-cyan via-cyber-violet to-cyber-magenta rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(0,229,255,0.4)]"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="city-glass border border-cyber-cyan/25 rounded-2xl p-5 shadow-lg">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyber-cyan animate-ping" />
          <span className="font-orbitron font-bold text-base text-cyber-text tracking-wide">
            ENERGY MATRIX // PROGRESSION
          </span>
        </div>
        <span className="font-mono text-xs text-cyber-cyan bg-cyber-cyan/10 border border-cyber-cyan/30 px-3 py-1 rounded-full font-bold shadow-[0_0_10px_rgba(0,229,255,0.15)]">
          TIER {level} → TIER {nxt}
        </span>
      </div>

      {/* Progress Bar Slot */}
      <div className="h-4 w-full bg-cyber-navy/90 border border-cyber-cyan/30 rounded-full overflow-hidden p-0.5 relative shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-cyber-cyan via-cyber-violet to-cyber-magenta rounded-full transition-all duration-700 shadow-[0_0_15px_rgba(0,229,255,0.4)]"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex justify-between mt-3 font-mono text-xs">
        <span className="text-cyber-cyan font-bold text-sm tracking-wider text-glow-cyan">{cur} / {tot} XP ({pct}%)</span>
        <span className="text-cyber-textMuted font-medium">{Math.max(0, tot - cur)} XP TO LEVEL {nxt}</span>
      </div>
    </div>
  );
}

export default XPBar;
