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
      {/* Central Welcome Operative Header matching reference design card */}
      <div className="relative city-glass-elevated border border-white/90 rounded-2xl p-6 md:p-8 shadow-day-card overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Telemetry info */}
          <div className="lg:col-span-7 space-y-3">
            <div className="inline-flex items-center gap-2 bg-sky-50 border border-sky-200 text-sky-700 font-mono text-[11px] px-3 py-1 rounded-full font-bold tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
              WELCOME BACK, OPERATIVE
            </div>

            <h1 className="font-orbitron font-black text-3xl md:text-5xl text-slate-900 tracking-tight uppercase">
              LEVEL <span className="text-sky-500">{user?.level || 1}</span>
            </h1>

            <p className="font-mono text-sm text-slate-500 tracking-wide font-medium">
              {user?.xp || 0} / {calculateLevelProgress(user?.xp || 0, user?.level || 1).neededForNext} XP
            </p>

            {/* Quick Metrics from reference design */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="inline-flex items-center gap-2 city-glass border border-slate-200 px-3.5 py-1.5 rounded-xl font-mono text-xs text-slate-700 shadow-2xs">
                <Coins className="w-4 h-4 text-sky-500 fill-sky-500/20" />
                <span className="font-bold">{Number(user?.gold || 0).toLocaleString()}</span>
                <span className="text-[10px] text-slate-400 font-normal">CREDITS</span>
              </div>
              <div className="inline-flex items-center gap-2 city-glass border border-slate-200 px-3.5 py-1.5 rounded-xl font-mono text-xs text-slate-700 shadow-2xs">
                <Flame className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                <span className="font-bold">{streak.current_streak || 0}</span>
                <span className="text-[10px] text-slate-400 font-normal">DAY STREAK</span>
              </div>
              <div className="inline-flex items-center gap-2 city-glass border border-slate-200 px-3.5 py-1.5 rounded-xl font-mono text-xs text-slate-700 shadow-2xs">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500/20" />
                <span className="font-bold">{xpPercent}%</span>
                <span className="text-[10px] text-slate-400 font-normal">CORE ENERGY</span>
              </div>
            </div>
          </div>

          {/* Right 3D Diamond Crystal Hologram Projection */}
          <div className="lg:col-span-5 city-glass border border-sky-100 rounded-2xl p-3 relative shadow-inner flex flex-col items-center justify-center">
            <XPCore xpPercent={xpPercent} justGainedXP={justGainedXP} accent="#00B4D8" height="210px" />
          </div>
        </div>
      </div>

      {/* 3D Operative Pod + Telemetry & Progress Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Operative Chamber */}
        <div className="lg:col-span-5 city-glass border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-500 animate-pulse" />
              <span className="font-orbitron font-bold text-sm text-slate-800 tracking-wide">
                OPERATIVE STATUS
              </span>
            </div>
            <span className="font-mono text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-bold uppercase">
              RESONANCE 100%
            </span>
          </div>

          {/* 3D Visualizer Canvas */}
          <div className="my-2 relative flex items-center justify-center">
            <PlayerPod3D level={user?.level || 1} username={user?.username} stats={charData?.stats} height="230px" />
          </div>

          <div className="font-mono text-xs text-center text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
            <span>SOLAR HARVESTING GRID: OPTIMAL</span>
          </div>
        </div>

        {/* XP Energy Matrix + Telemetry Stat Grid */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <XPBar xp={user?.xp || 0} level={user?.level || 1} />

          {/* 4 Daylight Telemetry Modules */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="city-glass border border-slate-200/80 rounded-xl p-4 shadow-xs hover:border-sky-300 transition-all">
              <div className="text-xl mb-1">⚡</div>
              <div className="font-orbitron font-black text-2xl text-sky-600">LVL {user?.level || 1}</div>
              <div className="font-mono text-[10px] uppercase text-slate-400 tracking-wider">Access Tier</div>
            </div>

            <div className="city-glass border border-slate-200/80 rounded-xl p-4 shadow-xs hover:border-amber-300 transition-all">
              <div className="text-xl mb-1">🪙</div>
              <div className="font-orbitron font-black text-2xl text-amber-600">{Number(user?.gold || 0).toLocaleString()}</div>
              <div className="font-mono text-[10px] uppercase text-slate-400 tracking-wider">Credits</div>
            </div>

            <div className="city-glass border border-slate-200/80 rounded-xl p-4 shadow-xs hover:border-rose-300 transition-all">
              <div className="text-xl mb-1">🔥</div>
              <div className="font-orbitron font-black text-2xl text-rose-600">{streak.current_streak || 0}D</div>
              <div className="font-mono text-[10px] uppercase text-slate-400 tracking-wider">Day Streak</div>
            </div>

            <div className="city-glass border border-slate-200/80 rounded-xl p-4 shadow-xs hover:border-emerald-300 transition-all">
              <div className="text-xl mb-1">🏆</div>
              <div className="font-orbitron font-black text-2xl text-emerald-600">{streak.best_streak || 0}D</div>
              <div className="font-mono text-[10px] uppercase text-slate-400 tracking-wider">Best Record</div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Objectives / Mission Neural Map Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center font-bold shadow-xs">
              <Swords className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <h2 className="font-orbitron font-bold text-2xl text-slate-800 tracking-wide">
                ACTIVE QUESTS <span className="text-sky-600 text-lg font-mono">({activeQuests.length})</span>
              </h2>
              <p className="font-mono text-xs text-slate-500">
                EXECUTE REAL-WORLD HABITS TO GENERATE CITY ENERGY
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Switcher */}
            <div className="inline-flex city-glass border border-slate-200 rounded-xl p-1 shadow-2xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  viewMode === 'grid' ? 'bg-sky-500 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" /> GRID
              </button>
              <button
                onClick={() => setViewMode('3d-map')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  viewMode === '3d-map' ? 'bg-sky-500 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
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
