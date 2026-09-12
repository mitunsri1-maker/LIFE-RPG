import React from 'react';

export default function LevelBadge({ level = 1, large = false }) {
  return (
    <div className={`
      ${large ? 'w-16 h-16 text-2xl border shadow-holo-purple' : 'w-10 h-10 text-sm border shadow-holo-cyan'}
      rounded-xl city-glass border-cyber-cyan/50
      flex flex-col items-center justify-center font-orbitron font-black text-cyber-cyan
      shrink-0 select-none relative overflow-hidden cyber-corner-tl
    `}>
      <span className="leading-none text-glow-cyan drop-shadow-sm">{level}</span>
      {large && <span className="text-[8px] uppercase tracking-widest font-mono text-cyber-cyan/70 mt-0.5">TIER</span>}
    </div>
  );
}
