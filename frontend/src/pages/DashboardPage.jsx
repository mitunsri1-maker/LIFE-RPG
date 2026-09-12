import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useQuestStore } from '../store/questStore';
import { characterApi, progressApi } from '../api';
import QuestCard from '../components/ui/QuestCard';
import XPBar from '../components/ui/XPBar';
import LevelBadge from '../components/ui/LevelBadge';
import RewardPopup from '../components/ui/RewardPopup';
import LevelUpAnimation from '../components/ui/LevelUpAnimation';
import PlayerPod3D from '../components/3d/PlayerPod3D';
import XPCore from '../components/ui/XPCore';
import QuestNodeMap3D from '../components/3d/QuestNodeMap3D';
import StreakReactor3D from '../components/3d/StreakReactor3D';
import HoloPanel from '../components/hud/HoloPanel';
import HoloButton from '../components/hud/HoloButton';
import { soundFX } from '../utils/soundFX';
import { Swords, Plus, Sparkles, Activity, Zap, Coins, Flame, Map, LayoutGrid } from 'lucide-react';
import { Link } from 'react-router-dom';

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

export default function DashboardPage() {
  const { user, refreshUser } = useAuthStore();
  const { quests, fetchQuests, completeQuest, deleteQuest, clearLastReward, lastReward } = useQuestStore();
  const [charData, setCharData] = useState(null);
  const [streak, setStreak] = useState({ current_streak: 0, best_streak: 0 });
  const [completingId, setCompletingId] = useState(null);
  const [levelUpLevel, setLevelUpLevel] = useState(null);
  const [justGainedXP, setJustGainedXP] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or '3d-map'

  useEffect(() => {
    fetchQuests({ status: 'active' });
    characterApi.get().then((r) => setCharData(r.data)).catch(() => {});
    progressApi.getStreak().then((r) => setStreak(r.data.streak || {})).catch(() => {});
  }, []);

  const handleComplete = async (id) => {
    setCompletingId(id);
    const result = await completeQuest(id);
    setCompletingId(null);
    if (result.success) {
      // Trigger 3D Energy Core Reactor Pulse Burst
      setJustGainedXP(true);
      setTimeout(() => setJustGainedXP(false), 1600);

      refreshUser();
      if (result.reward?.level_up) setLevelUpLevel(result.reward.new_level);
    }
  };

  const handleDelete = async (id) => {
    soundFX.playClick();
    if (confirm('Abort this mission directive?')) await deleteQuest(id);
  };

  const activeQuests = quests.filter((q) => q.status === 'active').slice(0, 6);
  const { percent: xpPercent } = calculateLevelProgress(user?.xp || 0, user?.level || 1);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Central Command Header with 3D Hologram Player Chamber */}
      <div className="relative city-glass-elevated border border-cyber-cyan/40 rounded-2xl p-6 md:p-8 shadow-glass-depth overflow-hidden cyber-corner-tl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Telemetry info */}
          <div className="lg:col-span-7 space-y-3">
            <div className="inline-flex items-center gap-2 city-glass border border-cyber-cyan/50 text-cyber-cyan font-mono text-[11px] px-3 py-1 rounded-full font-bold tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-ping" />
              COMMAND NEXUS // PLAYER STATUS: ACTIVE
            </div>

            <h1 className="font-orbitron font-black text-3xl md:text-5xl text-cyber-text tracking-tight uppercase">
              OPERATIVE <span className="text-cyber-cyan text-glow-cyan">{user?.username}</span>
            </h1>

            <p className="font-body text-sm text-cyber-textMuted max-w-lg leading-relaxed">
              Your real-life tasks power the central energy reactor. Clear objectives to advance your world evolution tier and expand the skyline.
            </p>

            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="inline-flex items-center gap-2 city-glass border border-cyber-cyan/40 px-3 py-1.5 rounded-lg font-mono text-xs text-cyber-cyan">
                <Zap className="w-4 h-4 fill-cyber-cyan" />
                <span>TIER {user?.level || 1} OVERRIDE</span>
              </div>
              <div className="inline-flex items-center gap-2 city-glass border border-cyber-amber/40 px-3 py-1.5 rounded-lg font-mono text-xs text-cyber-amber">
                <Coins className="w-4 h-4 fill-cyber-amber" />
                <span>{Number(user?.gold || 0).toLocaleString()} CREDITS</span>
              </div>
              <div className="inline-flex items-center gap-2 city-glass border border-cyber-coral/40 px-3 py-1.5 rounded-lg font-mono text-xs text-cyber-coral">
                <Flame className="w-4 h-4 fill-cyber-coral" />
                <span>{streak.current_streak || 0}D CORE CHARGE</span>
              </div>
            </div>
          </div>

          {/* Right 3D Player Pod Projection */}
          <div className="lg:col-span-5 city-glass border border-cyber-cyan/35 rounded-xl p-2 relative shadow-inner flex flex-col items-center justify-center">
            <PlayerPod3D level={user?.level || 1} username={user?.username} stats={charData?.stats} height="240px" />
          </div>
        </div>
      </div>

      {/* 3D XP Core Energy Reactor + Telemetry Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 3D Energy Core Reactor */}
        <div className="lg:col-span-5 city-glass border border-cyber-cyan/40 rounded-2xl p-5 shadow-glass-depth flex flex-col justify-between overflow-hidden cyber-corner-tl">
          <div className="flex items-center justify-between border-b border-cyber-border/30 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyber-cyan animate-pulse" />
              <span className="font-orbitron font-bold text-sm text-cyber-text tracking-wide">
                XP REACTOR CORE
              </span>
            </div>
            <span className={`font-mono text-xs px-2.5 py-0.5 rounded border font-bold uppercase ${
              justGainedXP
                ? 'bg-cyber-green/20 text-cyber-green border-cyber-green animate-pulse'
                : 'city-glass text-cyber-cyan border-cyber-cyan/40'
            }`}>
              {justGainedXP ? '⚡ ENERGY INGESTION' : `${xpPercent}% CAPACITY`}
            </span>
          </div>

          {/* 3D Visualizer Canvas */}
          <div className="my-2 relative flex items-center justify-center">
            <XPCore xpPercent={xpPercent} justGainedXP={justGainedXP} accent="#00F0FF" height="220px" />
          </div>

          <div className="font-mono text-xs text-center text-cyber-textMuted city-glass p-2.5 rounded-lg border border-cyber-border/30 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-ping" />
            <span>ORBIT RESONANCE SCALES WITH LEVEL CAPACITY</span>
          </div>
        </div>

        {/* XP Energy Matrix + Telemetry Stat Grid */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <XPBar xp={user?.xp || 0} level={user?.level || 1} />

          {/* 4 Cyber Telemetry Modules */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="city-glass border border-cyber-cyan/35 rounded-xl p-4 shadow-[0_0_20px_rgba(0,240,255,0.12)]">
              <div className="text-xl mb-1">⚡</div>
              <div className="font-orbitron font-black text-2xl text-cyber-cyan text-glow-cyan">LVL {user?.level || 1}</div>
              <div className="font-mono text-[10px] uppercase text-cyber-textMuted tracking-wider">Access Tier</div>
            </div>

            <div className="city-glass border border-cyber-amber/35 rounded-xl p-4 shadow-[0_0_20px_rgba(255,184,0,0.12)]">
              <div className="text-xl mb-1">🪙</div>
              <div className="font-orbitron font-black text-2xl text-cyber-amber text-glow-gold">{Number(user?.gold || 0).toLocaleString()}</div>
              <div className="font-mono text-[10px] uppercase text-cyber-textMuted tracking-wider">Credits</div>
            </div>

            <div className="city-glass border border-cyber-coral/35 rounded-xl p-4 shadow-[0_0_20px_rgba(255,51,102,0.12)]">
              <div className="text-xl mb-1">🔥</div>
              <div className="font-orbitron font-black text-2xl text-cyber-coral text-glow-magenta">{streak.current_streak || 0}D</div>
              <div className="font-mono text-[10px] uppercase text-cyber-textMuted tracking-wider">Core Charge</div>
            </div>

            <div className="city-glass border border-cyber-green/35 rounded-xl p-4 shadow-[0_0_20px_rgba(0,255,157,0.12)]">
              <div className="text-xl mb-1">🏆</div>
              <div className="font-orbitron font-black text-2xl text-cyber-green text-glow-green">{streak.best_streak || 0}D</div>
              <div className="font-mono text-[10px] uppercase text-cyber-textMuted tracking-wider">Best Record</div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Objectives / Mission Neural Map Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyber-cyan/20 border-2 border-cyber-cyan flex items-center justify-center font-bold shadow-holo-cyan">
              <Swords className="w-5 h-5 text-cyber-cyan" />
            </div>
            <div>
              <h2 className="font-orbitron font-bold text-2xl text-cyber-text tracking-wide text-glow-cyan">
                ACTIVE MISSION DIRECTIVES
              </h2>
              <p className="font-mono text-xs text-cyber-textMuted">
                EXECUTE REAL-WORLD HABITS TO CHANNEL HARVESTED XP ENERGY
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Switcher */}
            <div className="inline-flex city-glass border border-cyber-border/40 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-bold transition-all cursor-pointer ${
                  viewMode === 'grid' ? 'bg-cyber-cyan text-cyber-bg shadow-holo-cyan' : 'text-cyber-textMuted hover:text-cyber-text'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" /> GRID
              </button>
              <button
                onClick={() => setViewMode('3d-map')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-bold transition-all cursor-pointer ${
                  viewMode === '3d-map' ? 'bg-cyber-cyan text-cyber-bg shadow-holo-cyan' : 'text-cyber-textMuted hover:text-cyber-text'
                }`}
              >
                <Map className="w-3.5 h-3.5" /> 3D MAP
              </button>
            </div>

            <Link to="/quests">
              <HoloButton variant="cyan" size="sm" icon={Plus}>
                NEW QUEST
              </HoloButton>
            </Link>
          </div>
        </div>

        {/* 3D Map View or Grid View */}
        {viewMode === '3d-map' ? (
          <QuestNodeMap3D quests={activeQuests} height="380px" onSelectQuest={(q) => handleComplete(q.id)} />
        ) : activeQuests.length === 0 ? (
          <div className="city-glass border border-dashed border-cyber-border/50 rounded-2xl p-12 text-center space-y-4 shadow-glass-depth">
            <div className="w-14 h-14 city-glass border-2 border-cyber-cyan rounded-xl shadow-holo-cyan mx-auto flex items-center justify-center text-3xl">
              🎯
            </div>
            <div className="space-y-1">
              <h3 className="font-orbitron font-bold text-xl text-cyber-text">NO PENDING DIRECTIVES</h3>
              <p className="font-body text-xs text-cyber-textMuted max-w-sm mx-auto">
                All daily objectives cleared! Forge a new mission to maintain core resonance.
              </p>
            </div>
            <Link to="/quests">
              <HoloButton variant="cyan" size="md">
                INITIALIZE NEW QUEST DIRECTIVE →
              </HoloButton>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeQuests.map((q) => (
              <QuestCard
                key={q.id}
                quest={q}
                onComplete={handleComplete}
                onDelete={handleDelete}
                isCompleting={completingId === q.id}
              />
            ))}
          </div>
        )}
      </div>

      {lastReward && <RewardPopup reward={lastReward} onClose={clearLastReward} />}
      {levelUpLevel && <LevelUpAnimation level={levelUpLevel} onComplete={() => setLevelUpLevel(null)} />}
    </div>
  );
}
