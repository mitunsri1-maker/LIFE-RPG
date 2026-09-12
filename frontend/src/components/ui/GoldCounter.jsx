import React from 'react';
import { Coins } from 'lucide-react';

export default function GoldCounter({ gold = 0, large = false }) {
  return (
    <div className={`inline-flex items-center gap-2 city-glass border border-cyber-amber/40 px-3 py-1.5 rounded-lg shadow-glass-depth select-none hover:border-cyber-amber transition-all duration-200`}>
      <Coins className={`${large ? 'w-5 h-5' : 'w-4 h-4'} text-cyber-amber shrink-0 animate-pulse`} />
      <span className={`font-orbitron font-bold text-cyber-amber ${large ? 'text-xl' : 'text-xs'} tracking-wider text-glow-gold`}>
        {Number(gold || 0).toLocaleString()} <span className="text-[9px] font-mono text-cyber-muted font-normal tracking-widest uppercase">CREDITS</span>
      </span>
    </div>
  );
}
