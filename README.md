# Life RPG 🎮

> Turn your real-life tasks into epic quests. Earn XP, gold, and attribute points. Level up your character as you level up your life.

## Live Demo
- **Frontend:** [Deploy to Vercel](#deployment)
- **Backend:** [Deploy to Railway](#deployment)

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite) + Tailwind CSS + Zustand + Recharts |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| Auth | JWT (bcryptjs) |
| Deploy | Vercel (frontend) + Railway (backend + DB) |

## Project Structure
```
/
├── frontend/          # React (Vite) app
│   ├── src/
│   │   ├── api/       # Axios client + resource functions
│   │   ├── components/# UI components + Layout
│   │   ├── pages/     # Route pages
│   │   ├── router/    # React Router v6
│   │   └── store/     # Zustand state
│   └── .env.example
├── backend/           # Node.js + Express API
│   ├── src/
│   │   ├── db/        # PostgreSQL pool + schema + seed
│   │   ├── middleware/ # JWT auth + validation
│   │   ├── routes/    # API endpoints
│   │   └── services/  # Level, Streak, Achievement logic
│   └── .env.example
└── README.md
```

## Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### 1. Clone & install
```bash
git clone <your-repo-url>
cd life-rpg

# Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials and JWT secret

# Frontend
cd ../frontend
npm install
cp .env.example .env
```

### 2. Database setup
```bash
# Create the database
createdb life_rpg

# Apply schema + seed data
cd backend
node src/db/init.js
```

### 3. Run locally
```bash
# Terminal 1 — Backend
cd backend
npm run dev          # Runs on http://localhost:3001

# Terminal 2 — Frontend
cd frontend
npm run dev          # Runs on http://localhost:5173
```

## Environment Variables

### Backend (`backend/.env`)
```
DATABASE_URL=postgresql://user:password@localhost:5432/life_rpg
JWT_SECRET=your-very-long-random-secret-key
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)
```
VITE_API_URL=           # Empty = use Vite proxy in dev; set to backend URL in prod
```

## API Endpoints
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/signup | - | Register user |
| POST | /api/auth/login | - | Login |
| GET | /api/auth/me | ✓ | Current user |
| GET | /api/quests | ✓ | List quests |
| POST | /api/quests | ✓ | Create quest |
| POST | /api/quests/:id/complete | ✓ | Complete quest (RPG engine) |
| GET | /api/character | ✓ | Character + stats + achievements |
| GET | /api/progress/streak | ✓ | Streak + activity calendar |
| GET | /api/shop/items | ✓ | Shop catalog |
| POST | /api/shop/items/:id/buy | ✓ | Purchase item |
| GET | /api/inventory | ✓ | User inventory |
| POST | /api/inventory/:id/equip | ✓ | Toggle equip item |

## Deployment

### Backend (Railway)
1. Create new Railway project → Add PostgreSQL service
2. Deploy backend from `/backend` folder
3. Set environment variables in Railway dashboard
4. Run `node src/db/init.js` via Railway shell to initialize DB

### Frontend (Vercel)
1. Import repo to Vercel → set root directory to `frontend`
2. Set `VITE_API_URL=https://your-railway-backend.up.railway.app/api`
3. Deploy

## Security
- All XP/gold/reward calculations are **server-side only** — clients can never send reward values
- Every request to protected routes is authenticated via JWT middleware
- User can only access/modify their own data (enforced in all queries)
- Passwords hashed with bcrypt (12 rounds)
- Helmet.js security headers
- Input validation via express-validator

## RPG Systems

### XP Curve
`Level N requires floor(100 × 1.5^(N-1)) XP`
- Level 1 → 2: 100 XP
- Level 2 → 3: 150 XP
- Level 3 → 4: 225 XP

### Rewards by Difficulty
| Difficulty | XP | Gold | Attr Gain |
|------------|-----|------|-----------|
| Easy | 50 | 10 | +1 |
| Medium | 100 | 25 | +2 |
| Hard | 200 | 50 | +3 |

### Category → Attribute
| Category | Attribute |
|----------|-----------|
| Coding/Study | Intellect |
| Gym/Physical | Strength |
| Running/Cardio | Vitality |
| Reading | Wisdom |
| Meditation/Habits | Discipline |

### Streak Milestones
- 3 days → +50 Gold bonus
- 7 days → "Streak Warrior" achievement
- 30 days → "Legendary" achievement
