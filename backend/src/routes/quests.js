const express = require('express');
const { body } = require('express-validator');
const pool = require('../db/pool');
const db = pool._db;
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { checkLevelUp } = require('../services/levelService');
const { updateStreak } = require('../services/streakService');
const { checkAndUnlock } = require('../services/achievementService');

const router = express.Router();

// Reward tables (server-side only)
const XP_REWARDS = { easy: 50, medium: 100, hard: 200 };
const GOLD_REWARDS = { easy: 10, medium: 25, hard: 50 };
const ATTRIBUTE_GAIN = { easy: 1, medium: 2, hard: 3 };

const CATEGORY_ATTRIBUTE = {
  'coding': 'intellect', 'study': 'intellect',
  'gym': 'strength', 'physical': 'strength',
  'running': 'vitality', 'cardio': 'vitality',
  'reading': 'wisdom',
  'meditation': 'discipline', 'habits': 'discipline',
};

const getAttributeForCategory = (category) => {
  const key = category.toLowerCase();
  for (const [k, v] of Object.entries(CATEGORY_ATTRIBUTE)) {
    if (key.includes(k)) return v;
  }
  return 'discipline';
};

// GET /api/quests
router.get('/', auth, (req, res) => {
  try {
    const { status, today } = req.query;
    let query = 'SELECT * FROM tasks WHERE user_id = ?';
    const params = [req.userId];

    if (status && ['active', 'completed'].includes(status)) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (today === 'true') {
      const todayDate = new Date().toISOString().split('T')[0];
      query += ' AND (due_date = ? OR due_date IS NULL)';
      params.push(todayDate);
    }

    query += ' ORDER BY created_at DESC';
    const quests = db.prepare(query).all(...params);
    res.json({ quests });
  } catch (err) {
    console.error('Get quests error:', err);
    res.status(500).json({ error: 'Failed to fetch quests.' });
  }
});

// POST /api/quests
router.post(
  '/',
  auth,
  [
    body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 255 }),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('difficulty').isIn(['easy', 'medium', 'hard']).withMessage('Difficulty must be easy, medium, or hard'),
    body('description').optional().trim(),
    body('due_date').optional().isISO8601().withMessage('Invalid date format'),
  ],
  validate,
  (req, res) => {
    try {
      const { title, description, category, difficulty, due_date } = req.body;
      const xp_reward = XP_REWARDS[difficulty];
      const gold_reward = GOLD_REWARDS[difficulty];

      const info = db.prepare(
        'INSERT INTO tasks (user_id, title, description, category, difficulty, xp_reward, gold_reward, due_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      ).run(req.userId, title, description || null, category, difficulty, xp_reward, gold_reward, due_date || null);

      const quest = db.prepare('SELECT * FROM tasks WHERE id = ?').get(info.lastInsertRowid);
      res.status(201).json({ quest });
    } catch (err) {
      console.error('Create quest error:', err);
      res.status(500).json({ error: 'Failed to create quest.' });
    }
  }
);

// GET /api/quests/:id
router.get('/:id', auth, (req, res) => {
  try {
    const quest = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
    if (!quest) return res.status(404).json({ error: 'Quest not found.' });
    res.json({ quest });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch quest.' });
  }
});

// PUT /api/quests/:id
router.put('/:id', auth, validate, (req, res) => {
  try {
    const quest = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
    if (!quest) return res.status(404).json({ error: 'Quest not found.' });
    if (quest.status === 'completed') return res.status(400).json({ error: 'Cannot edit a completed quest.' });

    const { title, description, category, difficulty, due_date } = req.body;
    const newDiff = difficulty || quest.difficulty;

    db.prepare(
      `UPDATE tasks SET title = COALESCE(?, title), description = COALESCE(?, description),
       category = COALESCE(?, category), difficulty = COALESCE(?, difficulty),
       xp_reward = ?, gold_reward = ?, due_date = COALESCE(?, due_date)
       WHERE id = ? AND user_id = ?`
    ).run(title, description, category, difficulty, XP_REWARDS[newDiff], GOLD_REWARDS[newDiff], due_date, req.params.id, req.userId);

    const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
    res.json({ quest: updated });
  } catch (err) {
    console.error('Update quest error:', err);
    res.status(500).json({ error: 'Failed to update quest.' });
  }
});

// DELETE /api/quests/:id
router.delete('/:id', auth, (req, res) => {
  try {
    const info = db.prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?').run(req.params.id, req.userId);
    if (info.changes === 0) return res.status(404).json({ error: 'Quest not found.' });
    res.json({ message: 'Quest deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete quest.' });
  }
});

// POST /api/quests/:id/complete — THE RPG ENGINE
router.post('/:id/complete', auth, (req, res) => {
  try {
    const completeTransaction = db.transaction(() => {
      // 1. Verify ownership + active status
      const quest = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
      if (!quest) throw { status: 404, message: 'Quest not found.' };
      if (quest.status === 'completed') throw { status: 400, message: 'This quest has already been completed.' };

      // 2. Server-side reward calculation
      const xp_earned = XP_REWARDS[quest.difficulty];
      const gold_earned = GOLD_REWARDS[quest.difficulty];
      const attribute_amount = ATTRIBUTE_GAIN[quest.difficulty];
      const attribute_name = getAttributeForCategory(quest.category);
      const attribute_gain = { [attribute_name]: attribute_amount };

      // 3. Mark quest completed
      db.prepare("UPDATE tasks SET status = 'completed', completed_at = datetime('now') WHERE id = ?").run(quest.id);

      // 4. Award XP + gold
      db.prepare('UPDATE users SET xp = xp + ?, gold = gold + ? WHERE id = ?').run(xp_earned, gold_earned, req.userId);
      const userRow = db.prepare('SELECT xp, gold, level FROM users WHERE id = ?').get(req.userId);

      // 5. Update character_stats
      db.prepare(`UPDATE character_stats SET ${attribute_name} = ${attribute_name} + ? WHERE user_id = ?`).run(attribute_amount, req.userId);

      // 6. Log activity
      db.prepare(
        "INSERT INTO activity_logs (user_id, task_id, xp_earned, gold_earned, attribute_gain) VALUES (?, ?, ?, ?, ?)"
      ).run(req.userId, quest.id, xp_earned, gold_earned, JSON.stringify(attribute_gain));

      return { quest, xp_earned, gold_earned, attribute_gain, userRow };
    });

    const result = completeTransaction();
    const { xp_earned, gold_earned, attribute_gain, userRow } = result;

    // 7. Check level-up
    const levelResult = checkLevelUp(req.userId);

    // 8. Update streak
    const streakResult = updateStreak(req.userId);

    // 9. Check achievements
    const completedCount = db.prepare("SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND status = 'completed'").get(req.userId);
    const hardCount = db.prepare("SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND status = 'completed' AND difficulty = 'hard'").get(req.userId);

    const achievementContext = {
      total_completed: completedCount.count,
      level: levelResult.new_level,
      streak: streakResult.current_streak,
      total_gold: userRow.gold,
      completed_hard: hardCount.count,
    };
    const newAchievements = checkAndUnlock(req.userId, achievementContext);

    res.json({
      xp_earned, gold_earned, attribute_gain,
      level_up: levelResult.leveled_up,
      new_level: levelResult.new_level,
      old_level: levelResult.old_level,
      total_xp: userRow.xp + xp_earned,
      total_gold: userRow.gold + gold_earned,
      streak: streakResult,
      achievements_unlocked: newAchievements,
    });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    console.error('Complete quest error:', err);
    res.status(500).json({ error: 'Failed to complete quest.' });
  }
});

module.exports = router;
