import React, { useEffect, useState } from 'react';
import { characterApi } from '../api';
import XPBar from '../components/ui/XPBar';
import LevelBadge from '../components/ui/LevelBadge';
import GoldCounter from '../components/ui/GoldCounter';
import CharacterStats from '../components/ui/CharacterStats';
import AchievementCard from '../components/ui/AchievementCard';
import PlayerPod3D from '../components/3d/PlayerPod3D';
import XPCore from '../components/ui/XPCore';
import HoloPanel from '../components/hud/HoloPanel';
import { Flame, Loader2, Shield, Trophy, Activity, Terminal } from 'lucide-react';

function calculateLevelProgress(xp = 0, level = 1) {
  let accumulated = 0;
  for (let i = 1; i < level; i++) {
    accumulated += Math.floor(100 * Math.pow(1.5, i));
  }
  const neededForNext = Math.floor(100 * Math.pow(1.5, level));
  const currentInLevel = Math.max(0, xp - accumulated);
  const percent = Math.min(100, Math.max(0, Math.round((currentInLevel / neededForNext) * 100)));
  return { currentInLevel, neededForNext, percent };
}

export default function CharacterPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    characterApi.get().then((r) => { setData(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-80 text-cyber-muted font-orbitron font-bold">
      <Loader2 className="w-8 h-8 animate-spin mr-3 text-cyber-cyan" /> DECRYPTING CHARACTER DOSSIER...
    </div>
  );

  if (!data) return (
    <div className="p-8 text-cyber-red font-orbitron font-bold">
      FAILED TO RETRIEVE OPERATIVE ARCHIVE.
    </div>
  );

  const { user, stats, streak, level_meta, achievements } = data;
  const unlocked = achievements?.filter((a) => a.unlocked) || [];
  const locked = achievements?.filter((a) => !a.unlocked) || [];
  const { percent: xpPercent } = calculateLevelProgress(user?.xp || 0, user?.level || 1);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Dossier Header + 3D Hologram Rig */}
      <div className="bg-cyber-panel/85 backdrop-blur-xl border-2 border-cyber-cyan/50 rounded-xl p-6 md:p-8 shadow-holo-cyan relative overflow-hidden cyber-corner-tl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-3">
            <div className="inline-flex items-center gap-2 bg-cyber-purple/20 border border-cyber-purple text-cyber-purple font-mono text-[11px] px-3 py-1 rounded font-bold uppercase tracking-wider">
              <Terminal className="w-3.5 h-3.5" /> DOSSIER // OPERATIVE MATRIX
            </div>

            <div className="flex items-center gap-4">
              <LevelBadge level={user.level || 1} large />
              <div>
                <h1 className="font-orbitron font-black text-3xl md:text-4xl text-cyber-text">{user.username}</h1>
                <p className="font-mono text-xs text-cyber-muted">{user.email}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <GoldCounter gold={user.gold} large />
              <div className="inline-flex items-center gap-2 bg-cyber-bg/90 border-2 border-cyber-coral/50 px-3.5 py-1.5 rounded-lg shadow-holo-red">
                <Flame className="w-4 h-4 text-cyber-coral fill-cyber-coral/30" />
                <span className="font-orbitron font-bold text-xs text-cyber-coral">
                  {streak.current_streak} DAY CORE RESONANCE
                </span>
              </div>
            </div>
          </div>

          {/* 3D Holo Preview */}
          <div className="lg:col-span-5 bg-cyber-bg/90 border-2 border-cyber-border/40 rounded-lg p-2 shadow-inner">
            <PlayerPod3D level={user.level || 1} username={user.username} stats={stats} height="220px" />
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-cyber-border/30">
          <XPBar xp={user.xp} level={user.level} />
        </div>
      </div>

      {/* Grid: 5 RPG Attributes & Trophy Cabinet */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Core Attributes */}
        <HoloPanel
          title="RPG ATTRIBUTE MATRIX"
          subtitle="NEURAL ENHANCEMENTS SCALED VIA HABIT DOMAINS"
          accent="cyan"
          glow
        >
          <CharacterStats stats={stats} />
          <div className="mt-4 font-mono text-xs text-cyber-muted bg-cyber-bg/80 p-3 rounded border border-cyber-border/30 leading-relaxed">
            💡 <strong>TELEMETRY NOTE:</strong> Complete Coding/Study for Intellect, Gym for Strength, Cardio for Vitality, Reading for Wisdom, and Meditation for Discipline.
          </div>
        </HoloPanel>

        {/* Achievement Showcase */}
        <HoloPanel
          title={`TROPHY FEATS [${unlocked.length}/${achievements?.length || 0}]`}
          subtitle="RECORDED MILESTONES & ACHIEVEMENTS"
          accent="gold"
          glow
          badge={
            <span className="font-mono text-xs text-cyber-gold bg-cyber-bg px-2.5 py-1 rounded border border-cyber-gold/50 font-bold">
              {Math.round((unlocked.length / Math.max(1, achievements?.length || 1)) * 100)}% UNLOCKED
            </span>
          }
        >
          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {unlocked.length > 0 && (
              <div className="space-y-2">
                <div className="font-orbitron font-bold text-xs uppercase tracking-wider text-cyber-gold mb-1">
                  ⭐ UNLOCKED FEATS ({unlocked.length})
                </div>
                {unlocked.map((a) => (
                  <AchievementCard key={a.key} achievement={a} />
                ))}
              </div>
            )}

            {locked.length > 0 && (
              <div className="space-y-2 pt-3">
                <div className="font-orbitron font-bold text-xs uppercase tracking-wider text-cyber-muted mb-1">
                  🔒 ENCRYPTED FEATS ({locked.length})
                </div>
                {locked.map((a) => (
                  <AchievementCard key={a.key} achievement={a} />
                ))}
              </div>
            )}
          </div>
        </HoloPanel>
      </div>
    </div>
  );
}
