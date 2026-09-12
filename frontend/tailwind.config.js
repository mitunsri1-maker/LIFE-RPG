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
          bg: '#05070E',
          void: '#090D1A',
          panel: '#0E1426',
          panel2: '#141C34',
          card: '#0F172A',
          border: 'rgba(0, 240, 255, 0.25)',
          cyan: '#00F0FF',
          blue: '#0080FF',
          magenta: '#FF007F',
          purple: '#A855F7',
          violet: '#8B5CF6',
          neon: '#7C3AED',
          green: '#00FF9D',
          mint: '#2FE6A0',
          yellow: '#FFE600',
          gold: '#FFB800',
          red: '#FF003C',
          coral: '#FF385C',
          text: '#E2F1FD',
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
        'holo-cyan': '0 0 20px rgba(0, 240, 255, 0.35), inset 0 0 15px rgba(0, 240, 255, 0.1)',
        'holo-purple': '0 0 20px rgba(189, 0, 255, 0.35), inset 0 0 15px rgba(189, 0, 255, 0.1)',
        'holo-green': '0 0 20px rgba(0, 255, 157, 0.35), inset 0 0 15px rgba(0, 255, 157, 0.1)',
        'holo-gold': '0 0 20px rgba(255, 184, 0, 0.35), inset 0 0 15px rgba(255, 184, 0, 0.1)',
        'holo-red': '0 0 20px rgba(255, 0, 60, 0.35), inset 0 0 15px rgba(255, 0, 60, 0.1)',
        'cyber-sm': '0 2px 8px rgba(0, 240, 255, 0.2)',
        'cyber-glow': '0 0 35px rgba(0, 240, 255, 0.4)',
        'brutal-cyan': '4px 4px 0 0 #00F0FF',
        'brutal-magenta': '4px 4px 0 0 #FF007F',
        'brutal-green': '4px 4px 0 0 #00FF9D',
        'brutal-gold': '4px 4px 0 0 #FFB800',
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
