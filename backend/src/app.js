const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const questRoutes = require('./routes/quests');
const characterRoutes = require('./routes/character');
const progressRoutes = require('./routes/progress');
const shopRoutes = require('./routes/shop');
const inventoryRoutes = require('./routes/inventory');

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use('/api/auth', authRoutes);
app.use('/api/quests', questRoutes);
app.use('/api/character', characterRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/inventory', inventoryRoutes);

app.use((req, res) => res.status(404).json({ error: 'Route not found.' }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error.' });
});

module.exports = app;
