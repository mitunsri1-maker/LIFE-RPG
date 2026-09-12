import React from 'react';
import { Check, Trash2, Clock, Zap, Coins, Shield, Terminal, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';
import { soundFX } from '../../utils/soundFX';

const DIFFICULTY_CONFIG = {
  easy: {
    label: 'TIER I // LOW RISK',
    border: 'border-cyber-green/40 hover:border-cyber-green',
    badge: 'bg-cyber-green/15 text-cyber-green border-cyber-green/60',
    glow: 'shadow-holo-green',
  },
  medium: {
    label: 'TIER II // STANDARD',
    border: 'border-cyber-cyan/40 hover:border-cyber-cyan',
    badge: 'bg-cyber-cyan/15 text-cyber-cyan border-cyber-cyan/60',
    glow: 'shadow-holo-cyan',
  },
  hard: {
    label: 'TIER III // HIGH PRIORITY',
    border: 'border-cyber-red/50 hover:border-cyber-red',
    badge: 'bg-cyber-red/15 text-cyber-red border-cyber-red/60',
    glow: 'shadow-holo-red',
  },
};

const CATEGORY_MAP = {
  coding: { label: 'NETWORKING // INTELLECT', attr: '⚡ INTELLECT', color: 'text-cyber-cyan border-cyber-cyan/40' },
  study: { label: 'COGNITIVE // INTELLECT', attr: '⚡ INTELLECT', color: 'text-cyber-cyan border-cyber-cyan/40' },
  gym: { label: 'KINETIC // STRENGTH', attr: '⚔️ STRENGTH', color: 'text-cyber-red border-cyber-red/40' },
  physical: { label: 'KINETIC // STRENGTH', attr: '⚔️ STRENGTH', color: 'text-cyber-red border-cyber-red/40' },
  running: { label: 'BIOMED // VITALITY', attr: '💚 VITALITY', color: 'text-cyber-green border-cyber-green/40' },
  cardio: { label: 'BIOMED // VITALITY', attr: '💚 VITALITY', color: 'text-cyber-green border-cyber-green/40' },
  reading: { label: 'ARCHIVE // WISDOM', attr: '🔮 WISDOM', color: 'text-cyber-purple border-cyber-purple/40' },
  meditation: { label: 'NEURAL // DISCIPLINE', attr: '🧘 DISCIPLINE', color: 'text-cyber-gold border-cyber-gold/40' },
  habits: { label: 'NEURAL // DISCIPLINE', attr: '🧘 DISCIPLINE', color: 'text-cyber-gold border-cyber-gold/40' },
};

export default function QuestCard({ quest, onComplete, onDelete, isCompleting }) {
  const isCompleted = quest.status === 'completed';
  const catKey = (quest.category || '').toLowerCase();
  const catInfo = Object.entries(CATEGORY_MAP).find(([k]) => catKey.includes(k))?.[1] || {
    label: `${quest.category?.toUpperCase() || 'MISSION'} // GENERAL`,
    attr: '🧘 DISCIPLINE',
    color: 'text-cyber-text border-cyber-border',
  };

  const diffConfig = DIFFICULTY_CONFIG[quest.difficulty] || DIFFICULTY_CONFIG.medium;

  const handleExecute = () => {
    soundFX.playQuestComplete();
    onComplete?.(quest.id);
  };

  return (
    <div
      className={clsx(
        'group relative bg-cyber-panel/85 backdrop-blur-md border-2 rounded-lg p-5 transition-all duration-200 overflow-hidden cyber-corner-tl',
        isCompleted
          ? 'border-cyber-green/40 opacity-70 bg-cyber-panel/60'
          : `${diffConfig.border} hover:shadow-holo-cyan hover:-translate-y-1`
      )}
    >
      {/* Top Status Header */}
      <div className="flex items-center justify-between gap-2 border-b border-cyber-border/30 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <span className={clsx('w-2 h-2 rounded-sm', isCompleted ? 'bg-cyber-green' : 'bg-cyber-cyan animate-pulse')} />
          <span className="font-mono text-[10px] uppercase tracking-wider text-cyber-muted">
            {isCompleted ? 'MISSION // VERIFIED' : 'QUEST // ACTIVE'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className={clsx('font-mono text-[9px] px-2 py-0.5 rounded border uppercase', diffConfig.badge)}>
            {diffConfig.label}
          </span>
          {!isCompleted && (
            <button
              onClick={() => onDelete?.(quest.id)}
              aria-label="Abort Quest"
              className="text-cyber-muted hover:text-cyber-red p-1 rounded hover:bg-cyber-red/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Quest Body */}
      <div className="space-y-2">
        <h3
          className={clsx(
            'font-orbitron font-bold text-base text-cyber-text leading-snug tracking-wide group-hover:text-cyber-cyan transition-colors',
            isCompleted && 'line-through text-cyber-muted'
          )}
        >
          {quest.title}
        </h3>

        {quest.description && (
          <p className="font-body text-xs text-cyber-muted leading-relaxed line-clamp-2">
            {quest.description}
          </p>
        )}

        {/* Telemetry Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className={clsx('text-[10px] font-mono px-2 py-0.5 rounded border bg-cyber-bg/70', catInfo.color)}>
            {catInfo.label}
          </span>
          <span className="text-[10px] font-mono text-cyber-muted bg-cyber-bg px-2 py-0.5 rounded border border-cyber-border/40">
            {catInfo.attr}
          </span>
          {quest.due_date && (
            <span className="text-[10px] font-mono text-cyber-muted flex items-center gap-1 bg-cyber-bg px-2 py-0.5 rounded border border-cyber-border/40">
              <Clock className="w-3 h-3" />
              {quest.due_date}
            </span>
          )}
        </div>
      </div>

      {/* Rewards & Execute Button */}
      <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-cyber-border/30">
        {/* Energy & Credits */}
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-cyber-green bg-cyber-bg/90 px-2 py-1 rounded border border-cyber-green/40 shadow-cyber-sm">
            <Zap className="w-3 h-3 fill-cyber-green" /> +{quest.xp_reward} XP
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-cyber-gold bg-cyber-bg/90 px-2 py-1 rounded border border-cyber-gold/40 shadow-cyber-sm">
            <Coins className="w-3 h-3 fill-cyber-gold" /> +{quest.gold_reward} G
          </span>
        </div>

        {/* Action Button */}
        {!isCompleted ? (
          <button
            onClick={handleExecute}
            disabled={isCompleting}
            className="inline-flex items-center gap-1.5 bg-cyber-cyan/20 hover:bg-cyber-cyan text-cyber-cyan hover:text-cyber-bg font-orbitron font-bold text-xs uppercase px-3.5 py-1.5 rounded border border-cyber-cyan shadow-holo-cyan transition-all duration-150 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <span>EXECUTE</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-orbitron font-bold text-cyber-green bg-cyber-green/10 px-2.5 py-1 rounded border border-cyber-green">
            <Check className="w-3.5 h-3.5 stroke-[3]" /> COMPLETE
          </span>
        )}
      </div>
    </div>
  );
}
