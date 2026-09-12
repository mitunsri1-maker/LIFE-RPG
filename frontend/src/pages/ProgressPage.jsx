import React, { useEffect, useState } from 'react';
import { progressApi } from '../api';
import HoloPanel from '../components/hud/HoloPanel';
import { Flame, Zap, CheckCircle2, Target, Loader2, Calendar, Globe, Sparkles } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

export default function ProgressPage() {
  const [progress, setProgress] = useState(null);
  const [history, setHistory] = useState([]);
  const [streakData, setStreakData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      progressApi.get(),
      progressApi.getHistory({ limit: 30 }),
      progressApi.getStreak(),
    ]).then(([p, h, s]) => {
      setProgress(p.data);
      setHistory(h.data.history);
      setStreakData(s.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-80 text-cyber-textMuted font-orbitron font-bold">
      <Loader2 className="w-8 h-8 animate-spin mr-3 text-cyber-cyan" /> RETRIEVING EVOLUTION LOGS...
    </div>
  );

  const chartData = [...history].reverse().map((h) => ({
    date: format(parseISO(h.completed_at), 'MMM d'),
    xp: h.xp_earned,
    task: h.task_title,
  }));

  const calendar = streakData?.calendar || [];
  const level = progress?.user?.level || 1;

  // World evolution stages
  const evolutionStages = [
    { lvl: 1, title: 'NEON DISTRICT', desc: 'Baseline grid towers and preliminary holographic signals.' },
    { lvl: 5, title: 'DATA ARCHIPELAGO', desc: 'Expanded infrastructure, glowing communication relays.' },
    { lvl: 10, title: 'HIGH-RISE SKYLINE', desc: 'Dense skyscraper cluster, elevated skyway traffic active.' },
    { lvl: 20, title: 'MEGA METROPOLIS', desc: 'Limitless cyberpunk sprawl, maximum particle resonance.' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Title */}
      <div>
        <h1 className="font-orbitron font-black text-3xl md:text-4xl text-slate-800 tracking-tight flex items-center gap-3">
          <span className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center text-xl shadow-xs">
            📈
          </span>
          METROPOLIS EVOLUTION & ANALYTICS
        </h1>
        <p className="font-mono text-xs text-slate-500 mt-1">
          PROGRESSION TELEMETRY // 3D ENVIRONMENT ADAPTATION METRICS
        </p>
      </div>

      {/* World Evolution Tier Status */}
      <HoloPanel
        title="METROPOLIS EVOLUTION PHASE"
        subtitle="THE 3D DAYTIME SKYLINE DYNAMICALLY EXPANDS AS YOUR OPERATIVE LEVEL INCREASES"
        accent="cyan"
        tag="[SYS.EVOLUTION]"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {evolutionStages.map((stg) => {
            const unlocked = level >= stg.lvl;
            return (
              <div
                key={stg.lvl}
                className={`p-4 rounded-xl border transition-all ${
                  unlocked
                    ? 'city-glass-elevated border-sky-300 shadow-sm text-slate-800'
                    : 'city-glass border-slate-200/50 opacity-50 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-sky-600">LVL {stg.lvl}+</span>
                  {unlocked ? (
                    <span className="font-mono text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-300 px-2 py-0.5 rounded-full font-bold">
                      ACTIVE
                    </span>
                  ) : (
                    <span className="font-mono text-[9px] text-slate-400">LOCKED</span>
                  )}
                </div>
                <h4 className="font-orbitron font-bold text-sm tracking-wide mb-1 text-slate-800">{stg.title}</h4>
                <p className="font-body text-xs text-slate-500">{stg.desc}</p>
              </div>
            );
          })}
        </div>
      </HoloPanel>

      {/* Stat Matrix */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="city-glass border border-emerald-200 p-5 rounded-xl shadow-xs">
          <div className="font-mono text-xs text-slate-500 uppercase">Missions Cleared</div>
          <div className="font-orbitron font-black text-3xl text-emerald-600 mt-1">
            {progress?.stats?.total_completed || 0}
          </div>
        </div>

        <div className="city-glass border border-sky-200 p-5 rounded-xl shadow-xs">
          <div className="font-mono text-xs text-slate-500 uppercase">Active Directives</div>
          <div className="font-orbitron font-black text-3xl text-sky-600 mt-1">
            {progress?.stats?.total_active || 0}
          </div>
        </div>

        <div className="city-glass border border-rose-200 p-5 rounded-xl shadow-xs">
          <div className="font-mono text-xs text-slate-500 uppercase">Current Streak</div>
          <div className="font-orbitron font-black text-3xl text-rose-600 mt-1">
            {progress?.streak?.current_streak || 0}D
          </div>
        </div>

        <div className="city-glass border border-amber-200 p-5 rounded-xl shadow-xs">
          <div className="font-mono text-xs text-slate-500 uppercase">Max Streak Record</div>
          <div className="font-orbitron font-black text-3xl text-amber-600 mt-1">
            {progress?.streak?.best_streak || 0}D
          </div>
        </div>
      </div>

      {/* XP Energy Flow Chart */}
      <HoloPanel
        title="ENERGY ACQUISITION CURVE"
        subtitle="RECENT 30 MISSION XP HARVEST READINGS"
        accent="green"
        glow
        tag="[SYS.HARVEST]"
      >
        {chartData.length > 0 ? (
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#162044" />
                <XAxis dataKey="date" tick={{ fill: '#7F96B2', fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                <YAxis tick={{ fill: '#7F96B2', fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0C132E',
                    border: '1px solid #00F0FF',
                    borderRadius: '8px',
                    boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)',
                    color: '#E0F2FE',
                    fontFamily: 'JetBrains Mono',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="xp"
                  stroke="#00FF9D"
                  strokeWidth={3}
                  fill="#00FF9D"
                  fillOpacity={0.18}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="font-body text-xs text-cyber-textMuted py-8 text-center">
            Execute mission directives to plot your energy flow curve.
          </p>
        )}
      </HoloPanel>

      {/* 90-Day Activity Grid */}
      <HoloPanel
        title="90-DAY ACTIVITY MATRIX"
        subtitle="INDELIBLE NEURAL LOG OF DAILY OBJECTIVE COMPLETIONS"
        accent="purple"
        tag="[SYS.MATRIX]"
      >
        {calendar.length === 0 ? (
          <p className="font-body text-xs text-cyber-textMuted py-6 text-center">
            No logged missions in the active buffer. Clear quests to populate the matrix.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2.5 p-4 city-glass rounded-xl border border-cyber-border/30">
            {calendar.map((d) => (
              <div
                key={d.date}
                title={`${d.date}: ${d.count} missions, +${d.xp} XP`}
                className="w-5 h-5 rounded-sm border border-cyber-border/40 cursor-pointer transition-transform hover:scale-125"
                style={{
                  backgroundColor: d.count >= 3 ? '#00FF9D' : d.count >= 2 ? '#FFB800' : '#8B5CF6',
                  boxShadow: d.count >= 2 ? '0 0 8px rgba(0, 255, 157, 0.5)' : 'none'
                }}
              />
            ))}
          </div>
        )}
      </HoloPanel>

      {/* Historical Audit Trail */}
      {history.length > 0 && (
        <HoloPanel
          title="CHRONOLOGICAL AUDIT LOG"
          subtitle="RECENT 10 VERIFIED COMPLETIONS"
          accent="gold"
          tag="[SYS.AUDIT]"
        >
          <div className="divide-y divide-cyber-border/20">
            {history.slice(0, 10).map((h) => (
              <div key={h.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <p className="font-orbitron font-bold text-sm text-cyber-text">{h.task_title || 'Objective Protocol'}</p>
                  <p className="font-mono text-[11px] text-cyber-textMuted mt-0.5">
                    {format(parseISO(h.completed_at), 'MMM d, yyyy · HH:mm')} — <span className="text-cyber-green">{h.category}</span>
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="inline-block font-mono font-bold text-xs text-cyber-green city-glass px-2.5 py-0.5 rounded border border-cyber-green/40 mr-2">
                    +{h.xp_earned} XP
                  </span>
                  <span className="inline-block font-mono font-bold text-xs text-cyber-amber city-glass px-2.5 py-0.5 rounded border border-cyber-amber/40">
                    +{h.gold_earned} G
                  </span>
                </div>
              </div>
            ))}
          </div>
        </HoloPanel>
      )}
    </div>
  );
}
