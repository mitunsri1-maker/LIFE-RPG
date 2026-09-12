import React, { useEffect, useState } from 'react';
import { useQuestStore } from '../store/questStore';
import { useAuthStore } from '../store/authStore';
import QuestCard from '../components/ui/QuestCard';
import RewardPopup from '../components/ui/RewardPopup';
import LevelUpAnimation from '../components/ui/LevelUpAnimation';
import QuestNodeMap3D from '../components/3d/QuestNodeMap3D';
import HoloButton from '../components/hud/HoloButton';
import { soundFX } from '../utils/soundFX';
import { Plus, Swords, Loader2, Sparkles, Map, LayoutGrid } from 'lucide-react';
import { clsx } from 'clsx';

const TABS = ['ALL MISSIONS', "TODAY'S DISPATCH", 'VERIFIED COMPLETED', 'FORGE DIRECTIVE'];
const CATEGORIES = [
  'Coding / Study',
  'Gym / Physical',
  'Running / Cardio',
  'Reading / Archiving',
  'Meditation / Neural',
  'General Objective',
];
const DIFFICULTIES = ['easy', 'medium', 'hard'];

export default function QuestsPage() {
  const { quests, fetchQuests, createQuest, completeQuest, deleteQuest, clearLastReward, lastReward, isLoading } = useQuestStore();
  const { refreshUser } = useAuthStore();
  const [tab, setTab] = useState('ALL MISSIONS');
  const [completingId, setCompletingId] = useState(null);
  const [levelUpLevel, setLevelUpLevel] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Coding / Study',
    difficulty: 'medium',
    due_date: '',
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchQuests();
  }, []);

  const filtered = quests.filter((q) => {
    if (tab === 'VERIFIED COMPLETED') return q.status === 'completed';
    if (tab === "TODAY'S DISPATCH") {
      const today = new Date().toISOString().split('T')[0];
      return q.status === 'active' && (!q.due_date || q.due_date.startsWith(today));
    }
    if (tab === 'ALL MISSIONS') return q.status === 'active';
    return true;
  });

  const handleComplete = async (id) => {
    setCompletingId(id);
    const result = await completeQuest(id);
    setCompletingId(null);
    if (result.success) {
      refreshUser();
      if (result.reward?.level_up) setLevelUpLevel(result.reward.new_level);
    }
  };

  const handleDelete = async (id) => {
    soundFX.playClick();
    if (confirm('Permanently decommission this quest directive?')) await deleteQuest(id);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.title.trim()) {
      setFormError('Quest title is required.');
      return;
    }
    setIsSubmitting(true);
    const res = await createQuest(form);
    setIsSubmitting(false);
    if (res.success) {
      soundFX.playPurchase();
      setForm({ title: '', description: '', category: 'Coding / Study', difficulty: 'medium', due_date: '' });
      setTab('ALL MISSIONS');
    } else {
      setFormError(res.error || 'Failed to initialize quest directive.');
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-orbitron font-black text-3xl md:text-4xl text-cyber-text tracking-tight flex items-center gap-3">
            <span className="w-11 h-11 rounded-xl bg-cyber-cyan/20 border-2 border-cyber-cyan text-cyber-cyan flex items-center justify-center text-xl shadow-holo-cyan">
              ⚔️
            </span>
            MISSION TERMINAL
          </h1>
          <p className="font-mono text-xs text-cyber-textMuted mt-1">
            LOG // MANAGE PROTOCOLS & CLAIM HARVESTED ENERGIES
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { soundFX.playClick(); setShowMap(!showMap); }}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
              showMap ? 'bg-cyber-cyan text-cyber-bg border-cyber-cyan shadow-holo-cyan' : 'city-glass text-cyber-textMuted border-cyber-border/40 hover:text-cyber-text'
            }`}
          >
            <Map className="w-4 h-4" /> 3D MAP: {showMap ? 'ACTIVE' : 'OFF'}
          </button>

          <HoloButton
            variant="cyan"
            size="sm"
            icon={Plus}
            onClick={() => setTab('FORGE DIRECTIVE')}
          >
            FORGE QUEST
          </HoloButton>
        </div>
      </div>

      {/* 3D Mission Neural Map if toggled */}
      {showMap && (
        <QuestNodeMap3D quests={quests.filter((q) => q.status === 'active')} height="340px" onSelectQuest={(q) => handleComplete(q.id)} />
      )}

      {/* Futuristic Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => {
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => { soundFX.playClick(); setTab(t); }}
              className={clsx(
                'px-4 py-2 rounded-lg font-orbitron font-bold text-xs uppercase tracking-wider border transition-all select-none cursor-pointer',
                active
                  ? 'bg-cyber-cyan/25 text-cyber-cyan border-cyber-cyan shadow-holo-cyan'
                  : 'city-glass text-cyber-textMuted border-cyber-border/35 hover:border-cyber-cyan/40 hover:text-cyber-text'
              )}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* Forge Directive Form */}
      {tab === 'FORGE DIRECTIVE' && (
        <form
          onSubmit={handleCreate}
          className="city-glass-elevated border border-cyber-cyan/40 rounded-2xl p-6 md:p-8 shadow-glass-depth space-y-6 cyber-corner-tl"
        >
          <div className="border-b border-cyber-border/30 pb-3 flex items-center justify-between">
            <div>
              <h2 className="font-orbitron font-bold text-xl text-cyber-text text-glow-cyan">FORGE PROTOCOL DIRECTIVE</h2>
              <p className="font-mono text-xs text-cyber-textMuted">SET MISSION PARAMETERS AND REWARD ENERGY ALLOCATIONS</p>
            </div>
            <span className="font-mono text-xs text-cyber-cyan city-glass px-3 py-1 rounded-full border border-cyber-cyan/40">
              SYS.FORGE_V4
            </span>
          </div>

          {formError && (
            <div className="bg-cyber-red/20 border border-cyber-coral text-cyber-coral font-mono text-xs p-3.5 rounded-lg">
              ⚠️ {formError}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block font-orbitron font-bold text-xs uppercase tracking-wider text-cyber-textMuted mb-1.5">
                Mission Directive Title *
              </label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Master Three.js Shaders & Build Cyber City"
                className="w-full city-glass border border-cyber-border/50 rounded-lg px-4 py-3 text-sm font-mono text-cyber-text placeholder:text-cyber-muted/40 focus:border-cyber-cyan focus:shadow-holo-cyan focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-orbitron font-bold text-xs uppercase tracking-wider text-cyber-textMuted mb-1.5">
                Directive Specifications (Optional)
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Specific parameters, acceptance criteria, or logs..."
                rows={3}
                className="w-full city-glass border border-cyber-border/50 rounded-lg px-4 py-3 text-sm font-mono text-cyber-text placeholder:text-cyber-muted/40 focus:border-cyber-cyan focus:shadow-holo-cyan focus:outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-orbitron font-bold text-xs uppercase tracking-wider text-cyber-textMuted mb-1.5">
                  Target Domain & Attribute
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full city-glass border border-cyber-border/50 rounded-lg px-4 py-3 text-sm font-mono text-cyber-text focus:border-cyber-cyan focus:outline-none cursor-pointer"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="bg-cyber-navy text-cyber-text">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-orbitron font-bold text-xs uppercase tracking-wider text-cyber-textMuted mb-1.5">
                  Threat / Effort Tier (Sets XP & Credits)
                </label>
                <select
                  value={form.difficulty}
                  onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                  className="w-full city-glass border border-cyber-border/50 rounded-lg px-4 py-3 text-sm font-mono text-cyber-text focus:border-cyber-cyan focus:outline-none cursor-pointer"
                >
                  <option value="easy" className="bg-cyber-navy text-cyber-green">Tier I — Easy (+50 XP, +10 Credits, +1 Attr)</option>
                  <option value="medium" className="bg-cyber-navy text-cyber-amber">Tier II — Medium (+100 XP, +25 Credits, +2 Attr)</option>
                  <option value="hard" className="bg-cyber-navy text-cyber-coral">Tier III — Hard (+200 XP, +50 Credits, +3 Attr)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-orbitron font-bold text-xs uppercase tracking-wider text-cyber-textMuted mb-1.5">
                Target Deadline (Optional)
              </label>
              <input
                type="date"
                value={form.due_date}
                onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                className="w-full city-glass border border-cyber-border/50 rounded-lg px-4 py-3 text-sm font-mono text-cyber-text focus:border-cyber-cyan focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-cyber-border/30">
            <HoloButton
              variant="ghost"
              size="sm"
              onClick={() => setTab('ALL MISSIONS')}
            >
              CANCEL
            </HoloButton>
            <HoloButton
              type="submit"
              variant="cyan"
              size="md"
              disabled={isSubmitting}
              icon={Plus}
            >
              {isSubmitting ? 'FORGING PROTOCOL...' : 'INITIALIZE MISSION'}
            </HoloButton>
          </div>
        </form>
      )}

      {/* Mission Directives List */}
      {tab !== 'FORGE DIRECTIVE' && (
        <div>
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-cyber-textMuted font-orbitron font-bold">
              <Loader2 className="w-8 h-8 animate-spin mr-3 text-cyber-cyan" /> SCANNING MISSION MATRIX...
            </div>
          ) : filtered.length === 0 ? (
            <div className="city-glass border border-dashed border-cyber-border/50 rounded-2xl p-12 text-center space-y-3 shadow-glass-depth">
              <div className="text-4xl">📭</div>
              <h3 className="font-orbitron font-bold text-xl text-cyber-text">
                {tab === 'VERIFIED COMPLETED' ? 'NO RECORDED COMPLETIONS YET' : 'MISSION DIRECTORY EMPTY'}
              </h3>
              <p className="font-body text-xs text-cyber-textMuted max-w-sm mx-auto">
                {tab === 'VERIFIED COMPLETED'
                  ? 'Complete your active objectives to archive verified completions!'
                  : 'Forge a new mission to jumpstart your daily core resonance.'}
              </p>
              {tab !== 'VERIFIED COMPLETED' && (
                <HoloButton
                  variant="cyan"
                  size="sm"
                  onClick={() => setTab('FORGE DIRECTIVE')}
                  className="mt-3"
                >
                  + FORGE FIRST DIRECTIVE
                </HoloButton>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((q) => (
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
      )}

      {lastReward && <RewardPopup reward={lastReward} onClose={clearLastReward} />}
      {levelUpLevel && <LevelUpAnimation level={levelUpLevel} onComplete={() => setLevelUpLevel(null)} />}
    </div>
  );
}
