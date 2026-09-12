import React from 'react';

export default function CharacterStats({ stats = {} }) {
  const attrs = [
    { key: 'strength', label: 'KINETIC STRENGTH', icon: '⚔️', color: 'from-cyber-red to-orange-500', barColor: 'bg-cyber-red', glow: 'shadow-holo-red', code: 'MOD.STR_01' },
    { key: 'intellect', label: 'NEURAL INTELLECT', icon: '⚡', color: 'from-cyber-cyan to-blue-500', barColor: 'bg-cyber-cyan', glow: 'shadow-holo-cyan', code: 'MOD.INT_02' },
    { key: 'wisdom', label: 'ARCHIVE WISDOM', icon: '🔮', color: 'from-cyber-purple to-pink-500', barColor: 'bg-cyber-purple', glow: 'shadow-holo-purple', code: 'MOD.WIS_03' },
    { key: 'vitality', label: 'BIO VITALITY', icon: '💚', color: 'from-cyber-green to-emerald-400', barColor: 'bg-cyber-green', glow: 'shadow-holo-green', code: 'MOD.VIT_04' },
    { key: 'discipline', label: 'CORE DISCIPLINE', icon: '🧘', color: 'from-cyber-gold to-yellow-300', barColor: 'bg-cyber-gold', glow: 'shadow-holo-gold', code: 'MOD.DIS_05' },
  ];

  const maxVal = Math.max(25, ...attrs.map((a) => Number(stats[a.key] || 0)));

  return (
    <div className="space-y-4">
      {attrs.map(({ key, label, icon, barColor, glow, code }) => {
        const val = Number(stats[key] || 0);
        const pct = Math.min(100, Math.max(6, (val / maxVal) * 100));

        return (
          <div key={key} className="bg-cyber-bg/90 border border-cyber-border/40 rounded-lg p-3.5 space-y-2 hover:border-cyber-cyan/50 transition-colors">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-lg">{icon}</span>
                <div>
                  <span className="font-orbitron font-bold text-xs text-cyber-text tracking-wide">{label}</span>
                  <span className="block font-mono text-[9px] text-cyber-muted">{code}</span>
                </div>
              </div>
              <span className="font-orbitron font-bold text-sm text-cyber-cyan bg-cyber-panel px-2.5 py-0.5 rounded border border-cyber-cyan/30">
                {val} <span className="text-[10px] text-cyber-muted font-normal">PTS</span>
              </span>
            </div>

            {/* Gauge */}
            <div className="h-3 w-full bg-cyber-panel border border-cyber-border/50 rounded overflow-hidden p-0.5 relative">
              <div
                className={`h-full ${barColor} rounded-sm transition-all duration-700 ${glow}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
