import React from 'react';
import { Check, Trash2, Clock, Zap, Coins, Shield, Terminal, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';
import { soundFX } from '../../utils/soundFX';

const DIFFICULTY_CONFIG = {
  easy: {
    label: 'TIER I // LOW RISK',
    border: 'border-cyber-green/45 hover:border-cyber-green hover:shadow-[0_0_25px_rgba(0,255,157,0.3)]',
    badge: 'bg-cyber-green/15 text-cyber-green border-cyber-green/60',
    dot: 'bg-cyber-green shadow-[0_0_8px_#00FF9D]',
  },
  medium: {
    label: 'TIER II // STANDARD',
    border: 'border-cyber-cyan/45 hover:border-cyber-cyan hover:shadow-[0_0_25px_rgba(0,240,255,0.3)]',
    badge: 'bg-cyber-cyan/15 text-cyber-cyan border-cyber-cyan/60',
    dot: 'bg-cyber-cyan shadow-[0_0_8px_#00F0FF]',
  },
  hard: {
    label: 'TIER III // HIGH PRIORITY',
    border: 'border-cyber-coral/50 hover:border-cyber-coral hover:shadow-[0_0_25px_rgba(255,51,102,0.35)]',
    badge: 'bg-cyber-coral/15 text-cyber-coral border-cyber-coral/60',
    dot: 'bg-cyber-coral shadow-[0_0_8px_#FF3366]',
  },
};

const CATEGORY_MAP = {
  coding: { label: 'NETWORKING // INTELLECT', attr: '⚡ INTELLECT', color: 'text-cyber-cyan border-cyber-cyan/50 bg-cyber-cyan/10' },
  study: { label: 'COGNITIVE // INTELLECT', attr: '⚡ INTELLECT', color: 'text-cyber-cyan border-cyber-cyan/50 bg-cyber-cyan/10' },
  gym: { label: 'KINETIC // STRENGTH', attr: '⚔️ STRENGTH', color: 'text-cyber-coral border-cyber-coral/50 bg-cyber-coral/10' },
  physical: { label: 'KINETIC // STRENGTH', attr: '⚔️ STRENGTH', color: 'text-cyber-coral border-cyber-coral/50 bg-cyber-coral/10' },
  running: { label: 'BIOMED // VITALITY', attr: '💚 VITALITY', color: 'text-cyber-green border-cyber-green/50 bg-cyber-green/10' },
  cardio: { label: 'BIOMED // VITALITY', attr: '💚 VITALITY', color: 'text-cyber-green border-cyber-green/50 bg-cyber-green/10' },
  reading: { label: 'ARCHIVE // WISDOM', attr: '🔮 WISDOM', color: 'text-cyber-violet border-cyber-violet/50 bg-cyber-violet/10' },
  meditation: { label: 'NEURAL // DISCIPLINE', attr: '🧘 DISCIPLINE', color: 'text-cyber-amber border-cyber-amber/50 bg-cyber-amber/10' },
  habits: { label: 'NEURAL // DISCIPLINE', attr: '🧘 DISCIPLINE', color: 'text-cyber-amber border-cyber-amber/50 bg-cyber-amber/10' },
};

export default function QuestCard({ quest, onComplete, onDelete, isCompleting }) {
  const isCompleted = quest.status === 'completed';
  const catKey = (quest.category || '').toLowerCase();
  const catInfo = Object.entries(CATEGORY_MAP).find(([k]) => catKey.includes(k))?.[1] || {
    label: `${quest.category?.toUpperCase() || 'MISSION'} // GENERAL`,
    attr: '🧘 DISCIPLINE',
    color: 'text-cyber-text border-cyber-border bg-cyber-panel/60',
  };

  const diffConfig = DIFFICULTY_CONFIG[quest.difficulty] || DIFFICULTY_CONFIG.medium;

  const handleExecute = () => {
    soundFX.playQuestComplete();
    onComplete?.(quest.id);
  };

  return (
    <div
      className={clsx(
        'group relative city-glass border rounded-xl p-5 md:p-6 transition-all duration-300 overflow-hidden cyber-corner-tl',
        isCompleted
          ? 'border-cyber-green/30 opacity-65 bg-cyber-navy/50'
          : `${diffConfig.border} hover:-translate-y-1 hover:shadow-glass-depth`
      )}
    >
      {/* Decorative top coordinate tag */}
      <div className="absolute top-2 right-12 font-mono text-[9px] text-cyber-muted/40 tracking-widest pointer-events-none select-none">
        [DIR-{String(quest.id).padStart(3, '0')}]
      </div>

      {/* Top Status Header */}
      <div className="flex items-center justify-between gap-2 border-b border-cyber-border/25 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <span className={clsx('w-2 h-2 rounded-sm', isCompleted ? 'bg-cyber-green shadow-[0_0_8px_#00FF9D]' : `${diffConfig.dot} animate-pulse`)} />
          <span className="font-mono text-[10px] uppercase tracking-wider text-cyber-textMuted font-bold">
            {isCompleted ? 'MISSION // VERIFIED' : 'QUEST // ACTIVE'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className={clsx('font-mono text-[9px] px-2 py-0.5 rounded border uppercase font-bold', diffConfig.badge)}>
            {diffConfig.label}
          </span>
          {!isCompleted && (
            <button
              onClick={() => onDelete?.(quest.id)}
              aria-label="Abort Quest"
              className="text-cyber-muted hover:text-cyber-coral p-1 rounded hover:bg-cyber-coral/10 transition-colors cursor-pointer"
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
          <p className="font-body text-xs text-cyber-textMuted leading-relaxed line-clamp-2">
            {quest.description}
          </p>
        )}

        {/* Telemetry Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className={clsx('text-[10px] font-mono font-semibold px-2 py-0.5 rounded border', catInfo.color)}>
            {catInfo.label}
          </span>
          <span className="text-[10px] font-mono text-cyber-textMuted bg-cyber-navy/80 px-2 py-0.5 rounded border border-cyber-border/30">
            {catInfo.attr}
          </span>
          {quest.due_date && (
            <span className="text-[10px] font-mono text-cyber-textMuted flex items-center gap-1 bg-cyber-navy/80 px-2 py-0.5 rounded border border-cyber-border/30">
              <Clock className="w-3 h-3 text-cyber-cyan" />
              {quest.due_date}
            </span>
          )}
        </div>
      </div>

      {/* Rewards & Execute Button */}
      <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-cyber-border/25">
        {/* Energy & Credits */}
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-cyber-green bg-cyber-navy/90 px-2.5 py-1 rounded border border-cyber-green/40 shadow-cyber-sm">
            <Zap className="w-3.5 h-3.5 fill-cyber-green text-cyber-green" /> +{quest.xp_reward} XP
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-cyber-amber bg-cyber-navy/90 px-2.5 py-1 rounded border border-cyber-amber/40 shadow-cyber-sm">
            <Coins className="w-3.5 h-3.5 fill-cyber-amber text-cyber-amber" /> +{quest.gold_reward} C
          </span>
        </div>

        {/* Action Button */}
        {!isCompleted ? (
          <button
            onClick={handleExecute}
            disabled={isCompleting}
            className="inline-flex items-center gap-1.5 bg-cyber-cyan/20 hover:bg-cyber-cyan text-cyber-cyan hover:text-cyber-bg font-orbitron font-bold text-xs uppercase px-4 py-2 rounded-lg border border-cyber-cyan shadow-holo-cyan hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] transition-all duration-200 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <span>EXECUTE</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-orbitron font-bold text-cyber-green bg-cyber-green/10 px-3 py-1.5 rounded-lg border border-cyber-green/50">
            <Check className="w-3.5 h-3.5 stroke-[3]" /> COMPLETE
          </span>
        )}
      </div>
    </div>
  );
}
