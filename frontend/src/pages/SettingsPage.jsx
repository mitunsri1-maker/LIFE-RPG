import React from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import HoloPanel from '../components/hud/HoloPanel';
import HoloButton from '../components/hud/HoloButton';
import { soundFX } from '../utils/soundFX';
import { LogOut as LogOutIcon, Calendar as CalendarIcon, Printer as PrinterIcon, ShieldCheck } from 'lucide-react';

export default function SettingsPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    soundFX.playClick();
    await logout();
    navigate('/');
  };

  const handlePrint = () => {
    soundFX.playClick();
    window.print();
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      {/* Title */}
      <div>
        <h1 className="font-orbitron font-black text-3xl md:text-4xl text-cyber-text tracking-tight flex items-center gap-3">
          <span className="w-11 h-11 rounded-xl bg-cyber-cyan/20 border-2 border-cyber-cyan text-cyber-cyan flex items-center justify-center text-xl shadow-holo-cyan">
            ⚙️
          </span>
          SYSTEM SETTINGS
        </h1>
        <p className="font-mono text-xs text-cyber-textMuted mt-1">
          OPERATIVE CREDENTIALS // SESSION CRYPTOGRAPHY // DATA INTEGRITY
        </p>
      </div>

      {/* Operative Account Profile */}
      <HoloPanel
        title="OPERATIVE PROFILE TELEMETRY"
        subtitle="AUTHENTICATED USER SESSION DATA"
        accent="cyan"
        glow
        tag="[SYS.PROFILE]"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pt-2">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-xl bg-cyber-cyan/20 border-2 border-cyber-cyan shadow-holo-cyan flex items-center justify-center font-orbitron font-black text-2xl text-cyber-cyan select-none">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-orbitron font-bold text-xl text-cyber-text">{user?.username}</p>
              <p className="font-mono text-xs text-cyber-textMuted">{user?.email}</p>
              {user?.created_at && (
                <p className="font-mono text-[11px] text-cyber-green font-bold flex items-center gap-1.5 mt-1">
                  <CalendarIcon className="w-3.5 h-3.5" /> ENROLLED IN MATRIX: {format(new Date(user.created_at), 'MMMM d, yyyy')}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={handlePrint}
            className="no-print inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold city-glass border border-cyber-border/40 text-cyber-textMuted hover:text-cyber-cyan hover:border-cyber-cyan transition-all cursor-pointer self-start sm:self-auto"
          >
            <PrinterIcon className="w-3.5 h-3.5" /> EXPORT TELEMETRY REPORT
          </button>
        </div>
      </HoloPanel>

      {/* Security Status */}
      <HoloPanel
        title="NEURAL LINK CRYPTOGRAPHY"
        subtitle="END-TO-END JWT SESSION ENCRYPTION"
        accent="green"
        tag="[SYS.CRYPTO]"
      >
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-cyber-green shrink-0" />
          <div>
            <p className="font-orbitron font-bold text-sm text-cyber-text">SESSION ENCRYPTION VERIFIED</p>
            <p className="font-mono text-xs text-cyber-textMuted mt-0.5">SHA-256 HMAC tokens active with 7-day automated renewal.</p>
          </div>
        </div>
      </HoloPanel>

      {/* Danger Zone */}
      <HoloPanel
        title="SECURITY OVERRIDE TERMINAL"
        subtitle="SESSION TERMINATION"
        accent="red"
        glow
        tag="[SYS.OVERRIDE]"
      >
        <div className="space-y-4">
          <p className="font-body text-xs text-cyber-textMuted leading-relaxed">
            Terminate your encrypted session link. Your character level, energy stats, credits, and inventory remain safely committed to the database.
          </p>

          <HoloButton
            variant="red"
            size="md"
            icon={LogOutIcon}
            onClick={handleLogout}
          >
            DISCONNECT NEURAL SESSION
          </HoloButton>
        </div>
      </HoloPanel>
    </div>
  );
}
