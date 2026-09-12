import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useQuestStore } from '../store/questStore';
import { characterApi, progressApi, shopApi, inventoryApi } from '../api';
import QuestCard from '../components/ui/QuestCard';
import XPBar from '../components/ui/XPBar';
import LevelBadge from '../components/ui/LevelBadge';
import RewardPopup from '../components/ui/RewardPopup';
import LevelUpAnimation from '../components/ui/LevelUpAnimation';
import PlayerPod3D from '../components/3d/PlayerPod3D';
import XPCore from '../components/ui/XPCore';
import CharacterStats from '../components/ui/CharacterStats';
import QuestNodeMap3D from '../components/3d/QuestNodeMap3D';
import HoloButton from '../components/hud/HoloButton';
import { soundFX } from '../utils/soundFX';
import {
  Swords, Plus, Sparkles, Activity, Zap, Coins, Flame, Map, LayoutGrid,
  Shield, Skull, Heart, CheckSquare, Square, ArrowRight, ShoppingBag, Backpack, Cpu
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
    setBossDamaged(true);
    setTimeout(() => setBossDamaged(false), 800);

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
      {/* 1. HERO PANEL: City Sync & Level Progress (Wireframe Spec)    */}
      {/* ============================================================ */}
      <div className="relative hud-glass rounded-2xl p-6 md:p-8 shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Telemetry info */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyber-green animate-ping" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-cyber-green">
                CITY GRID STATUS: ONLINE (POWER LEVEL {xpPercent}%)
              </span>
            </div>

            <div className="space-y-1">
              <h1 className="font-orbitron font-black text-3xl md:text-5xl text-cyber-text tracking-tight uppercase text-glow-cyan">
                LEVEL {user?.level || 1}: <span className="text-cyber-cyan">OPERATIVE</span>
              </h1>
              <p className="font-mono text-xs text-cyber-textMuted tracking-wider font-semibold">
                SECTOR ID // {user?.username?.toUpperCase()}・GRID RESONANCE: OPTIMAL
              </p>
            </div>

            {/* Tactical Energy Progress Bar */}
            <div className="space-y-2 pt-1">
              <div className="flex justify-between items-center font-mono text-xs">
                <span className="text-cyber-cyan font-bold tracking-wider">
                  {currentInLevel} / {neededForNext} XP ({xpPercent}%)
                </span>
                <span className="text-cyber-textMuted font-medium">
                  {Math.max(0, neededForNext - currentInLevel)} XP TO NEXT TIER
                </span>
              </div>
              <div className="h-4 w-full bg-cyber-navy/90 border border-cyber-cyan/40 rounded-full overflow-hidden p-0.5 shadow-inner relative">
                <div
                  className="h-full bg-gradient-to-r from-cyber-cyan via-cyber-violet to-cyber-magenta rounded-full transition-all duration-700 shadow-[0_0_15px_rgba(0,229,255,0.4)]"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>

            {/* Quick Metrics Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyber-navy/80 border border-cyber-cyan/30 text-xs font-mono">
                <Coins className="w-4 h-4 text-cyber-cyan fill-cyber-cyan/20" />
                <span className="font-bold text-cyber-text">{Number(user?.gold || 0).toLocaleString()}</span>
                <span className="text-[10px] text-cyber-dim font-normal">CREDITS</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyber-navy/80 border border-cyber-magenta/30 text-xs font-mono">
                <Flame className="w-4 h-4 text-cyber-magenta fill-cyber-magenta/20" />
                <span className="font-bold text-cyber-text">{streak.current_streak || 0} DAYS</span>
                <span className="text-[10px] text-cyber-dim font-normal">STREAK</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyber-navy/80 border border-cyber-amber/30 text-xs font-mono">
                <Zap className="w-4 h-4 text-cyber-amber fill-cyber-amber/20" />
                <span className="font-bold text-cyber-text">{xpPercent}%</span>
                <span className="text-[10px] text-cyber-dim font-normal">CORE POWER</span>
              </div>
            </div>
          </div>

          {/* Right 3D Operative & Energy Core Preview */}
          <div className="lg:col-span-4 hud-card rounded-2xl p-3 relative flex flex-col items-center justify-center">
            <XPCore xpPercent={xpPercent} justGainedXP={justGainedXP} accent="#00E5FF" height="190px" />
            <div className="font-mono text-[10px] text-cyber-cyan tracking-widest text-center mt-1">
              ENERGY CORE // ONLINE
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. MAIN 2-COLUMN WIREFRAME GRID: ACTIVE BOUNTIES + BOSS RAID */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (7 cols): ACTIVE BOUNTIES (DAILY QUESTS) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyber-cyan/20 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyber-cyan/15 border border-cyber-cyan/40 flex items-center justify-center">
                <Swords className="w-4 h-4 text-cyber-cyan" />
              </div>
              <div>
                <h2 className="font-orbitron font-bold text-xl text-cyber-text tracking-wide">
                  ACTIVE BOUNTIES <span className="text-cyber-cyan text-sm font-mono">({activeQuests.length})</span>
                </h2>
                <p className="font-mono text-[11px] text-cyber-textMuted">
                  DAILY TACTICAL RPG MISSIONS
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Grid / 3D Map View Toggle */}
              <div className="inline-flex hud-card p-0.5 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono font-bold cursor-pointer transition-all ${
                    viewMode === 'grid' ? 'bg-cyber-cyan text-cyber-bg' : 'text-cyber-textMuted hover:text-cyber-text'
                  }`}
                >
                  <LayoutGrid className="w-3 h-3" /> GRID
                </button>
                <button
                  onClick={() => setViewMode('3d-map')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono font-bold cursor-pointer transition-all ${
                    viewMode === '3d-map' ? 'bg-cyber-cyan text-cyber-bg' : 'text-cyber-textMuted hover:text-cyber-text'
                  }`}
                >
                  <Map className="w-3 h-3" /> 3D
                </button>
              </div>

              <Link to="/quests">
                <HoloButton variant="cyan" size="sm" icon={Plus}>
                  NEW BOUNTY
                </HoloButton>
              </Link>
            </div>
          </div>

          {/* 3D Map or Checklist View */}
          {viewMode === '3d-map' ? (
            <QuestNodeMap3D quests={activeQuests} height="360px" onSelectQuest={(q) => handleComplete(q.id)} />
          ) : activeQuests.length === 0 ? (
            <div className="hud-glass rounded-2xl p-10 text-center space-y-3">
              <div className="text-3xl">🎯</div>
              <h3 className="font-orbitron font-bold text-lg text-cyber-text">ALL BOUNTIES CLEARED</h3>
              <p className="font-body text-xs text-cyber-textMuted max-w-sm mx-auto">
                No active directives remaining. Forge a new tactical habit to generate additional city energy.
              </p>
              <Link to="/quests">
                <HoloButton variant="cyan" size="sm">
                  INITIALIZE BOUNTY →
                </HoloButton>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Tactical RPG Interactive Checklist */}
              {activeQuests.map((q) => (
                <div
                  key={q.id}
                  className="hud-card rounded-xl p-3.5 sm:p-4 flex items-center justify-between gap-3 group transition-all"
                >
                  {/* Left: Holographic Checkbox + Title */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <button
                      onClick={() => handleComplete(q.id)}
                      disabled={completingId === q.id}
                      aria-label="Complete Bounty"
                      className="w-6 h-6 rounded-md border-2 border-cyber-cyan/50 hover:border-cyber-cyan bg-cyber-navy/80 flex items-center justify-center text-cyber-cyan transition-colors shrink-0 cursor-pointer shadow-[0_0_8px_rgba(0,229,255,0.2)] disabled:opacity-50"
                    >
                      {completingId === q.id ? (
                        <span className="w-3 h-3 rounded-full border-2 border-cyber-cyan border-t-transparent animate-spin" />
                      ) : (
                        <CheckSquare className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity" />
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <p className="font-orbitron font-bold text-sm text-cyber-text group-hover:text-cyber-cyan truncate transition-colors">
                        {q.title}
                      </p>
                      <div className="flex items-center gap-2 pt-1 font-mono text-[10px] text-cyber-textMuted">
                        <span className="uppercase text-cyber-dim">{q.category}</span>
                        {q.due_date && <span>・ DUE {q.due_date}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Right: Difficulty & Reward Badges + Execute Button */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`font-mono text-[9px] px-2 py-0.5 rounded border uppercase font-bold ${
                      q.difficulty === 'hard'
                        ? 'bg-cyber-magenta/10 text-cyber-magenta border-cyber-magenta/30'
                        : q.difficulty === 'medium'
                        ? 'bg-cyber-cyan/10 text-cyber-cyan border-cyber-cyan/30'
                        : 'bg-cyber-green/10 text-cyber-green border-cyber-green/30'
                    }`}>
                      {q.difficulty}
                    </span>

                    <span className="font-mono text-[11px] font-bold text-cyber-green bg-cyber-green/10 border border-cyber-green/30 px-2 py-0.5 rounded">
                      +{q.xp_reward} XP
                    </span>

                    <button
                      onClick={() => handleComplete(q.id)}
                      disabled={completingId === q.id}
                      className="hidden sm:inline-flex items-center gap-1 bg-cyber-cyan hover:bg-cyber-cyan/85 text-cyber-bg font-orbitron font-bold text-[10px] uppercase px-2.5 py-1 rounded shadow-[0_0_10px_rgba(0,229,255,0.3)] transition-all cursor-pointer"
                    >
                      <span>EXECUTE</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN (5 cols): BOSS RAID & LOOT QUICK-VIEW */}
        <div className="lg:col-span-5 space-y-6">
          {/* BOSS RAID FEATURE CARD (Matching Wireframe: BOSS RAID: EXAM PREP / CYBER TITAN) */}
          <div className="hud-card rounded-2xl p-5 md:p-6 border border-cyber-magenta/35 space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-cyber-magenta/20 pb-3">
              <div className="flex items-center gap-2.5">
                <Skull className="w-5 h-5 text-cyber-magenta" />
                <div>
                  <h3 className="font-orbitron font-black text-base text-cyber-text tracking-wider uppercase">
                    BOSS RAID: CYBER TITAN
                  </h3>
                  <span className="font-mono text-[10px] text-cyber-magenta uppercase font-bold">
                    ACTIVE SECTOR THREAT
                  </span>
                </div>
              </div>
              <span className="font-mono text-xs text-cyber-amber font-bold">
                HP: {bossHpPercent}%
              </span>
            </div>

            {/* Boss HP Bar */}
            <div className="space-y-1.5">
              <div className="h-5 w-full bg-cyber-navy/90 border border-cyber-magenta/40 rounded-xl overflow-hidden p-0.5 shadow-inner relative">
                <div
                  className={`h-full rounded-lg transition-all duration-700 ${
                    bossDamaged
                      ? 'bg-white shadow-[0_0_20px_#fff]'
                      : bossHpPercent > 50
                      ? 'bg-gradient-to-r from-cyber-magenta to-rose-600 shadow-[0_0_12px_rgba(255,45,166,0.6)]'
                      : 'bg-gradient-to-r from-cyber-amber to-cyber-magenta shadow-[0_0_12px_rgba(255,184,77,0.6)]'
                  }`}
                  style={{ width: `${bossHpPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-cyber-textMuted">
                <span>{completedCount} STRIKES DEALT</span>
                <span>{bossHpPercent === 0 ? 'STATUS: NEUTRALIZED' : 'STATUS: VULNERABLE'}</span>
              </div>
            </div>

            {/* Sub-Tasks Checklist Preview */}
            <div className="space-y-1.5 pt-1 border-t border-cyber-cyan/10">
              <span className="font-mono text-[10px] text-cyber-dim uppercase tracking-wider block">
                PRIMARY OBJECTIVES:
              </span>
              {activeQuests.slice(0, 3).map((q, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-mono text-cyber-textMuted">
                  <span className="text-cyber-cyan">›</span>
                  <span className="truncate">{q.title}</span>
                  <span className="text-cyber-green text-[10px] ml-auto shrink-0">PENDING</span>
                </div>
              ))}
              {activeQuests.length === 0 && (
                <div className="text-xs font-mono text-cyber-green flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5" /> All raid targets neutralized!
                </div>
              )}
            </div>

            <Link to="/boss-raids" className="block pt-2">
              <HoloButton variant="magenta" size="sm" className="w-full text-center justify-center">
                ENTER FULL RAID ARENA →
              </HoloButton>
            </Link>
          </div>

          {/* LOOT & REWARDS QUICK-VIEW (Matching Wireframe Spec) */}
          <div className="hud-card rounded-2xl p-5 space-y-3.5 border border-cyber-cyan/30">
            <div className="flex items-center justify-between border-b border-cyber-cyan/20 pb-2.5">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-cyber-cyan" />
                <h4 className="font-orbitron font-bold text-xs text-cyber-text uppercase tracking-wider">
                  LOOT & GEAR ARSENAL
                </h4>
              </div>
              <Link to="/shop" className="font-mono text-[10px] text-cyber-cyan hover:underline">
                BAZAAR →
              </Link>
            </div>

            {/* Equipped Items Mini Preview */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-cyber-navy/80 border border-cyber-cyan/20 space-y-1">
                <span className="text-[10px] text-cyber-dim block">WALLET BALANCE</span>
                <span className="font-bold text-cyber-amber flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5" /> {Number(user?.gold || 0).toLocaleString()} C
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-cyber-navy/80 border border-cyber-cyan/20 space-y-1">
                <span className="text-[10px] text-cyber-dim block">EQUIPPED GEAR</span>
                <span className="font-bold text-cyber-cyan flex items-center gap-1">
                  <Backpack className="w-3.5 h-3.5" /> {inventory.length} ITEMS
                </span>
              </div>
            </div>
          </div>

          {/* ATTRIBUTE MATRIX (Core RPG Stats) */}
          <div className="hud-card rounded-2xl p-5 space-y-3 border border-cyber-cyan/30">
            <div className="flex items-center justify-between border-b border-cyber-cyan/20 pb-2">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyber-cyan" />
                <h4 className="font-orbitron font-bold text-xs text-cyber-text uppercase tracking-wider">
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
