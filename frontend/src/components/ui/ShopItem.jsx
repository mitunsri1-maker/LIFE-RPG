import React from 'react';
import { ShoppingCart, Check, Coins, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import HoloItem3D from '../3d/HoloItem3D';
import { soundFX } from '../../utils/soundFX';

export default function ShopItem({ item, onBuy, isBuying }) {
  const { name, type, cost, description, owned } = item;

  const handlePurchase = () => {
    soundFX.playPurchase();
    onBuy?.(item.id);
  };

  return (
    <div
      className={clsx(
        'group relative city-glass border rounded-xl p-5 flex flex-col justify-between transition-all duration-300 overflow-hidden cyber-corner-tl',
        owned
          ? 'border-cyber-green/40 shadow-[0_0_20px_rgba(0,255,157,0.15)] bg-cyber-navy/50 opacity-90'
          : 'border-cyber-border/40 hover:border-cyber-amber hover:shadow-[0_0_25px_rgba(255,184,0,0.25)] hover:-translate-y-1'
      )}
    >
      <div>
        {/* 3D Holographic Artifact preview */}
        <div className="city-glass-elevated border border-cyber-border/30 rounded-lg p-2 mb-3 relative overflow-hidden">
          <div className="absolute top-1 left-2 font-mono text-[9px] text-cyber-amber font-bold uppercase tracking-wider">
            HOLO-SPEC // {type}
          </div>
          <HoloItem3D type={type} name={name} height="135px" />
        </div>

        <h3 className="font-orbitron font-bold text-base text-cyber-text leading-snug group-hover:text-cyber-amber transition-colors">
          {name}
        </h3>
        <p className="font-body text-xs text-cyber-textMuted mt-1.5 leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-cyber-border/25 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-cyber-amber font-orbitron font-bold text-sm text-glow-gold">
          <Coins className="w-4 h-4 animate-pulse fill-cyber-amber" />
          <span>{cost} C</span>
        </div>

        {owned ? (
          <span className="inline-flex items-center gap-1 text-xs font-orbitron font-bold text-cyber-green bg-cyber-green/10 px-3 py-1.5 rounded-lg border border-cyber-green/50">
            <Check className="w-3.5 h-3.5 stroke-[3]" /> OWNED
          </span>
        ) : (
          <button
            onClick={handlePurchase}
            disabled={isBuying}
            className="inline-flex items-center gap-1.5 bg-cyber-amber/20 hover:bg-cyber-amber text-cyber-amber hover:text-cyber-bg font-orbitron font-bold text-xs uppercase px-4 py-2 rounded-lg border border-cyber-amber shadow-holo-gold hover:shadow-[0_0_25px_rgba(255,184,0,0.5)] transition-all duration-200 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>{isBuying ? 'ACQUIRING...' : 'ACQUIRE'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
