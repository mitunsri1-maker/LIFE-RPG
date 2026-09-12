import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  LayoutDashboard, Swords, User, TrendingUp,
  ShoppingBag, Backpack, Settings, LogOut, Zap, Shield, Sparkles, Monitor
} from 'lucide-react';
import CyberEnvironment from '../3d/CyberEnvironment';
import CyberCursor from '../hud/CyberCursor';
import SoundToggle from '../hud/SoundToggle';
import { soundFX } from '../../utils/soundFX';
import GoldCounter from '../ui/GoldCounter';
import StreakCounter from '../ui/StreakCounter';
import LevelBadge from '../ui/LevelBadge';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'COMMAND', code: '01' },
  { to: '/quests', icon: Swords, label: 'QUEST LOG', code: '02' },
  { to: '/character', icon: User, label: 'CHARACTER', code: '03' },
  { to: '/progress', icon: TrendingUp, label: 'EVOLUTION', code: '04' },
  { to: '/shop', icon: ShoppingBag, label: 'BAZAAR', code: '05' },
  { to: '/inventory', icon: Backpack, label: 'INVENTORY', code: '06' },
  { to: '/settings', icon: Settings, label: 'SETTINGS', code: '07' },
];

export default function AppLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [time, setTime] = useState('');
  const [enable3D, setEnable3D] = useState(true);

  useEffect(() => {
    const updateClock = () => {
      const d = new Date();
      setTime(d.toLocaleTimeString([], { hour12: false }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    soundFX.playClick();
    await logout();
    navigate('/');
  };

  const handleNavClick = () => {
    soundFX.playClick();
  };

  return (
    <div className="relative min-h-screen bg-cyber-bg text-cyber-text font-body selection:bg-cyber-cyan selection:text-cyber-bg overflow-x-hidden">
      {/* 3D Cyberpunk City Ambient Background */}
      <CyberEnvironment level={user?.level || 1} enabled={enable3D} />

      {/* Custom Cyber Cursor */}
      <CyberCursor />

      {/* Main App Container */}
      <div className="relative z-10 flex flex-col h-screen overflow-hidden">
        {/* Top Global Holographic Header Bar */}
        <header className="h-14 dark-navbar px-4 md:px-6 flex items-center justify-between shrink-0 select-none shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          {/* Brand & System Status */}
          <div className="flex items-center gap-3 md:gap-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyber-cyan/15 border border-cyber-cyan/50 text-cyber-cyan flex items-center justify-center shadow-[0_0_12px_rgba(0,229,255,0.3)]">
                <Zap className="w-4 h-4 text-cyber-cyan fill-cyber-cyan" />
              </div>
              <span className="font-orbitron font-black text-lg md:text-xl tracking-wider text-cyber-text text-glow-cyan">
                LIFE<span className="text-cyber-cyan">//</span>OS
              </span>
            </div>

            <div className="hidden lg:flex items-center gap-2 text-[10px] font-mono text-cyber-dim bg-cyber-navy/80 border border-cyber-cyan/25 px-2.5 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-cyber-green animate-ping" />
              <span className="text-cyber-textMuted">METROPOLIS GRID // ONLINE</span>
            </div>
          </div>

          {/* Quick HUD Metrics & Controls */}
          <div className="flex items-center gap-3 md:gap-4">
            {user && (
              <div className="hidden sm:flex items-center gap-3">
                <GoldCounter gold={user.gold} />
                <StreakCounter />
              </div>
            )}

            {/* Live Telemetry Clock */}
            <div className="hidden md:block font-mono text-xs text-cyber-cyan bg-cyber-navy/80 border border-cyber-cyan/30 px-2.5 py-1 rounded-lg shadow-[0_0_10px_rgba(0,229,255,0.15)]">
              UTC {time}
            </div>

            {/* 3D Background Toggle Button */}
            <button
              onClick={() => setEnable3D(!enable3D)}
              title={enable3D ? "Disable 3D Background" : "Enable 3D Background"}
              className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                enable3D
                  ? 'bg-cyber-cyan/20 text-cyber-cyan border-cyber-cyan shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                  : 'bg-cyber-navy/80 text-cyber-dim border-cyber-dim/40 hover:border-cyber-cyan/40 hover:text-cyber-text'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>3D: {enable3D ? 'ON' : 'OFF'}</span>
            </button>

            {/* Cyber Sound FX Toggle */}
            <SoundToggle />
          </div>
        </header>

        {/* Core Layout: Sidebar + Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Dark Cyberpunk Sidebar (Desktop) */}
          <aside className="hidden md:flex flex-col w-64 city-glass border-r border-cyber-cyan/25 shrink-0">
            {/* Player Quick Badge */}
            {user && (
              <div className="p-3.5 mx-3 my-3 city-glass-elevated border border-cyber-cyan/30 rounded-xl space-y-2.5">
                <div className="flex items-center gap-3">
                  <LevelBadge level={user.level || 1} />
                  <div className="min-w-0 flex-1">
                    <p className="font-orbitron font-bold text-sm text-cyber-text truncate">
                      {user.username}
                    </p>
                    <p className="font-mono text-[10px] text-cyber-cyan uppercase tracking-wider font-semibold">
                      RANK // OPERATIVE
                    </p>
                  </div>
                </div>

                <div className="sm:hidden flex flex-wrap gap-2 pt-1 border-t border-cyber-cyan/20">
                  <GoldCounter gold={user.gold} />
                  <StreakCounter />
                </div>
              </div>
            )}

            {/* HUD Nav Links */}
            <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
              {navItems.map(({ to, icon: Icon, label, code }) => {
                const active = location.pathname === to;
                return (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={handleNavClick}
                    className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl font-orbitron text-xs font-bold tracking-wider transition-all duration-200 border select-none ${
                      active
                        ? 'bg-gradient-to-r from-cyber-cyan/25 to-cyber-violet/25 text-cyber-cyan border-cyber-cyan shadow-[0_0_15px_rgba(0,229,255,0.25)] translate-x-1'
                        : 'text-cyber-textMuted border-transparent hover:border-cyber-cyan/30 hover:text-cyber-text hover:bg-cyber-navy/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 shrink-0 transition-transform ${active ? 'scale-110 text-cyber-cyan' : 'group-hover:text-cyber-cyan'}`} />
                      <span>{label}</span>
                    </div>
                    <span className={`font-mono text-[10px] ${active ? 'opacity-90 text-cyber-cyan' : 'opacity-40'}`}>[{code}]</span>
                  </NavLink>
                );
              })}
            </nav>

            {/* Logout Button */}
            <div className="p-3 border-t border-cyber-cyan/20">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-orbitron font-bold text-xs uppercase tracking-wider text-cyber-magenta bg-cyber-magenta/10 border border-cyber-magenta/40 hover:bg-cyber-magenta hover:text-white transition-all cursor-pointer shadow-[0_0_12px_rgba(255,45,166,0.2)]"
              >
                <LogOut className="w-3.5 h-3.5 stroke-[2.5]" /> DISCONNECT
              </button>
            </div>
          </aside>

          {/* Main Content Viewport */}
          <main className="flex-1 overflow-y-auto pb-24 md:pb-8 relative">
            <Outlet />
          </main>

          {/* Holographic Bottom Dock (Mobile) */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 city-glass-elevated border-t border-cyber-cyan/40 flex items-center justify-around px-2 py-2 z-40">
            {navItems.slice(0, 5).map(({ to, icon: Icon, label }) => {
              const active = location.pathname === to;
              return (
                <NavLink
                  key={to}
                  to={to}
                  onClick={handleNavClick}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg font-orbitron font-bold text-[9px] border transition-all ${
                    active
                      ? 'bg-cyber-cyan/25 text-cyber-cyan border-cyber-cyan shadow-cyber-sm'
                      : 'text-cyber-textMuted border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label.split(' ')[0]}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
