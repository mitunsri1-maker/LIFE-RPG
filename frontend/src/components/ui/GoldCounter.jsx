import React from 'react';
import { Coins } from 'lucide-react';

export default function GoldCounter({ gold = 0, large = false }) {
  return (
    <div className={`inline-flex items-center gap-2 bg-cyber-panel/90 border-2 border-cyber-gold/50 px-3 py-1.5 rounded-md shadow-holo-gold select-none`}>
      <Coins className={`${large ? 'w-5 h-5' : 'w-4 h-4'} text-cyber-gold shrink-0 animate-pulse`} />
      <span className={`font-orbitron font-bold text-cyber-gold ${large ? 'text-xl' : 'text-xs'} tracking-wider text-glow-gold`}>
        {Number(gold || 0).toLocaleString()} <span className="text-[10px] font-mono text-cyber-muted font-normal uppercase">CREDITS</span>
      </span>
    </div>
  );
}
