import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { soundFX } from '../../utils/soundFX';
import { Zap, Trophy, Sparkles } from 'lucide-react';

export default function LevelUpAnimation({ level, onComplete }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!level) return;
    setPhase(1);
    soundFX.playLevelUp();

    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#00F0FF', '#00FF9D', '#FFE600', '#FF007F']
      });
    } catch (_) {}

    const t1 = setTimeout(() => setPhase(2), 200);
    const t2 = setTimeout(() => { setPhase(0); onComplete?.(); }, 4500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [level]);

  if (!level || phase === 0) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-cyber-bg/95 backdrop-blur-lg transition-opacity duration-300 ${phase === 1 ? 'opacity-0' : 'opacity-100'}`}>
      <div className={`text-center relative max-w-lg w-full mx-4 transition-all duration-300 ${phase === 2 ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
        <div className="bg-cyber-panel border-3 border-cyber-cyan rounded-xl p-8 shadow-holo-cyan relative overflow-hidden cyber-corner-tl">
          {/* Top Holographic Tag */}
          <div className="inline-flex items-center gap-2 bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan font-mono text-xs px-4 py-1 rounded mb-4 font-bold tracking-widest uppercase">
            <Zap className="w-3.5 h-3.5 fill-cyber-cyan" /> NEURAL EVOLUTION OVERRIDE
          </div>

          <h2 className="font-orbitron font-black text-3xl md:text-4xl text-cyber-text uppercase tracking-widest mb-4 text-glow-cyan">
            LEVEL UPGRADED!
          </h2>

          <div className="my-6 py-6 bg-cyber-bg/90 border-2 border-cyber-cyan/60 rounded-lg shadow-holo-cyan">
            <div className="font-orbitron font-black text-7xl md:text-8xl text-cyber-cyan tracking-tight text-glow-cyan">
              LVL {level}
            </div>
            <div className="font-mono text-xs text-cyber-green font-bold mt-2 uppercase tracking-wider">
              [SYSTEM ACCESS TIER EXPANDED]
            </div>
          </div>

          <p className="font-body font-medium text-cyber-muted text-sm mb-6 max-w-md mx-auto">
            Your real-world discipline has evolved the world matrix. New mission difficulties and shop artifacts are unlocked.
          </p>

          <button
            onClick={() => { setPhase(0); onComplete?.(); }}
            className="w-full bg-cyber-cyan text-cyber-bg font-orbitron font-black text-sm py-4 rounded-lg border-2 border-cyber-cyan shadow-holo-cyan hover:bg-cyber-green hover:border-cyber-green transition-all uppercase tracking-wider cursor-pointer"
          >
            SYNCHRONIZE & PROCEED →
          </button>
        </div>
      </div>
    </div>
  );
}
