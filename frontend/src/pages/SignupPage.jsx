import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Zap, Eye, EyeOff, AlertCircle } from 'lucide-react';
import CyberEnvironment from '../components/3d/CyberEnvironment';
import HoloButton from '../components/hud/HoloButton';
import { soundFX } from '../utils/soundFX';

export default function SignupPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const { signup, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    soundFX.playClick();
    const res = await signup(form);
    if (res.success) {
      soundFX.playLevelUp();
      navigate('/dashboard');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-cyber-bg text-cyber-text overflow-hidden">
      <CyberEnvironment level={5} enabled={true} />

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-cyber-green/15 border border-cyber-green/50 text-cyber-green shadow-[0_0_15px_rgba(57,255,136,0.3)] flex items-center justify-center mx-auto">
            <Zap className="w-8 h-8 fill-cyber-green text-cyber-green" />
          </div>
          <h1 className="font-orbitron font-black text-3xl text-cyber-text uppercase tracking-tight text-glow-green">
            FORGE OPERATIVE
          </h1>
          <p className="font-mono text-xs text-cyber-textMuted">
            INITIALIZE OPERATIVE DOSSIER & CONNECT TO METROPOLIS
          </p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="city-glass-elevated border border-cyber-green/35 rounded-2xl p-6 md:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.6)] space-y-5"
        >
          {error && (
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyber-magenta bg-cyber-magenta/10 border border-cyber-magenta/30 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <div>
            <label className="block font-orbitron font-bold text-xs uppercase tracking-wider text-cyber-text mb-1.5">
              Operative Call-Sign (Username)
            </label>
            <input
              type="text"
              required
              autoComplete="username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="cyberninjax"
              className="w-full bg-cyber-navy/80 border border-cyber-green/30 rounded-xl px-4 py-3 text-sm font-mono text-cyber-text placeholder:text-cyber-dim focus:border-cyber-green focus:ring-1 focus:ring-cyber-green focus:outline-none shadow-sm"
            />
          </div>

          <div>
            <label className="block font-orbitron font-bold text-xs uppercase tracking-wider text-cyber-text mb-1.5">
              Operative Email Identifier
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="hero@liferpg.com"
              className="w-full bg-cyber-navy/80 border border-cyber-green/30 rounded-xl px-4 py-3 text-sm font-mono text-cyber-text placeholder:text-cyber-dim focus:border-cyber-green focus:ring-1 focus:ring-cyber-green focus:outline-none shadow-sm"
            />
          </div>

          <div>
            <label className="block font-orbitron font-bold text-xs uppercase tracking-wider text-cyber-text mb-1.5">
              Secret Passkey (Min 6 characters)
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                required
                minLength={6}
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-cyber-navy/80 border border-cyber-green/30 rounded-xl px-4 py-3 text-sm font-mono text-cyber-text placeholder:text-cyber-dim focus:border-cyber-green focus:ring-1 focus:ring-cyber-green focus:outline-none pr-11 shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cyber-dim hover:text-cyber-green cursor-pointer"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <HoloButton
            type="submit"
            variant="green"
            size="lg"
            disabled={isLoading}
            className="w-full shadow-lg"
          >
            {isLoading ? 'INITIALIZING DOSSIER...' : 'INITIALIZE CAMPAIGN →'}
          </HoloButton>
        </form>

        <p className="text-center font-mono text-xs text-cyber-textMuted">
          ALREADY ENROLLED?{' '}
          <Link to="/login" className="text-cyber-cyan underline hover:text-cyber-cyan/80 font-bold ml-1">
            AUTHENTICATE
          </Link>
        </p>
      </div>
    </div>
  );
}
