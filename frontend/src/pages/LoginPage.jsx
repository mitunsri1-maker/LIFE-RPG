import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Zap, Eye, EyeOff, AlertCircle, ArrowRight, Terminal } from 'lucide-react';
import CyberEnvironment from '../components/3d/CyberEnvironment';
import HoloButton from '../components/hud/HoloButton';
import { soundFX } from '../utils/soundFX';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    soundFX.playClick();
    const res = await login(form);
    if (res.success) {
      soundFX.playQuestComplete();
      navigate('/dashboard');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-cyber-bg text-cyber-text overflow-hidden">
      <CyberEnvironment level={6} enabled={true} />

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-cyber-cyan/15 border border-cyber-cyan/50 text-cyber-cyan shadow-[0_0_15px_rgba(0,229,255,0.3)] flex items-center justify-center mx-auto">
            <Zap className="w-8 h-8 fill-cyber-cyan text-cyber-cyan" />
          </div>
          <h1 className="font-orbitron font-black text-3xl text-cyber-text uppercase tracking-tight text-glow-cyan">
            AUTHENTICATE SESSION
          </h1>
          <p className="font-mono text-xs text-cyber-textMuted">
            ENTER CREDENTIALS TO INITIALIZE NEURAL LINK
          </p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="city-glass-elevated border border-cyber-cyan/35 rounded-2xl p-6 md:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.6)] space-y-5"
        >
          {error && (
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyber-magenta bg-cyber-magenta/10 border border-cyber-magenta/30 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

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
              className="w-full bg-cyber-navy/80 border border-cyber-cyan/30 rounded-xl px-4 py-3 text-sm font-mono text-cyber-text placeholder:text-cyber-dim focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan focus:outline-none shadow-sm"
            />
          </div>

          <div>
            <label className="block font-orbitron font-bold text-xs uppercase tracking-wider text-cyber-text mb-1.5">
              Secret Passkey
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-cyber-navy/80 border border-cyber-cyan/30 rounded-xl px-4 py-3 text-sm font-mono text-cyber-text placeholder:text-cyber-dim focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan focus:outline-none pr-11 shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cyber-dim hover:text-cyber-cyan cursor-pointer"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <HoloButton
            type="submit"
            variant="cyan"
            size="lg"
            disabled={isLoading}
            className="w-full shadow-lg"
          >
            {isLoading ? 'DECRYPTING LINK...' : 'ESTABLISH LINK →'}
          </HoloButton>
        </form>

        <p className="text-center font-mono text-xs text-cyber-textMuted">
          UNREGISTERED OPERATIVE?{' '}
          <Link to="/signup" className="text-cyber-cyan underline hover:text-cyber-cyan/80 font-bold ml-1">
            ENROLL DOSSIER
          </Link>
        </p>
      </div>
    </div>
  );
}
