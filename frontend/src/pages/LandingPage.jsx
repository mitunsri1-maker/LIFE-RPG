import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Swords, TrendingUp, ShoppingBag, ShieldCheck, Flame, ArrowRight, Activity, Globe, Sparkles } from 'lucide-react';
import CyberEnvironment from '../components/3d/CyberEnvironment';
import PlayerPod3D from '../components/3d/PlayerPod3D';
import HoloButton from '../components/hud/HoloButton';
import SoundToggle from '../components/hud/SoundToggle';

const features = [
  { icon: Swords, title: 'Holographic Mission Matrix', desc: 'Turn daily habits, physical workouts, and study sessions into interactive RPG directives with custom XP & gold payouts.', color: 'text-cyber-cyan border-cyber-cyan/50 bg-cyber-cyan/10' },
  { icon: Activity, title: '3D Energy Reactor Core', desc: 'Watch your real-world progress pulse through a live 3D energy core reactor that absorbs XP on quest completion.', color: 'text-cyber-green border-cyber-green/50 bg-cyber-green/10' },
  { icon: Globe, title: 'World Evolution Engine', desc: 'Your operative level dynamically expands the 3D cyberpunk city skyline behind the application as you progress.', color: 'text-cyber-violet border-cyber-violet/50 bg-cyber-violet/10' },
  { icon: Flame, title: 'Plasma Core Streak', desc: 'Consecutive daily activity charges your plasma core, unlocking milestone bonuses and rare prestige badges.', color: 'text-cyber-coral border-cyber-coral/50 bg-cyber-coral/10' },
  { icon: ShoppingBag, title: 'The Cyber Bazaar', desc: 'Spend accumulated credits on 3D weapons, neural cyberware, holographic interface themes, and armor.', color: 'text-cyber-amber border-cyber-amber/50 bg-cyber-amber/10' },
  { icon: ShieldCheck, title: '5 RPG Core Attributes', desc: 'Level up Kinetic Strength, Neural Intellect, Bio Vitality, Archive Wisdom, and Core Discipline.', color: 'text-cyber-cyan border-cyber-cyan/50 bg-cyber-cyan/10' },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-cyber-bg text-cyber-text font-body selection:bg-cyber-cyan selection:text-cyber-bg overflow-x-hidden">
      {/* 3D Cyberpunk City Ambient Background */}
      <CyberEnvironment level={12} enabled={true} />

      {/* Navigation */}
      <nav className="relative z-20 border-b border-white/80 city-glass sticky top-0 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="font-orbitron font-black text-2xl tracking-wider text-slate-800">
              LIFE<span className="text-sky-500">//</span>OS
            </span>
          </div>

          <div className="flex items-center gap-4">
            <SoundToggle />
            <Link
              to="/login"
              className="font-orbitron font-bold text-xs uppercase tracking-wider text-slate-700 hover:text-sky-600 px-4 py-2 transition-colors"
            >
              AUTHENTICATE
            </Link>
            <Link to="/signup">
              <HoloButton variant="cyan" size="sm">
                ENROLL OPERATIVE →
              </HoloButton>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section — Futuristic City Command Deck */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-16 text-center space-y-8">
        <div className="inline-flex items-center gap-2 bg-white/90 border border-sky-200 text-sky-700 font-mono text-xs px-4 py-1.5 rounded-full uppercase tracking-widest font-bold shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          NEURAL LIFE OPERATING SYSTEM // V4.2
        </div>

        <div className="relative max-w-4xl mx-auto">
          <h1 className="font-orbitron font-black text-5xl sm:text-7xl lg:text-8xl text-slate-900 tracking-tight uppercase leading-none drop-shadow-sm">
            YOUR LIFE IS AN{' '}
            <span className="text-sky-500 underline decoration-sky-300 decoration-4 underline-offset-8">
              RPG
            </span>
          </h1>
        </div>

        <p className="font-body text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Transform daily habits into mission directives. Power a 3D Energy Core, harvest credits, level up core attributes, and evolve the futuristic city.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
          <Link to="/signup">
            <HoloButton variant="cyan" size="lg" icon={ArrowRight} className="shadow-md">
              INITIALIZE OPERATIVE DOSSIER
            </HoloButton>
          </Link>
          <Link to="/login">
            <HoloButton variant="ghost" size="lg">
              RESUME ACTIVE CAMPAIGN
            </HoloButton>
          </Link>
        </div>
      </section>

      {/* 3D Hologram Command Pod Showcase */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-20">
        <div className="city-glass border border-cyber-cyan/40 rounded-2xl p-6 md:p-8 shadow-glass-depth space-y-6 cyber-corner-tl">
          <div className="flex items-center justify-between border-b border-cyber-border/30 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-cyber-green animate-ping" />
              <span className="font-orbitron font-bold text-sm text-cyber-cyan uppercase tracking-wider">
                3D COMMAND CHAMBER DEMO
              </span>
            </div>
            <span className="font-mono text-xs text-cyber-amber city-glass px-3 py-1 rounded border border-cyber-amber/40">
              CORE CHARGE: 100%
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-3">
              <h3 className="font-orbitron font-black text-2xl md:text-3xl text-cyber-text">
                THE METROPOLIS RESPONDS TO YOUR DISCIPLINE
              </h3>
              <p className="font-body text-sm text-cyber-textMuted leading-relaxed">
                Every verified quest emits energy particles that charge the 3D XP Core in real-time. Attributes like Intellect, Strength, and Vitality rise with each verified mission, expanding the city skyline around you.
              </p>
            </div>

            <div className="lg:col-span-5 city-glass-elevated border border-cyber-cyan/40 rounded-xl p-2">
              <PlayerPod3D level={14} username="NEXUS_CHAMPION" height="240px" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16 border-t border-cyber-border/30 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="font-orbitron font-black text-3xl sm:text-4xl text-cyber-text uppercase tracking-wide text-glow-cyan">
            NEURAL GAME MECHANICS
          </h2>
          <p className="font-mono text-xs text-cyber-textMuted">
            DESIGNED FOR REAL-LIFE MASTERY WITH AAA-TIER INTERACTIVE FEEDBACK
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc, color }) => (
            <div
              key={title}
              className="city-glass border border-cyber-border/40 rounded-xl p-6 space-y-3 hover:border-cyber-cyan hover:shadow-glass-depth transition-all duration-300 cyber-corner-tl group"
            >
              <div className={`w-12 h-12 rounded-lg border flex items-center justify-center ${color}`}>
                <Icon className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="font-orbitron font-bold text-lg text-cyber-text tracking-wide group-hover:text-cyber-cyan transition-colors">
                {title}
              </h3>
              <p className="font-body text-xs text-cyber-textMuted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-cyber-border/30 city-glass py-10 text-center text-xs font-mono text-cyber-textMuted">
        <p>LIFE//OS — CYBERPUNK LIFE RPG METROPOLIS. COPYRIGHT © 2026. ALL RIGHTS ENCRYPTED.</p>
      </footer>
    </div>
  );
}
