import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Swords, TrendingUp, ShoppingBag, Star, ShieldCheck, Flame, ArrowRight, Terminal, Activity, Globe } from 'lucide-react';
import CyberEnvironment from '../components/3d/CyberEnvironment';
import PlayerPod3D from '../components/3d/PlayerPod3D';
import HoloButton from '../components/hud/HoloButton';
import SoundToggle from '../components/hud/SoundToggle';

const features = [
  { icon: Swords, title: 'Holographic Mission Matrix', desc: 'Turn daily habits, physical workouts, and study sessions into interactive RPG directives with custom XP & gold payouts.', color: 'text-cyber-cyan border-cyber-cyan/40' },
  { icon: Activity, title: '3D Energy Reactor Core', desc: 'Watch your real-world progress pulse through a live 3D energy core reactor that absorbs XP on quest completion.', color: 'text-cyber-green border-cyber-green/40' },
  { icon: Globe, title: 'World Evolution Engine', desc: 'Your operative level dynamically expands the 3D cyberpunk city skyline behind the application as you progress.', color: 'text-cyber-purple border-cyber-purple/40' },
  { icon: Flame, title: 'Plasma Core Streak', desc: 'Consecutive daily activity charges your plasma core, unlocking milestone bonuses and rare prestige badges.', color: 'text-cyber-coral border-cyber-coral/40' },
  { icon: ShoppingBag, title: 'The Cyber Bazaar', desc: 'Spend accumulated credits on 3D weapons, neural cyberware, holographic interface themes, and armor.', color: 'text-cyber-gold border-cyber-gold/40' },
  { icon: ShieldCheck, title: '5 RPG Core Attributes', desc: 'Level up Kinetic Strength, Neural Intellect, Bio Vitality, Archive Wisdom, and Core Discipline.', color: 'text-cyber-cyan border-cyber-cyan/40' },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-cyber-bg text-cyber-text font-body selection:bg-cyber-cyan selection:text-cyber-bg overflow-x-hidden">
      {/* 3D Cyberpunk City Ambient Background */}
      <CyberEnvironment level={12} enabled={true} />

      {/* Navigation */}
      <nav className="relative z-20 border-b-2 border-cyber-border/40 bg-cyber-panel/90 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-cyber-cyan/20 border-2 border-cyber-cyan flex items-center justify-center shadow-holo-cyan">
              <Zap className="w-5 h-5 text-cyber-cyan fill-cyber-cyan" />
            </div>
            <span className="font-orbitron font-black text-2xl tracking-wider text-cyber-cyan text-glow-cyan">
              LIFE<span className="text-cyber-magenta">//</span>OS
            </span>
          </div>

          <div className="flex items-center gap-4">
            <SoundToggle />
            <Link
              to="/login"
              className="font-orbitron font-bold text-xs uppercase tracking-wider text-cyber-text hover:text-cyber-cyan px-4 py-2 transition-colors"
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

      {/* Hero Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-16 text-center space-y-8">
        <div className="inline-flex items-center gap-2 bg-cyber-cyan/15 border border-cyber-cyan text-cyber-cyan font-mono text-xs px-4 py-1.5 rounded uppercase tracking-widest font-bold shadow-cyber-sm">
          <span className="w-2 h-2 rounded-full bg-cyber-green animate-ping" />
          NEURAL LIFE OPERATING SYSTEM // V4.0
        </div>

        <h1 className="font-orbitron font-black text-5xl sm:text-7xl lg:text-8xl text-cyber-text tracking-tight uppercase leading-none">
          YOUR LIFE IS AN{' '}
          <span className="text-cyber-cyan text-glow-cyan underline decoration-cyber-magenta decoration-4 underline-offset-8">
            RPG
          </span>
        </h1>

        <p className="font-body text-base sm:text-xl text-cyber-muted max-w-2xl mx-auto leading-relaxed">
          Transform daily habits into mission directives. Power a 3D Energy Core, harvest credits, level up core attributes, and evolve the world matrix.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link to="/signup">
            <HoloButton variant="cyan" size="lg" icon={ArrowRight}>
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
        <div className="bg-cyber-panel/80 backdrop-blur-xl border-2 border-cyber-cyan/50 rounded-2xl p-6 md:p-8 shadow-holo-cyan space-y-6 cyber-corner-tl">
          <div className="flex items-center justify-between border-b border-cyber-border/40 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-cyber-green animate-ping" />
              <span className="font-orbitron font-bold text-sm text-cyber-cyan uppercase tracking-wider">
                3D COMMAND CHAMBER DEMO
              </span>
            </div>
            <span className="font-mono text-xs text-cyber-gold bg-cyber-bg px-2.5 py-1 rounded border border-cyber-gold/40">
              CORE CHARGE: 100%
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-3">
              <h3 className="font-orbitron font-black text-2xl md:text-3xl text-cyber-text">
                THE REALM RESPONDS TO YOUR DISCIPLINE
              </h3>
              <p className="font-body text-sm text-cyber-muted leading-relaxed">
                Every verified quest emits energy particles that charge the 3D XP Core in real-time. Attributes like Intellect, Strength, and Vitality rise with each verified mission.
              </p>
            </div>

            <div className="lg:col-span-5 bg-cyber-bg/90 border-2 border-cyber-cyan/30 rounded-lg p-2 shadow-inner">
              <PlayerPod3D level={14} username="NEXUS_CHAMPION" height="220px" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16 border-t-2 border-cyber-border/40 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="font-orbitron font-black text-3xl sm:text-4xl text-cyber-text uppercase tracking-wide">
            NEURAL GAME MECHANICS
          </h2>
          <p className="font-mono text-xs text-cyber-muted">
            DESIGNED FOR REAL-LIFE MASTERY WITH AAA-TIER INTERACTIVE FEEDBACK
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc, color }) => (
            <div
              key={title}
              className="bg-cyber-panel/85 backdrop-blur-md border-2 border-cyber-border/50 rounded-lg p-6 space-y-3 hover:border-cyber-cyan hover:shadow-holo-cyan transition-all duration-200 cyber-corner-tl"
            >
              <div className={`w-12 h-12 rounded-lg bg-cyber-bg border-2 flex items-center justify-center text-cyber-cyan ${color}`}>
                <Icon className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="font-orbitron font-bold text-lg text-cyber-text tracking-wide">{title}</h3>
              <p className="font-body text-xs text-cyber-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t-2 border-cyber-border/40 bg-cyber-panel/90 py-10 text-center text-xs font-mono text-cyber-muted">
        <p>LIFE//OS — CYBERPUNK LIFE RPG MATRIX. COPYRIGHT © 2026. ALL RIGHTS ENCRYPTED.</p>
      </footer>
    </div>
  );
}
