import React from 'react';
import { Check, Trash2, Clock, Zap, Coins, Shield, Terminal, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';
import { soundFX } from '../../utils/soundFX';

const DIFFICULTY_CONFIG = {
  easy: {
    label: 'TIER I // LOW RISK',
    border: 'border-emerald-300 hover:border-emerald-500 hover:shadow-md',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-300',
    dot: 'bg-emerald-500',
  },
  medium: {
    label: 'TIER II // STANDARD',
    border: 'border-sky-300 hover:border-sky-500 hover:shadow-md',
    badge: 'bg-sky-50 text-sky-700 border-sky-300',
    dot: 'bg-sky-500',
  },
  hard: {
    label: 'TIER III // HIGH PRIORITY',
    border: 'border-rose-300 hover:border-rose-500 hover:shadow-md',
    badge: 'bg-rose-50 text-rose-700 border-rose-300',
    dot: 'bg-rose-500',
  },
};

const CATEGORY_MAP = {
  coding: { label: 'NETWORKING // INTELLECT', attr: '⚡ INTELLECT', color: 'text-sky-700 border-sky-300 bg-sky-50' },
  study: { label: 'COGNITIVE // INTELLECT', attr: '⚡ INTELLECT', color: 'text-sky-700 border-sky-300 bg-sky-50' },
  gym: { label: 'KINETIC // STRENGTH', attr: '⚔️ STRENGTH', color: 'text-rose-700 border-rose-300 bg-rose-50' },
  physical: { label: 'KINETIC // STRENGTH', attr: '⚔️ STRENGTH', color: 'text-rose-700 border-rose-300 bg-rose-50' },
  running: { label: 'BIOMED // VITALITY', attr: '💚 VITALITY', color: 'text-emerald-700 border-emerald-300 bg-emerald-50' },
  cardio: { label: 'BIOMED // VITALITY', attr: '💚 VITALITY', color: 'text-emerald-700 border-emerald-300 bg-emerald-50' },
  reading: { label: 'ARCHIVE // WISDOM', attr: '🔮 WISDOM', color: 'text-purple-700 border-purple-300 bg-purple-50' },
  meditation: { label: 'NEURAL // DISCIPLINE', attr: '🧘 DISCIPLINE', color: 'text-amber-700 border-amber-300 bg-amber-50' },
  habits: { label: 'NEURAL // DISCIPLINE', attr: '🧘 DISCIPLINE', color: 'text-amber-700 border-amber-300 bg-amber-50' },
};

export default function QuestCard({ quest, onComplete, onDelete, isCompleting }) {
  const isCompleted = quest.status === 'completed';
  const catKey = (quest.category || '').toLowerCase();
  const catInfo = Object.entries(CATEGORY_MAP).find(([k]) => catKey.includes(k))?.[1] || {
    label: `${quest.category?.toUpperCase() || 'MISSION'} // GENERAL`,
    attr: '🧘 DISCIPLINE',
    color: 'text-slate-700 border-slate-300 bg-slate-100',
  };

  const diffConfig = DIFFICULTY_CONFIG[quest.difficulty] || DIFFICULTY_CONFIG.medium;

  const handleExecute = () => {
    soundFX.playQuestComplete();
    onComplete?.(quest.id);
  };

  return (
    <div
      className={clsx(
        'group relative city-glass border rounded-xl p-5 md:p-6 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5',
        isCompleted
          ? 'border-emerald-200 bg-emerald-50/40 opacity-70'
          : `${diffConfig.border}`
      )}
    >
      {/* Decorative top coordinate tag */}
      <div className="absolute top-2 right-12 font-mono text-[9px] text-slate-400 tracking-widest pointer-events-none select-none">
        [DIR-{String(quest.id).padStart(3, '0')}]
      </div>

      {/* Top Status Header */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <span className={clsx('w-2 h-2 rounded-full', isCompleted ? 'bg-emerald-500' : `${diffConfig.dot} animate-pulse`)} />
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 font-bold">
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
              className="text-slate-400 hover:text-rose-500 p-1 rounded hover:bg-rose-50 transition-colors cursor-pointer"
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
            'font-orbitron font-bold text-base text-slate-900 leading-snug tracking-wide group-hover:text-cyber-cyan transition-colors',
            isCompleted && 'line-through text-slate-400'
          )}
        >
          {quest.title}
        </h3>

        {quest.description && (
          <p className="font-body text-xs text-slate-600 leading-relaxed line-clamp-2">
            {quest.description}
          </p>
        )}

        {/* Telemetry Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className={clsx('text-[10px] font-mono font-semibold px-2 py-0.5 rounded border', catInfo.color)}>
            {catInfo.label}
          </span>
          <span className="text-[10px] font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
            {catInfo.attr}
          </span>
          {quest.due_date && (
            <span className="text-[10px] font-mono text-slate-600 flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
              <Clock className="w-3 h-3 text-cyber-cyan" />
              {quest.due_date}
            </span>
          )}
        </div>
      </div>

      {/* Rewards & Execute Button */}
      <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-200/80">
        {/* Energy & Credits */}
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-300">
            <Zap className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" /> +{quest.xp_reward} XP
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-300">
            <Coins className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> +{quest.gold_reward} C
          </span>
        </div>

        {/* Action Button */}
        {!isCompleted ? (
          <button
            onClick={handleExecute}
            disabled={isCompleting}
            className="inline-flex items-center gap-1.5 bg-cyber-cyan hover:bg-cyber-blue text-white font-orbitron font-bold text-xs uppercase px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all duration-200 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <span>EXECUTE</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-orbitron font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-300">
            <Check className="w-3.5 h-3.5 stroke-[3]" /> COMPLETE
          </span>
        )}
      </div>
    </div>
  );
}
