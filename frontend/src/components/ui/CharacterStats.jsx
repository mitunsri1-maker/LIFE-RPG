import React from 'react';

export default function CharacterStats({ stats = {} }) {
  const attrs = [
    { key: 'strength', label: 'KINETIC STRENGTH', icon: '⚔️', barColor: 'bg-gradient-to-r from-cyber-coral to-orange-500', glow: 'shadow-[0_0_12px_#FF3366]', textColor: 'text-cyber-coral', code: 'MOD.STR_01' },
    { key: 'intellect', label: 'NEURAL INTELLECT', icon: '⚡', barColor: 'bg-gradient-to-r from-cyber-cyan to-blue-500', glow: 'shadow-[0_0_12px_#00F0FF]', textColor: 'text-cyber-cyan', code: 'MOD.INT_02' },
    { key: 'wisdom', label: 'ARCHIVE WISDOM', icon: '🔮', barColor: 'bg-gradient-to-r from-cyber-violet to-pink-500', glow: 'shadow-[0_0_12px_#8B5CF6]', textColor: 'text-cyber-violet', code: 'MOD.WIS_03' },
    { key: 'vitality', label: 'BIO VITALITY', icon: '💚', barColor: 'bg-gradient-to-r from-cyber-green to-emerald-400', glow: 'shadow-[0_0_12px_#00FF9D]', textColor: 'text-cyber-green', code: 'MOD.VIT_04' },
    { key: 'discipline', label: 'CORE DISCIPLINE', icon: '🧘', barColor: 'bg-gradient-to-r from-cyber-amber to-yellow-400', glow: 'shadow-[0_0_12px_#FFB800]', textColor: 'text-cyber-amber', code: 'MOD.DIS_05' },
  ];

  const maxVal = Math.max(25, ...attrs.map((a) => Number(stats[a.key] || 0)));

  return (
    <div className="space-y-3">
      {attrs.map(({ key, label, icon, barColor, textColor, code }) => {
        const val = Number(stats[key] || 0);
        const pct = Math.min(100, Math.max(6, (val / maxVal) * 100));

        return (
          <div key={key} className="city-glass border border-slate-200/80 rounded-xl p-3.5 space-y-2 hover:border-sky-300 transition-all duration-200 shadow-xs">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{icon}</span>
                <div>
                  <span className="font-orbitron font-bold text-xs text-slate-800 tracking-wide">{label}</span>
                  <span className="block font-mono text-[9px] text-slate-500">{code}</span>
                </div>
              </div>
              <span className={`font-orbitron font-bold text-sm ${textColor} bg-slate-50 px-2.5 py-0.5 rounded-lg border border-slate-200 shadow-2xs`}>
                {val} <span className="text-[10px] text-slate-500 font-normal">PTS</span>
              </span>
            </div>

            {/* Gauge */}
            <div className="h-2.5 w-full bg-slate-100 border border-slate-200 rounded-full overflow-hidden p-0.5 relative shadow-inner">
              <div
                className={`h-full ${barColor} rounded-full transition-all duration-700 shadow-2xs`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
