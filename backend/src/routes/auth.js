const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const pool = require('../db/pool');
const db = pool._db;
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// POST /api/auth/signup
router.post(
  '/signup',
  [
    body('username').trim().isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // Check duplicates
      const existing = db.prepare('SELECT id FROM users WHERE email = ? OR username = ?').all(email, username);
      if (existing.length > 0) {
        return res.status(409).json({ error: 'An account with this email or username already exists.' });
      }

      const password_hash = await bcrypt.hash(password, 12);

      const insertUser = db.transaction(() => {
        const info = db.prepare(
          "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)"
        ).run(username, email, password_hash);

        const userId = info.lastInsertRowid;

        db.prepare('INSERT INTO character_stats (user_id) VALUES (?)').run(userId);
        db.prepare('INSERT INTO user_streaks (user_id) VALUES (?)').run(userId);

        const user = db.prepare(
          'SELECT id, username, email, level, xp, gold, created_at FROM users WHERE id = ?'
        ).get(userId);

        return user;
      });

      const user = insertUser();
      const token = generateToken(user.id);
      res.status(201).json({ token, user });
    } catch (err) {
      console.error('Signup error:', err);
      res.status(500).json({ error: 'Server error during signup.' });
    }
  }
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  validate,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = db.prepare(
        'SELECT id, username, email, password_hash, level, xp, gold, created_at FROM users WHERE email = ?'
      ).get(email);

      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const { password_hash, ...safeUser } = user;
      const token = generateToken(user.id);
      res.json({ token, user: safeUser });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Server error during login.' });
    }
  }
);

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully.' });
});

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  try {
    const user = db.prepare(
      'SELECT id, username, email, level, xp, gold, created_at FROM users WHERE id = ?'
    ).get(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ user });
  } catch (err) {
    console.error('Me error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
