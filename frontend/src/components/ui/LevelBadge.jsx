import React from 'react';

export default function LevelBadge({ level = 1, large = false }) {
  return (
    <div className={`
      ${large ? 'w-16 h-16 text-2xl border-3 shadow-holo-purple' : 'w-10 h-10 text-sm border-2 shadow-holo-cyan'}
      rounded-lg bg-cyber-panel border-cyber-cyan
      flex flex-col items-center justify-center font-orbitron font-black text-cyber-cyan
      shrink-0 select-none relative overflow-hidden cyber-corner-tl
    `}>
      <span className="leading-none text-glow-cyan">{level}</span>
      {large && <span className="text-[8px] uppercase tracking-widest font-mono text-cyber-muted mt-0.5">TIER</span>}
    </div>
  );
}
