import React, { useEffect, useState } from 'react';
import { X, Zap, Coins, TrendingUp, Star, Flame, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFX } from '../../utils/soundFX';

export default function RewardPopup({ reward, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reward) {
      setTimeout(() => setVisible(true), 50);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#00F0FF', '#00FF9D', '#FFE600', '#BD00FF']
        });
      } catch (_) {}

      const timer = setTimeout(() => { setVisible(false); setTimeout(onClose, 300); }, 5000);
      return () => clearTimeout(timer);
    }
  }, [reward]);

  if (!reward) return null;

  const attrName = reward.attribute_gain ? Object.keys(reward.attribute_gain)[0] : null;
  const attrVal = attrName ? reward.attribute_gain[attrName] : null;

  return (
    <div
      className={`fixed bottom-24 md:bottom-8 right-6 z-50 transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
      }`}
    >
      <div className="relative bg-cyber-panel/95 backdrop-blur-xl border-2 border-cyber-cyan rounded-lg p-5 shadow-holo-cyan w-84 cyber-corner-tl">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-cyber-border/40 pb-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-sm bg-cyber-green animate-ping" />
            <span className="font-orbitron font-bold text-sm text-cyber-cyan uppercase tracking-wider">
              MISSION VERIFIED // REWARD RECEIVED
            </span>
          </div>
          <button
            onClick={() => { setVisible(false); setTimeout(onClose, 300); }}
            className="text-cyber-muted hover:text-cyber-text p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Reward telemetry matrix */}
        <div className="space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between bg-cyber-bg/80 border border-cyber-green/40 p-2 rounded text-cyber-green">
            <span className="flex items-center gap-2 font-bold">
              <Zap className="w-3.5 h-3.5 fill-cyber-green" /> ENERGY HARVESTED
            </span>
            <span className="font-orbitron font-black text-sm">+{reward.xp_earned} XP</span>
          </div>

          <div className="flex items-center justify-between bg-cyber-bg/80 border border-cyber-gold/40 p-2 rounded text-cyber-gold">
            <span className="flex items-center gap-2 font-bold">
              <Coins className="w-3.5 h-3.5 fill-cyber-gold" /> CREDITS CREDITED
            </span>
            <span className="font-orbitron font-black text-sm">+{reward.gold_earned} G</span>
          </div>

          {attrName && (
            <div className="flex items-center justify-between bg-cyber-bg/80 border border-cyber-purple/40 p-2 rounded text-cyber-purple uppercase">
              <span className="flex items-center gap-2 font-bold">
                <TrendingUp className="w-3.5 h-3.5" /> ATTRIBUTE {attrName}
              </span>
              <span className="font-orbitron font-black text-sm">+{attrVal} PTS</span>
            </div>
          )}

          {reward.streak?.milestone && (
            <div className="flex items-center gap-2 bg-cyber-red/20 border border-cyber-red p-2 rounded text-cyber-coral text-[11px]">
              <Flame className="w-4 h-4 shrink-0" />
              <span>{reward.streak.milestone.label}</span>
            </div>
          )}

          {reward.achievements_unlocked?.length > 0 && (
            <div className="flex items-center gap-2 bg-cyber-gold/20 border border-cyber-gold p-2 rounded text-cyber-gold text-[11px]">
              <Star className="w-4 h-4 shrink-0 fill-cyber-gold" />
              <span>Trophy: {reward.achievements_unlocked[0].label}!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
