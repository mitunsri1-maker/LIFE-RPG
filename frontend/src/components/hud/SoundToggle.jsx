import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundFX } from '../../utils/soundFX';

export default function SoundToggle() {
  const [muted, setMuted] = useState(soundFX.isMuted());

  const handleToggle = () => {
    const isMuted = soundFX.toggleMute();
    setMuted(isMuted);
    if (!isMuted) soundFX.playClick();
  };

  return (
    <button
      onClick={handleToggle}
      title={muted ? "Enable Cyber Sound FX" : "Mute Sound FX"}
      className="inline-flex items-center gap-1.5 bg-cyber-panel/80 border border-cyber-border hover:border-cyber-cyan text-cyber-text hover:text-cyber-cyan px-2.5 py-1.5 rounded text-xs font-mono transition-colors"
    >
      {muted ? <VolumeX className="w-3.5 h-3.5 text-cyber-red" /> : <Volume2 className="w-3.5 h-3.5 text-cyber-green animate-pulse" />}
      <span className="hidden sm:inline">{muted ? 'AUDIO: OFF' : 'AUDIO: ON'}</span>
    </button>
  );
}
