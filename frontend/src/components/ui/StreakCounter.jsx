import React, { useEffect, useState } from 'react';
import { Flame } from 'lucide-react';
import { progressApi } from '../../api';

export default function StreakCounter({ streakCount = null }) {
  const [streak, setStreak] = useState(streakCount !== null ? streakCount : 0);

  useEffect(() => {
    if (streakCount === null) {
      progressApi.getStreak().then((r) => setStreak(r.data.streak?.current_streak || 0)).catch(() => {});
    } else {
      setStreak(streakCount);
    }
  }, [streakCount]);

  const active = streak > 0;

  return (
    <div className={`inline-flex items-center gap-2 city-glass border px-3 py-1.5 rounded-lg select-none transition-all duration-200 ${
      active ? 'border-cyber-coral/60 shadow-holo-red text-cyber-coral' : 'border-cyber-border/40 text-cyber-muted'
    }`}>
      <Flame className={`w-4 h-4 ${active ? 'text-cyber-coral fill-cyber-coral/30 animate-bounce' : 'text-cyber-muted'} shrink-0`} />
      <span className="font-orbitron font-bold text-xs tracking-wider">
        {streak} <span className="font-mono text-[9px] text-cyber-muted uppercase tracking-widest">{streak === 1 ? 'DAY' : 'DAYS'} CHARGE</span>
      </span>
    </div>
  );
}
