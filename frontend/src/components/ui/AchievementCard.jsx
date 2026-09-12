import React from 'react';
import { Lock, Star, Trophy } from 'lucide-react';
import { clsx } from 'clsx';
import { format } from 'date-fns';

export default function AchievementCard({ achievement }) {
  const { label, description, unlocked, unlocked_at } = achievement;

  return (
    <div
      className={clsx(
        'relative bg-cyber-panel/85 backdrop-blur-md border-2 rounded-lg p-4 transition-all duration-150 overflow-hidden cyber-corner-tl',
        unlocked
          ? 'border-cyber-gold/60 shadow-holo-gold'
          : 'border-cyber-border/30 opacity-50 bg-cyber-panel/40'
      )}
    >
      <div className="flex items-start gap-3.5">
        <div
          className={clsx(
            'w-11 h-11 rounded-lg border-2 flex items-center justify-center shrink-0 font-bold',
            unlocked
              ? 'border-cyber-gold bg-cyber-gold/20 text-cyber-gold shadow-holo-gold'
              : 'border-cyber-border/40 bg-cyber-bg text-cyber-muted'
          )}
        >
          {unlocked ? <Trophy className="w-5 h-5 text-cyber-gold animate-pulse" /> : <Lock className="w-4 h-4" />}
        </div>
        <div>
          <h4 className={clsx('font-orbitron font-bold text-sm tracking-wide', unlocked ? 'text-cyber-gold' : 'text-cyber-muted')}>
            {label}
          </h4>
          <p className="font-body text-xs text-cyber-muted mt-0.5 leading-relaxed">{description}</p>
          {unlocked && unlocked_at && (
            <p className="font-mono text-[10px] text-cyber-green font-bold uppercase tracking-wider mt-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-ping" />
              RECORDED // {format(new Date(unlocked_at), 'MMM d, yyyy')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
