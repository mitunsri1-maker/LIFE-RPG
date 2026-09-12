import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useQuestStore } from '../store/questStore';
import { characterApi, progressApi, inventoryApi } from '../api';
import QuestCard from '../components/ui/QuestCard';
import XPBar from '../components/ui/XPBar';
import RewardPopup from '../components/ui/RewardPopup';
import LevelUpAnimation from '../components/ui/LevelUpAnimation';
import XPCore from '../components/ui/XPCore';
import CharacterStats from '../components/ui/CharacterStats';
import QuestNodeMap3D from '../components/3d/QuestNodeMap3D';
import HoloButton from '../components/hud/HoloButton';
import { soundFX } from '../utils/soundFX';
import {
  Swords, Plus, Sparkles, Activity, Zap, Coins, Flame, Map, LayoutGrid,
  Shield, Skull, Heart, CheckSquare, Square, ArrowRight, ShoppingBag, Backpack, Cpu, AlertTriangle
} from 'lucide-react';
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
  const [inventory, setInventory] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [completingId, setCompletingId] = useState(null);
  const [levelUpLevel, setLevelUpLevel] = useState(null);
  const [justGainedXP, setJustGainedXP] = useState(false);
  const [bossDamaged, setBossDamaged] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or '3d-map'

  useEffect(() => {
    fetchQuests({ status: 'active' });
    characterApi.get().then((r) => setCharData(r.data)).catch(() => {});
    inventoryApi.get().then((r) => setInventory(r.data?.inventory || [])).catch(() => {});
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
    soundFX.playQuestComplete();
    setBossDamaged(true);
    setTimeout(() => setBossDamaged(false), 900);

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

  const activeQuests = quests.filter((q) => q.status === 'active');
  const { currentInLevel, neededForNext, percent: xpPercent } = calculateLevelProgress(user?.xp || 0, user?.level || 1);

  // Boss HP Calculation: depletes as user clears tasks
  const totalBounties = Math.max(4, activeQuests.length + completedCount);
  const bossHpPercent = Math.max(0, Math.min(100, Math.round(100 - (completedCount / totalBounties) * 100)));

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* ============================================================ */}
      {/* 1. HERO STATUS PANEL: Zero-G Levitation + Luminous Progress  */}
      {/* ============================================================ */}
      <div className="glass-card zero-g-float p-6 md:p-8 shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: User Title & Glowing Progress Bar */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyber-green animate-ping" />
              <p className="font-mono text-xs uppercase tracking-widest text-cyber-cyan font-bold">
                WELCOME BACK, OPERATIVE // CITY GRID: FULL POWER ({xpPercent}%)
              </p>
            </div>

            <div className="space-y-1">
              <h1 className="font-orbitron font-black text-3xl md:text-5xl text-white tracking-tight uppercase drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]">
                LEVEL {user?.level || 1} <span className="text-cyber-cyan">OPERATIVE</span>
              </h1>
              <p className="font-mono text-xs text-cyber-textMuted tracking-wider font-semibold">
                NEURAL LIFE OPERATING SYSTEM // SECTOR ID: {user?.username?.toUpperCase()}
              </p>
            </div>

            {/* Glowing Gradient Progress Bar (Cyan to Magenta) */}
            <div className="space-y-2 pt-1 max-w-xl">
              <div className="w-full h-3 bg-black/40 border border-cyber-cyan/40 rounded-full overflow-hidden p-0.5 relative">
                <div
                  className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-cyber-cyan to-cyber-magenta shadow-[0_0_12px_#00f3ff]"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
              <div className="flex justify-between items-center font-mono text-xs text-cyber-textMuted">
                <span className="text-cyber-cyan font-bold">{currentInLevel} / {neededForNext} XP ({xpPercent}%)</span>
                <span>{Math.max(0, neededForNext - currentInLevel)} XP TO NEXT RANK</span>
              </div>
            </div>

            {/* Quick Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyber-navy/80 border border-cyber-cyan/35 text-xs font-mono">
                <Coins className="w-4 h-4 text-cyber-cyan fill-cyber-cyan/20" />
                <span className="font-bold text-white">{Number(user?.gold || 0).toLocaleString()}</span>
                <span className="text-[10px] text-cyber-dim font-normal">CREDITS</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyber-navy/80 border border-cyber-magenta/35 text-xs font-mono">
                <Flame className="w-4 h-4 text-cyber-magenta fill-cyber-magenta/20" />
                <span className="font-bold text-white">{streak.current_streak || 0} DAYS</span>
                <span className="text-[10px] text-cyber-dim font-normal">STREAK</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyber-navy/80 border border-cyber-green/35 text-xs font-mono">
                <Shield className="w-4 h-4 text-cyber-green fill-cyber-green/20" />
                <span className="font-bold text-white">{completedCount}</span>
                <span className="text-[10px] text-cyber-dim font-normal">CLEARED</span>
              </div>
            </div>
          </div>

          {/* Right: 3D Energy Core & Action Button */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center gap-3">
            <XPCore xpPercent={xpPercent} justGainedXP={justGainedXP} accent="#00f3ff" height="190px" />
            <Link to="/quests">
              <button className="btn-action w-full text-center cursor-pointer shadow-[0_0_15px_rgba(0,243,255,0.4)]">
                INITIALIZE DOSSIER →
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. TWO-COLUMN WIREFRAME GRID: ACTIVE BOUNTIES + BOSS RAID    */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (7 cols): ACTIVE BOUNTIES (DAILY QUESTS) */}
        <div className="lg:col-span-7 glass-card zero-g-float-delayed p-5 md:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-cyber-cyan/25 pb-3">
            <div className="flex items-center gap-2.5">
              <Swords className="w-5 h-5 text-cyber-cyan" />
              <h2 className="font-orbitron font-bold text-lg text-cyber-cyan tracking-wide">
                ACTIVE BOUNTIES (DAILY QUESTS)
              </h2>
            </div>
            <span className="font-mono text-xs text-cyber-textMuted font-bold">
              {activeQuests.length} REMAINING
            </span>
          </div>

          {/* View Mode & New Quest Bar */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="inline-flex bg-black/40 border border-cyber-cyan/30 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-mono font-bold cursor-pointer transition-all ${
                  viewMode === 'grid' ? 'bg-cyber-cyan text-black font-extrabold shadow-[0_0_10px_rgba(0,243,255,0.4)]' : 'text-cyber-textMuted hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3 h-3" /> LIST
              </button>
              <button
                onClick={() => setViewMode('3d-map')}
                className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-mono font-bold cursor-pointer transition-all ${
                  viewMode === '3d-map' ? 'bg-cyber-cyan text-black font-extrabold shadow-[0_0_10px_rgba(0,243,255,0.4)]' : 'text-cyber-textMuted hover:text-white'
                }`}
              >
                <Map className="w-3 h-3" /> 3D MAP
              </button>
            </div>

            <Link to="/quests">
              <HoloButton variant="cyan" size="sm" icon={Plus}>
                NEW BOUNTY
              </HoloButton>
            </Link>
          </div>

          {/* Quest Content */}
          {viewMode === '3d-map' ? (
            <QuestNodeMap3D quests={activeQuests} height="360px" onSelectQuest={(q) => handleComplete(q.id)} />
          ) : activeQuests.length === 0 ? (
            <div className="p-8 text-center space-y-3 bg-black/30 border border-white/10 rounded-xl">
              <div className="text-3xl">🎯</div>
              <h3 className="font-orbitron font-bold text-base text-white">ALL BOUNTIES CLEARED</h3>
              <p className="font-body text-xs text-cyber-textMuted max-w-sm mx-auto">
                No active directives remaining. Initialize a new bounty to maintain neural resonance.
              </p>
              <Link to="/quests">
                <HoloButton variant="cyan" size="sm">
                  CREATE BOUNTY →
                </HoloButton>
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              {activeQuests.map((q) => (
                <div
                  key={q.id}
                  className="flex items-center justify-between p-3.5 bg-black/30 hover:bg-black/50 border border-white/10 hover:border-cyber-cyan/60 rounded-lg transition-all group"
                >
                  {/* Left Checkbox & Quest Info */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <input
                      type="checkbox"
                      checked={false}
                      disabled={completingId === q.id}
                      onChange={() => handleComplete(q.id)}
                      className="w-5 h-5 accent-cyber-cyan cursor-pointer rounded shrink-0 shadow-[0_0_8px_rgba(0,243,255,0.3)] disabled:opacity-50"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="font-rajdhani font-semibold text-base text-white group-hover:text-cyber-cyan truncate transition-colors">
                        {q.title}
                      </p>
                      <div className="flex items-center gap-2 font-mono text-[10px] text-cyber-textMuted">
                        <span className="uppercase text-cyber-cyan font-bold">{q.category}</span>
                        {q.due_date && <span>・ DUE {q.due_date}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Right Rewards & Execute Button */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="font-mono text-xs font-bold text-cyber-magenta">
                      +{q.xp_reward} XP
                    </span>
                    <span className={`font-mono text-[9px] px-2 py-0.5 rounded border uppercase font-bold ${
                      q.difficulty === 'hard'
                        ? 'bg-cyber-magenta/10 text-cyber-magenta border-cyber-magenta/30'
                        : q.difficulty === 'medium'
                        ? 'bg-cyber-cyan/10 text-cyber-cyan border-cyber-cyan/30'
                        : 'bg-cyber-green/10 text-cyber-green border-cyber-green/30'
                    }`}>
                      {q.difficulty}
                    </span>
                    <button
                      onClick={() => handleComplete(q.id)}
                      disabled={completingId === q.id}
                      className="hidden sm:inline-flex items-center gap-1 bg-cyber-cyan hover:bg-cyber-magenta text-black hover:text-white font-orbitron font-bold text-[10px] uppercase px-2.5 py-1 rounded transition-all cursor-pointer shadow-[0_0_10px_rgba(0,243,255,0.3)]"
                    >
                      {completingId === q.id ? 'VERIFYING...' : 'EXECUTE'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN (5 cols): BOSS RAID MODULE + ARSENAL */}
        <div className="lg:col-span-5 space-y-6">
          {/* BOSS RAID MODULE (Matching HTML & Wireframe Spec) */}
          <div className="glass-card zero-g-float-slow p-5 md:p-6 space-y-4 border-cyber-magenta/40 hover:border-cyber-magenta">
            <div className="flex items-center justify-between border-b border-cyber-magenta/20 pb-3">
              <div className="flex items-center gap-2">
                <Skull className="w-5 h-5 text-cyber-magenta animate-pulse" />
                <h3 className="font-orbitron font-bold text-base text-cyber-magenta uppercase tracking-wider">
                  CURRENT BOSS RAID
                </h3>
              </div>
              <span className="font-mono text-xs font-bold text-cyber-magenta bg-cyber-magenta/15 border border-cyber-magenta/40 px-2.5 py-0.5 rounded">
                PHASE 2
              </span>
            </div>

            <div>
              <h4 className="font-orbitron font-black text-lg text-white">
                TARGET: SEMESTER EXAM PREP
              </h4>
              <p className="font-body text-xs text-cyber-textMuted mt-1">
                Deal damage by checking off sub-tasks and daily bounties.
              </p>
            </div>

            {/* Boss HP Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between items-center font-mono text-xs">
                <span className="text-cyber-magenta font-bold flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 fill-cyber-magenta" /> BOSS HP
                </span>
                <span className="text-white font-bold">{bossHpPercent}% REMAINING</span>
              </div>
              <div className="w-full h-4 bg-black/50 border border-cyber-magenta/60 rounded-md overflow-hidden p-0.5 relative shadow-inner">
                <div
                  className={`h-full rounded transition-all duration-700 ${
                    bossDamaged
                      ? 'bg-white shadow-[0_0_20px_#fff]'
                      : 'bg-cyber-magenta shadow-[0_0_12px_#ff0055]'
                  }`}
                  style={{ width: `${bossHpPercent}%` }}
                />
              </div>
            </div>

            {/* Sub-Tasks Preview */}
            <div className="space-y-2 pt-2 border-t border-white/10 text-xs font-mono">
              <span className="text-cyber-dim text-[10px] uppercase tracking-wider block font-bold">
                SUB-DIRECTIVES:
              </span>
              {activeQuests.slice(0, 3).map((q, idx) => (
                <div key={idx} className="flex items-center gap-2 text-cyber-textMuted">
                  <span className="text-cyber-cyan">›</span>
                  <span className="truncate">{q.title}</span>
                  <span className="text-cyber-green text-[10px] ml-auto shrink-0 font-bold">PENDING</span>
                </div>
              ))}
              {activeQuests.length === 0 && (
                <div className="text-cyber-green text-xs flex items-center gap-1.5 font-bold">
                  <CheckSquare className="w-4 h-4" /> Titan Shield Neutralized!
                </div>
              )}
            </div>

            <Link to="/boss-raids" className="block pt-2">
              <button className="btn-action w-full text-center justify-center bg-cyber-magenta hover:bg-cyber-cyan text-white hover:text-black">
                ENTER FULL RAID ARENA →
              </button>
            </Link>
          </div>

          {/* LOOT & REWARDS QUICK-VIEW */}
          <div className="glass-card zero-g-float-delayed p-5 space-y-3.5">
            <div className="flex items-center justify-between border-b border-cyber-cyan/20 pb-2.5">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-cyber-cyan" />
                <h4 className="font-orbitron font-bold text-xs text-cyber-cyan uppercase tracking-wider">
                  LOOT & GEAR ARSENAL
                </h4>
              </div>
              <Link to="/shop" className="font-mono text-[10px] text-cyber-cyan hover:underline">
                BAZAAR →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-black/40 border border-cyber-cyan/20 space-y-1">
                <span className="text-[10px] text-cyber-dim block">CREDIT WALLET</span>
                <span className="font-bold text-cyber-amber flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5" /> {Number(user?.gold || 0).toLocaleString()} C
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-black/40 border border-cyber-cyan/20 space-y-1">
                <span className="text-[10px] text-cyber-dim block">EQUIPPED GEAR</span>
                <span className="font-bold text-cyber-cyan flex items-center gap-1">
                  <Backpack className="w-3.5 h-3.5" /> {inventory.length} ITEMS
                </span>
              </div>
            </div>
          </div>

          {/* RPG ATTRIBUTE MATRIX */}
          <div className="glass-card zero-g-float-slow p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-cyber-cyan/20 pb-2">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyber-cyan" />
                <h4 className="font-orbitron font-bold text-xs text-cyber-cyan uppercase tracking-wider">
                  NEURAL ATTRIBUTE MATRIX
                </h4>
              </div>
              <Link to="/character" className="font-mono text-[10px] text-cyber-cyan hover:underline">
                EXPAND →
              </Link>
            </div>
            <CharacterStats stats={charData?.stats || {}} />
          </div>
        </div>
      </div>

      {lastReward && <RewardPopup reward={lastReward} onClose={clearLastReward} />}
      {levelUpLevel && <LevelUpAnimation level={levelUpLevel} onComplete={() => setLevelUpLevel(null)} />}
    </div>
  );
}
