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
        <div className="flex justify-between text-[10px] font-mono font-bold text-cyber-muted">
          <span className="text-cyber-green">{cur} ENERGY</span>
          <span>{tot} CAP [LVL {nxt}]</span>
        </div>
        <div className="h-2 w-full bg-cyber-bg border border-cyber-border rounded overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-cyber-cyan via-cyber-green to-cyber-mint rounded-sm transition-all duration-700 shadow-holo-green"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cyber-panel/85 backdrop-blur-md border-2 border-cyber-border/40 rounded-lg p-5 shadow-holo-green cyber-corner-tl">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-sm bg-cyber-green animate-ping" />
          <span className="font-orbitron font-bold text-base text-cyber-text tracking-wide">
            ENERGY MATRIX // PROGRESSION
          </span>
        </div>
        <span className="font-mono text-xs text-cyber-cyan bg-cyber-bg/80 border border-cyber-cyan/30 px-2.5 py-1 rounded">
          TIER {level} → TIER {nxt}
        </span>
      </div>

      {/* Progress Bar Slot */}
      <div className="h-5 w-full bg-cyber-bg border-2 border-cyber-border/80 rounded overflow-hidden p-0.5 relative">
        <div
          className="h-full bg-gradient-to-r from-cyber-cyan via-cyber-green to-cyber-mint rounded-sm transition-all duration-700 shadow-holo-green"
          style={{ width: `${pct}%` }}
        />
        {/* Striped scanline highlight */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] bg-[length:30px_100%] animate-[scanline_3s_linear_infinite] pointer-events-none opacity-40" />
      </div>

      <div className="flex justify-between mt-3 font-mono text-xs">
        <span className="text-cyber-green font-bold text-sm tracking-wider">{cur} / {tot} XP ({pct}%)</span>
        <span className="text-cyber-muted font-medium">{Math.max(0, tot - cur)} XP TO LEVEL {nxt}</span>
      </div>
    </div>
  );
}

export default XPBar;
