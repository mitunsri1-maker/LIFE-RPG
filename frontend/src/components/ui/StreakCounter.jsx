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
    <div className={`inline-flex items-center gap-2 bg-cyber-panel/90 border-2 px-3 py-1.5 rounded-md select-none ${
      active ? 'border-cyber-coral/60 shadow-holo-red text-cyber-coral' : 'border-cyber-border/40 text-cyber-muted'
    }`}>
      <Flame className={`w-4 h-4 ${active ? 'text-cyber-coral fill-cyber-coral/30 animate-bounce' : 'text-cyber-muted'} shrink-0`} />
      <span className="font-orbitron font-bold text-xs tracking-wider">
        {streak} <span className="font-mono text-[10px] text-cyber-muted uppercase">{streak === 1 ? 'DAY' : 'DAYS'} CHARGE</span>
      </span>
    </div>
  );
}
