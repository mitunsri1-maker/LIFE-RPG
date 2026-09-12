# LIFE//OS — 3D Cyberpunk Life RPG ⚡

> **Turn your real-life tasks into an epic cyberpunk RPG.** Power a real-time 3D Energy Core Reactor, advance your world evolution tier, harvest credits, level up 5 RPG attributes, and equip 3D holographic gear in the Cyber Bazaar.

[![GitHub Repository](https://img.shields.io/badge/GitHub-LIFE--RPG-00F0FF?style=for-the-badge&logo=github)](https://github.com/mitunsri1-maker/LIFE-RPG.git)

---

## 🌟 Key Features

### 🏙️ 1. Real-Time 3D Cyberpunk City & World Evolution
- **Procedural Instanced City**: High-performance dark skyscrapers with glowing neon windows, holographic advertisements, and atmospheric particles.
- **World Evolution Engine**: The city skyline dynamically grows as your operative level advances:
  - **Level 1**: Neon District
  - **Level 5**: Data Archipelago
  - **Level 10**: High-Rise Skyline
  - **Level 20+**: Mega Metropolis
- **Interactive Mouse Parallax**: Smooth camera tracking reacting to mouse movement.
- **Graphic Mode Toggle**: Toggle 3D effects on/off anytime from the HUD for low-spec devices.

### 🛸 2. 3D Holographic Player Command Pod
- Elevated central holographic pedestal with rotating gyroscopic laser rings, vertical laser scanner, and orbiting attribute conduits.

### ⚛️ 3. 3D XP Energy Core Reactor
- Multi-layered plasma core with emissive resonance scaling dynamically with your current Level XP%.
- **Interactive Quest Completion Shockwave**: Completing any quest triggers an energy ingestion particle burst in real time.

### 🗺️ 4. 3D Interactive Mission Neural Map
- Switch between **Holographic Quest Cards** and an interactive **3D Mission Web** connecting active directives with glowing laser conduits.

### 🛒 5. 3D Cyber Bazaar & Equipment Vault
- Interactive rotating 3D holographic models for all items (Swords, Neural Chips, Bio-Armor, Power Boots, Wisdom Tomes, Themes, Badges).

### 🔊 6. Cyberpunk Web Audio Synthesizer
- Built-in sound effects using the native browser **Web Audio API** (tactile clicks, hover blips, quest completion chords, level-up celebration fanfare).

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19 + Vite + Tailwind CSS + Three.js + React Three Fiber + Drei + Framer Motion |
| **Backend** | Node.js + Express + SQLite (`better-sqlite3`) / PostgreSQL compatible |
| **Security** | JWT-based session auth + bcryptjs password hashing + server-side reward validation |
| **State** | Zustand with localStorage persistence |

---

## 🚀 Quick Start (Local Setup)

### 1. Clone & Install
```bash
git clone https://github.com/mitunsri1-maker/LIFE-RPG.git
cd LIFE-RPG

# Install Backend Dependencies
cd backend
npm install
node src/db/init.js     # Initializes database schema & seed items

# Install Frontend Dependencies
cd ../frontend
npm install --legacy-peer-deps
```

### 2. Launch Servers
```bash
# Terminal 1 — Backend API (Port 3001)
cd backend
npm run dev

# Terminal 2 — Frontend App (Port 5173)
cd frontend
npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser!

---

## 🔒 Security & Server-Side RPG Engine
- All XP, Gold, and Attribute calculations are performed **server-side only**.
- Complete quest endpoint (`POST /api/quests/:id/complete`) executes database transactions to prevent double-claiming or manipulation.

---

## 📜 License
MIT © 2026 [mitunsri1-maker](https://github.com/mitunsri1-maker/LIFE-RPG.git)
