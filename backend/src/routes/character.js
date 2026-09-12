const express = require('express');
const pool = require('../db/pool');
const db = pool._db;
const auth = require('../middleware/auth');
const { getLevelFromXp, getXpProgress } = require('../services/levelService');
const { getAllDefinitions } = require('../services/achievementService');

const router = express.Router();

// GET /api/character
router.get('/', auth, (req, res) => {
  try {
    const user = db.prepare('SELECT id, username, email, level, xp, gold, created_at FROM users WHERE id = ?').get(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const stats = db.prepare('SELECT * FROM character_stats WHERE user_id = ?').get(req.userId) || {};
    const streak = db.prepare('SELECT * FROM user_streaks WHERE user_id = ?').get(req.userId) || { current_streak: 0, best_streak: 0 };
    const unlockedAchievements = db.prepare('SELECT achievement_key, unlocked_at FROM achievements WHERE user_id = ? ORDER BY unlocked_at ASC').all(req.userId);

    const { xpInCurrentLevel, xpForNextLevel } = getXpProgress(user.xp, user.level);

    const allDefs = getAllDefinitions();
    const unlockedKeys = new Set(unlockedAchievements.map((a) => a.achievement_key));
    const achievements = allDefs.map((def) => ({
      ...def,
      unlocked: unlockedKeys.has(def.key),
      unlocked_at: unlockedAchievements.find((a) => a.achievement_key === def.key)?.unlocked_at || null,
    }));

    res.json({
      user,
      stats,
      streak,
      level_meta: { xp_in_current_level: xpInCurrentLevel, xp_for_next_level: xpForNextLevel },
      achievements,
    });
  } catch (err) {
    console.error('Character error:', err);
    res.status(500).json({ error: 'Failed to fetch character data.' });
  }
});

// GET /api/character/stats
router.get('/stats', auth, (req, res) => {
  try {
    const stats = db.prepare('SELECT * FROM character_stats WHERE user_id = ?').get(req.userId) || {};
    res.json({ stats });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats.' });
  }
});

module.exports = router;
