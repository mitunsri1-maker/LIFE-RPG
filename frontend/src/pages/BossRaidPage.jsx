import React, { useState, useEffect } from 'react';
import { useQuestStore } from '../store/questStore';
import { useAuthStore } from '../store/authStore';
import { soundFX } from '../utils/soundFX';
import HoloButton from '../components/hud/HoloButton';
import QuestCard from '../components/ui/QuestCard';
import RewardPopup from '../components/ui/RewardPopup';
import LevelUpAnimation from '../components/ui/LevelUpAnimation';
import { Shield, Swords, Skull, Zap, Flame, Award, Heart, CheckCircle2, AlertTriangle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BossRaidPage() {
  const { user, refreshUser } = useAuthStore();
  const { quests, fetchQuests, completeQuest, deleteQuest, clearLastReward, lastReward } = useQuestStore();
  const [completingId, setCompletingId] = useState(null);
  const [levelUpLevel, setLevelUpLevel] = useState(null);
  const [bossAttackAnim, setBossAttackAnim] = useState(false);

  useEffect(() => {
    fetchQuests({ status: 'active' });
  }, []);

  // Filter high-stakes tasks as Boss Directives
  const hardQuests = quests.filter((q) => q.status === 'active' && q.difficulty === 'hard');
  const allActive = quests.filter((q) => q.status === 'active');
  const completedToday = quests.filter((q) => q.status === 'completed').length;

  // Boss HP calculation: 100% base, reduced by completed quests today
  const totalTasks = Math.max(5, allActive.length + completedToday);
  const bossHpPercent = Math.max(0, Math.round(100 - (completedToday / totalTasks) * 100));

  const handleExecute = async (id) => {
    setCompletingId(id);
    soundFX.playLevelUp?.() || soundFX.playQuestComplete();
    setBossAttackAnim(true);
    setTimeout(() => setBossAttackAnim(false), 900);

    const result = await completeQuest(id);
    setCompletingId(null);
    if (result.success) {
      refreshUser();
      if (result.reward?.level_up) setLevelUpLevel(result.reward.new_level);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Boss Raid Header Banner */}
      <div className="relative hud-glass rounded-2xl p-6 md:p-8 shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyber-cyan/25 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyber-magenta/15 border border-cyber-magenta/50 text-cyber-magenta flex items-center justify-center shadow-[0_0_15px_rgba(255,45,166,0.3)]">
              <Skull className="w-5 h-5 text-cyber-magenta" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-cyber-magenta font-bold px-2 py-0.5 rounded bg-cyber-magenta/10 border border-cyber-magenta/30">
                  SECTOR BOSS // HIGH THREAT
                </span>
                <span className="w-2 h-2 rounded-full bg-cyber-magenta animate-ping" />
              </div>
              <h1 className="font-orbitron font-black text-2xl md:text-4xl text-cyber-text tracking-wide mt-1">
                CYBER TITAN PROTOCOL
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right font-mono text-xs">
              <span className="text-cyber-textMuted block">DEFEAT REWARD:</span>
              <span className="text-cyber-amber font-bold text-sm">+500 XP // +200 CREDITS</span>
            </div>
            <Link to="/quests">
              <HoloButton variant="magenta" size="sm" icon={Plus}>
                ADD RAID QUEST
              </HoloButton>
            </Link>
          </div>
        </div>

        {/* Boss Visual & Health Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Boss Status & Health Bar */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex justify-between items-center text-xs font-mono font-bold">
              <span className="text-cyber-magenta flex items-center gap-1.5">
                <Heart className="w-4 h-4 fill-cyber-magenta" /> BOSS VITALITY: {bossHpPercent}%
              </span>
              <span className="text-cyber-textMuted">
                {completedToday} OF {totalTasks} DIRECTIVES CLEARED
              </span>
            </div>

            {/* Health Bar Track */}
            <div className="h-6 w-full bg-cyber-navy/90 border border-cyber-magenta/40 rounded-xl overflow-hidden p-1 shadow-inner relative">
              <div
                className={`h-full rounded-lg transition-all duration-700 ${
                  bossAttackAnim
                    ? 'bg-white shadow-[0_0_25px_#fff]'
                    : bossHpPercent > 50
                    ? 'bg-gradient-to-r from-cyber-magenta via-pink-500 to-rose-600 shadow-[0_0_15px_rgba(255,45,166,0.6)]'
                    : bossHpPercent > 20
                    ? 'bg-gradient-to-r from-amber-500 to-cyber-magenta shadow-[0_0_15px_rgba(255,184,77,0.6)]'
                    : 'bg-gradient-to-r from-cyber-green to-emerald-400 shadow-[0_0_20px_rgba(57,255,136,0.8)]'
                }`}
                style={{ width: `${bossHpPercent}%` }}
              />
            </div>

            <p className="font-body text-xs text-cyber-textMuted leading-relaxed">
              Target anomaly: <strong className="text-cyber-text">System Overload</strong>. Check off your daily tactical bounties to deal direct damage to the Boss Core. Completing High Priority (Hard) missions deals critical strikes.
            </p>
          </div>

          {/* Boss Status Shield / Hologram */}
          <div className="lg:col-span-4 hud-card rounded-xl p-5 text-center space-y-2 border border-cyber-magenta/30">
            <div className="text-4xl mb-1">{bossHpPercent === 0 ? '🏆' : '👾'}</div>
            <h4 className="font-orbitron font-bold text-sm text-cyber-text uppercase">
              {bossHpPercent === 0 ? 'TITAN DEFEATED' : bossHpPercent < 40 ? 'PHASE 3: CORE EXPOSED' : 'PHASE 1: SHIELD ACTIVE'}
            </h4>
            <span className="font-mono text-[10px] text-cyber-magenta uppercase font-bold block">
              {bossHpPercent === 0 ? 'SECTOR SECURED' : 'CRITICAL DAMAGE REQUIRED'}
            </span>
          </div>
        </div>
      </div>

      {/* High-Stakes Raid Tasks (Hard Bounties) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-cyber-cyan/20 pb-3">
          <div className="flex items-center gap-2.5">
            <Swords className="w-5 h-5 text-cyber-cyan" />
            <h2 className="font-orbitron font-bold text-xl text-cyber-text">
              CRITICAL RAID DIRECTIVES ({hardQuests.length > 0 ? hardQuests.length : allActive.length})
            </h2>
          </div>
          <span className="font-mono text-xs text-cyber-cyan">
            DEALS MAXIMUM DAMAGE TO BOSS
          </span>
        </div>

        {allActive.length === 0 ? (
          <div className="hud-glass rounded-2xl p-12 text-center space-y-4">
            <div className="text-4xl">🎯</div>
            <h3 className="font-orbitron font-bold text-lg text-cyber-text">NO ACTIVE DIRECTIVES</h3>
            <p className="font-body text-xs text-cyber-textMuted max-w-sm mx-auto">
              All objectives cleared! Initialize a new high-stakes raid quest to summon a new boss challenge.
            </p>
            <Link to="/quests">
              <HoloButton variant="cyan" size="md">
                CREATE RAID QUEST →
              </HoloButton>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(hardQuests.length > 0 ? hardQuests : allActive).map((q) => (
              <QuestCard
                key={q.id}
                quest={q}
                onComplete={handleExecute}
                onDelete={deleteQuest}
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
