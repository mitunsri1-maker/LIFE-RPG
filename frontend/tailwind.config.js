/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#070B19',
          void: '#0B1024',
          navy: '#0C132E',
          panel: '#101838',
          panel2: '#162048',
          panelPurple: '#181238',
          panelTeal: '#092338',
          card: '#131D42',
          glass: 'rgba(16, 24, 56, 0.75)',
          border: 'rgba(0, 240, 255, 0.28)',
          borderPurple: 'rgba(139, 92, 246, 0.35)',
          borderAmber: 'rgba(255, 184, 0, 0.35)',
          cyan: '#00F0FF',
          blue: '#0080FF',
          magenta: '#FF007F',
          purple: '#A855F7',
          violet: '#8B5CF6',
          neon: '#7C3AED',
          green: '#00FF9D',
          mint: '#2FE6A0',
          yellow: '#FFE600',
          amber: '#FFB800',
          gold: '#FFB800',
          red: '#FF003C',
          coral: '#FF3366',
          text: '#E2F1FD',
          textMuted: '#94A8C8',
          muted: '#7F96B2',
          dim: '#485C77',
        },
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['Orbitron', '"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'holo-cyan': '0 0 24px rgba(0, 240, 255, 0.35), inset 0 0 15px rgba(0, 240, 255, 0.08)',
        'holo-purple': '0 0 24px rgba(168, 85, 247, 0.35), inset 0 0 15px rgba(168, 85, 247, 0.08)',
        'holo-green': '0 0 24px rgba(0, 255, 157, 0.35), inset 0 0 15px rgba(0, 255, 157, 0.08)',
        'holo-gold': '0 0 24px rgba(255, 184, 0, 0.35), inset 0 0 15px rgba(255, 184, 0, 0.08)',
        'holo-red': '0 0 24px rgba(255, 0, 60, 0.35), inset 0 0 15px rgba(255, 0, 60, 0.08)',
        'cyber-sm': '0 2px 10px rgba(0, 240, 255, 0.22)',
        'cyber-glow': '0 0 35px rgba(0, 240, 255, 0.4)',
        'glass-depth': '0 12px 40px rgba(4, 7, 20, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'city-rim': '0 0 0 1px rgba(0, 240, 255, 0.25), 0 8px 30px rgba(0, 0, 0, 0.5)',
      },
      borderWidth: {
        3: '3px',
      },
      animation: {
        'scanline': 'scanline 8s linear infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'float-slow': 'floatSlow 4s ease-in-out infinite',
        'glitch': 'glitch 1s linear infinite',
        'hologram-flicker': 'holoFlicker 0.15s ease infinite alternate',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.6, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.03)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        holoFlicker: {
          '0%': { opacity: 0.96 },
          '100%': { opacity: 1 },
        }
      },
    },
  },
  plugins: [],
};
