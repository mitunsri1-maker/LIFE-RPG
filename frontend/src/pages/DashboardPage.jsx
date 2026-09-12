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
import CharacterStats from '../components/ui/CharacterStats';
import QuestNodeMap3D from '../components/3d/QuestNodeMap3D';
import StreakReactor3D from '../components/3d/StreakReactor3D';
import HoloPanel from '../components/hud/HoloPanel';
import HoloButton from '../components/hud/HoloButton';
import { soundFX } from '../utils/soundFX';
import { Swords, Plus, Sparkles, Activity, Zap, Coins, Flame, Map, LayoutGrid, Award, ShieldAlert, Cpu } from 'lucide-react';
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
  const [completedCount, setCompletedCount] = useState(0);
  const [completingId, setCompletingId] = useState(null);
  const [levelUpLevel, setLevelUpLevel] = useState(null);
  const [justGainedXP, setJustGainedXP] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or '3d-map'

  useEffect(() => {
    fetchQuests({ status: 'active' });
    characterApi.get().then((r) => setCharData(r.data)).catch(() => {});
    progressApi.get().then((r) => {
      if (r.data?.streak) setStreak(r.data.streak);
      if (r.data?.stats?.total_completed !== undefined) {
        setCompletedCount(r.data.stats.total_completed);
      }
    }).catch(() => {
      progressApi.getStreak().then((r) => setStreak(r.data.streak || {})).catch(() => {});
    });
  }, []);

  const handleComplete = async (id) => {
    setCompletingId(id);
    const result = await completeQuest(id);
    setCompletingId(null);
    if (result.success) {
      setCompletedCount((prev) => prev + 1);
      // Trigger 3D Energy Core Reactor Pulse Burst
      setJustGainedXP(true);
      setTimeout(() => setJustGainedXP(false), 1600);

      refreshUser();
      characterApi.get().then((r) => setCharData(r.data)).catch(() => {});
      progressApi.get().then((r) => {
        if (r.data?.streak) setStreak(r.data.streak);
        if (r.data?.stats?.total_completed !== undefined) {
          setCompletedCount(r.data.stats.total_completed);
        }
      }).catch(() => {});
      if (result.reward?.level_up) setLevelUpLevel(result.reward.new_level);
    }
  };

  const handleDelete = async (id) => {
    soundFX.playClick();
    if (confirm('Abort this mission directive?')) await deleteQuest(id);
  };

  const activeQuests = quests.filter((q) => q.status === 'active').slice(0, 6);
  const { currentInLevel, neededForNext, percent: xpPercent } = calculateLevelProgress(user?.xp || 0, user?.level || 1);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* 1. Central Welcome Operative Header matching dark cyberpunk holographic HUD */}
      <div className="relative city-glass-elevated border border-cyber-cyan/35 rounded-2xl p-6 md:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.6)] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Telemetry info */}
          <div className="lg:col-span-7 space-y-3">
            <div className="inline-flex items-center gap-2 bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan font-mono text-[11px] px-3 py-1 rounded-full font-bold tracking-widest uppercase shadow-[0_0_10px_rgba(0,229,255,0.15)]">
              <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-ping" />
              WELCOME BACK, OPERATIVE // {user?.username}
            </div>

            <h1 className="font-orbitron font-black text-3xl md:text-5xl text-cyber-text tracking-tight uppercase text-glow-cyan">
              LEVEL <span className="text-cyber-cyan">{user?.level || 1}</span>
            </h1>

            <p className="font-mono text-sm text-cyber-textMuted tracking-wide font-medium">
              {currentInLevel} / {neededForNext} XP ({xpPercent}%)
            </p>

            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="inline-flex items-center gap-2 city-glass border border-cyber-cyan/25 px-3.5 py-1.5 rounded-xl font-mono text-xs text-cyber-text shadow-sm">
                <Coins className="w-4 h-4 text-cyber-cyan fill-cyber-cyan/20" />
                <span className="font-bold">{Number(user?.gold || 0).toLocaleString()}</span>
                <span className="text-[10px] text-cyber-dim font-normal">CREDITS</span>
              </div>
              <div className="inline-flex items-center gap-2 city-glass border border-cyber-magenta/25 px-3.5 py-1.5 rounded-xl font-mono text-xs text-cyber-text shadow-sm">
                <Flame className="w-4 h-4 text-cyber-magenta fill-cyber-magenta/20" />
                <span className="font-bold">{streak.current_streak || 0}</span>
                <span className="text-[10px] text-cyber-dim font-normal">DAY STREAK</span>
              </div>
              <div className="inline-flex items-center gap-2 city-glass border border-cyber-amber/25 px-3.5 py-1.5 rounded-xl font-mono text-xs text-cyber-text shadow-sm">
                <Zap className="w-4 h-4 text-cyber-amber fill-cyber-amber/20" />
                <span className="font-bold">{xpPercent}%</span>
                <span className="text-[10px] text-cyber-dim font-normal">CORE ENERGY</span>
              </div>
            </div>
          </div>

          {/* Right 3D Energy Core Hologram Projection */}
          <div className="lg:col-span-5 city-glass border border-cyber-cyan/30 rounded-2xl p-3 relative shadow-[inset_0_0_20px_rgba(0,229,255,0.08)] flex flex-col items-center justify-center">
            <XPCore xpPercent={xpPercent} justGainedXP={justGainedXP} accent="#00E5FF" height="210px" />
          </div>
        </div>
      </div>

      {/* 2. Main RPG Command Center Grid: 3D Operative Chamber + Progression & Attribute Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Operative Chamber */}
        <div className="lg:col-span-5 city-glass border border-cyber-cyan/25 rounded-2xl p-5 shadow-lg flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between border-b border-cyber-cyan/20 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyber-cyan animate-pulse" />
              <span className="font-orbitron font-bold text-sm text-cyber-text tracking-wide">
                OPERATIVE STATUS
              </span>
            </div>
            <span className="font-mono text-xs text-cyber-green bg-cyber-green/10 px-2.5 py-0.5 rounded-full border border-cyber-green/30 font-bold uppercase shadow-[0_0_8px_rgba(57,255,136,0.2)]">
              RESONANCE 100%
            </span>
          </div>

          {/* 3D Visualizer Canvas */}
          <div className="my-2 relative flex items-center justify-center">
            <PlayerPod3D
              level={user?.level || 1}
              username={user?.username}
              stats={charData?.stats}
              justGainedXP={justGainedXP}
              xpPercent={xpPercent}
              height="280px"
            />
          </div>

          <div className="font-mono text-xs text-center text-cyber-textMuted bg-cyber-navy/70 p-2.5 rounded-lg border border-cyber-cyan/20 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-ping" />
            <span>NEURAL MATRIX SYNC: OPTIMAL</span>
          </div>
        </div>

        {/* Right Column: XP Energy Matrix + RPG Attribute Matrix */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <XPBar xp={user?.xp || 0} level={user?.level || 1} />

          {/* Attribute Matrix Panel */}
          <div className="city-glass border border-cyber-cyan/25 rounded-2xl p-5 shadow-lg space-y-3.5">
            <div className="flex items-center justify-between border-b border-cyber-cyan/20 pb-2.5">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyber-cyan" />
                <h3 className="font-orbitron font-bold text-sm text-cyber-text tracking-wider uppercase">
                  ATTRIBUTE MATRIX // CORE TELEMETRY
                </h3>
              </div>
              <Link
                to="/character"
                className="font-mono text-[10px] text-cyber-cyan hover:underline uppercase tracking-wider"
              >
                VIEW FULL BIO →
              </Link>
            </div>

            <CharacterStats stats={charData?.stats || {}} />
          </div>
        </div>
      </div>

      {/* 3. Six Compact Holographic Stat Modules */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="city-glass border border-cyber-cyan/25 rounded-xl p-4 shadow-sm hover:border-cyber-cyan/60 hover:shadow-[0_0_15px_rgba(0,229,255,0.2)] transition-all">
          <div className="text-xl mb-1">⚡</div>
          <div className="font-orbitron font-black text-2xl text-cyber-cyan text-glow-cyan">LVL {user?.level || 1}</div>
          <div className="font-mono text-[10px] uppercase text-cyber-dim tracking-wider">Access Tier</div>
        </div>

        <div className="city-glass border border-cyber-amber/25 rounded-xl p-4 shadow-sm hover:border-cyber-amber/60 hover:shadow-[0_0_15px_rgba(255,184,77,0.2)] transition-all">
          <div className="text-xl mb-1">🪙</div>
          <div className="font-orbitron font-black text-2xl text-cyber-amber text-glow-gold">{Number(user?.gold || 0).toLocaleString()}</div>
          <div className="font-mono text-[10px] uppercase text-cyber-dim tracking-wider">Credits</div>
        </div>

        <div className="city-glass border border-cyber-magenta/25 rounded-xl p-4 shadow-sm hover:border-cyber-magenta/60 hover:shadow-[0_0_15px_rgba(255,45,166,0.2)] transition-all">
          <div className="text-xl mb-1">🔥</div>
          <div className="font-orbitron font-black text-2xl text-cyber-magenta text-glow-magenta">{streak.current_streak || 0}D</div>
          <div className="font-mono text-[10px] uppercase text-cyber-dim tracking-wider">Day Streak</div>
        </div>

        <div className="city-glass border border-cyber-green/25 rounded-xl p-4 shadow-sm hover:border-cyber-green/60 hover:shadow-[0_0_15px_rgba(57,255,136,0.2)] transition-all">
          <div className="text-xl mb-1">🏆</div>
          <div className="font-orbitron font-black text-2xl text-cyber-green text-glow-green">{streak.best_streak || 0}D</div>
          <div className="font-mono text-[10px] uppercase text-cyber-dim tracking-wider">Best Record</div>
        </div>

        <div className="city-glass border border-cyber-violet/25 rounded-xl p-4 shadow-sm hover:border-cyber-violet/60 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)] transition-all">
          <div className="text-xl mb-1">🎯</div>
          <div className="font-orbitron font-black text-2xl text-cyber-violet text-glow-violet">{completedCount}</div>
          <div className="font-mono text-[10px] uppercase text-cyber-dim tracking-wider">Quests Cleared</div>
        </div>

        <div className="city-glass border border-cyber-cyan/25 rounded-xl p-4 shadow-sm hover:border-cyber-cyan/60 hover:shadow-[0_0_15px_rgba(0,229,255,0.2)] transition-all">
          <div className="text-xl mb-1">⚡</div>
          <div className="font-orbitron font-black text-2xl text-cyber-cyan text-glow-cyan">{xpPercent}%</div>
          <div className="font-mono text-[10px] uppercase text-cyber-dim tracking-wider">Core Resonance</div>
        </div>
      </div>

      {/* Active Objectives / Mission Neural Map Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyber-cyan/15 border border-cyber-cyan/40 flex items-center justify-center font-bold shadow-[0_0_10px_rgba(0,229,255,0.25)]">
              <Swords className="w-5 h-5 text-cyber-cyan" />
            </div>
            <div>
              <h2 className="font-orbitron font-bold text-2xl text-cyber-text tracking-wide">
                ACTIVE QUESTS <span className="text-cyber-cyan text-lg font-mono">({activeQuests.length})</span>
              </h2>
              <p className="font-mono text-xs text-cyber-textMuted">
                EXECUTE REAL-WORLD HABITS TO GENERATE CITY ENERGY
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Switcher */}
            <div className="inline-flex city-glass border border-cyber-cyan/30 rounded-xl p-1 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  viewMode === 'grid' ? 'bg-cyber-cyan text-cyber-bg shadow-[0_0_10px_rgba(0,229,255,0.4)]' : 'text-cyber-textMuted hover:text-cyber-text'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" /> GRID
              </button>
              <button
                onClick={() => setViewMode('3d-map')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  viewMode === '3d-map' ? 'bg-cyber-cyan text-cyber-bg shadow-[0_0_10px_rgba(0,229,255,0.4)]' : 'text-cyber-textMuted hover:text-cyber-text'
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
