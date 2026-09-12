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
        'group relative bg-cyber-panel/85 backdrop-blur-md border-2 rounded-lg p-5 flex flex-col justify-between transition-all duration-200 overflow-hidden cyber-corner-tl',
        owned
          ? 'border-cyber-green/40 shadow-holo-green bg-cyber-panel/50 opacity-90'
          : 'border-cyber-border/50 hover:border-cyber-gold hover:shadow-holo-gold hover:-translate-y-1'
      )}
    >
      <div>
        {/* 3D Holographic Artifact preview */}
        <div className="bg-cyber-bg/90 border border-cyber-border/30 rounded-lg p-2 mb-3 relative overflow-hidden">
          <div className="absolute top-1 left-2 font-mono text-[9px] text-cyber-gold font-bold uppercase tracking-wider">
            HOLO-SPEC // {type}
          </div>
          <HoloItem3D type={type} name={name} height="130px" />
        </div>

        <h3 className="font-orbitron font-bold text-base text-cyber-text leading-snug group-hover:text-cyber-gold transition-colors">
          {name}
        </h3>
        <p className="font-body text-xs text-cyber-muted mt-1.5 leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-cyber-border/30 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-cyber-gold font-orbitron font-bold text-sm text-glow-gold">
          <Coins className="w-4 h-4 animate-pulse" />
          <span>{cost} CREDITS</span>
        </div>

        {owned ? (
          <span className="inline-flex items-center gap-1 text-xs font-orbitron font-bold text-cyber-green bg-cyber-green/10 px-3 py-1.5 rounded border border-cyber-green">
            <Check className="w-3.5 h-3.5 stroke-[3]" /> OWNED
          </span>
        ) : (
          <button
            onClick={handlePurchase}
            disabled={isBuying}
            className="inline-flex items-center gap-1.5 bg-cyber-gold/20 hover:bg-cyber-gold text-cyber-gold hover:text-cyber-bg font-orbitron font-bold text-xs uppercase px-3.5 py-1.5 rounded border border-cyber-gold shadow-holo-gold transition-all duration-150 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>{isBuying ? 'ACQUIRING...' : 'ACQUIRE'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
