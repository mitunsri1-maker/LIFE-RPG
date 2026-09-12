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
        <div className="flex justify-between text-[10px] font-mono font-bold text-slate-500">
          <span className="text-sky-600 font-bold">{cur} ENERGY</span>
          <span>{tot} CAP [LVL {nxt}]</span>
        </div>
        <div className="h-2.5 w-full bg-slate-100 border border-slate-200 rounded-full overflow-hidden p-0.5 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500 rounded-full transition-all duration-700 shadow-sm"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="city-glass border border-sky-200/80 rounded-2xl p-5 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-ping" />
          <span className="font-orbitron font-bold text-base text-slate-800 tracking-wide">
            ENERGY MATRIX // PROGRESSION
          </span>
        </div>
        <span className="font-mono text-xs text-sky-700 bg-sky-50 border border-sky-200 px-3 py-1 rounded-full font-bold">
          TIER {level} → TIER {nxt}
        </span>
      </div>

      {/* Progress Bar Slot */}
      <div className="h-4 w-full bg-slate-100 border border-slate-200 rounded-full overflow-hidden p-0.5 relative shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500 rounded-full transition-all duration-700 shadow-sm"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex justify-between mt-3 font-mono text-xs">
        <span className="text-sky-600 font-bold text-sm tracking-wider">{cur} / {tot} XP ({pct}%)</span>
        <span className="text-slate-500 font-medium">{Math.max(0, tot - cur)} XP TO LEVEL {nxt}</span>
      </div>
    </div>
  );
}

export default XPBar;
