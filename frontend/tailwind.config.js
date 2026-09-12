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
          bg: '#EAF3FA', // Bright daylight ambient sky/atmosphere base
          void: '#DDE9F5',
          navy: '#C8DDF2',
          panel: '#FFFFFF', // High-contrast frosted daylight panel
          panel2: '#F0F6FC',
          panelPurple: '#F5F0FF',
          panelTeal: '#E6F8FA',
          card: '#FFFFFF',
          glass: 'rgba(255, 255, 255, 0.78)',
          glassBorder: 'rgba(255, 255, 255, 0.85)',
          border: 'rgba(0, 180, 216, 0.35)',
          borderPurple: 'rgba(168, 85, 247, 0.35)',
          borderAmber: 'rgba(245, 158, 11, 0.35)',
          cyan: '#00B4D8', // Daylight electric cyan (vibrant, accessible)
          cyanGlow: '#00F0FF',
          blue: '#0284C7',
          magenta: '#E11D48',
          purple: '#9333EA',
          violet: '#7C3AED',
          neon: '#6366F1',
          green: '#059669',
          mint: '#10B981',
          yellow: '#D97706',
          amber: '#F59E0B',
          gold: '#D97706',
          red: '#DC2626',
          coral: '#F43F5E',
          text: '#0F172A', // Crisp dark navy/slate for bright mode readability
          textMuted: '#475569',
          muted: '#64748B',
          dim: '#94A3B8',
          daySkyTop: '#7EB6E8',
          daySkyBottom: '#DBEDFC',
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
        'holo-cyan': '0 4px 20px rgba(0, 180, 216, 0.28), 0 0 1px rgba(0, 180, 216, 0.5)',
        'holo-purple': '0 4px 20px rgba(147, 51, 234, 0.25), 0 0 1px rgba(147, 51, 234, 0.5)',
        'holo-green': '0 4px 20px rgba(16, 185, 129, 0.25), 0 0 1px rgba(16, 185, 129, 0.5)',
        'holo-gold': '0 4px 20px rgba(245, 158, 11, 0.25), 0 0 1px rgba(245, 158, 11, 0.5)',
        'holo-red': '0 4px 20px rgba(244, 63, 94, 0.25), 0 0 1px rgba(244, 63, 94, 0.5)',
        'cyber-sm': '0 2px 10px rgba(0, 180, 216, 0.2)',
        'cyber-glow': '0 8px 30px rgba(0, 180, 216, 0.3)',
        'glass-depth': '0 10px 30px -5px rgba(15, 23, 42, 0.1), 0 4px 12px -2px rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
        'city-rim': '0 0 0 1px rgba(255, 255, 255, 0.8), 0 8px 24px -4px rgba(15, 23, 42, 0.12)',
        'day-card': '0 12px 32px -4px rgba(12, 74, 110, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.95)',
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
