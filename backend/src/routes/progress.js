const express = require('express');
const pool = require('../db/pool');
const db = pool._db;
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/progress
router.get('/', auth, (req, res) => {
  try {
    const user = db.prepare('SELECT level, xp, gold FROM users WHERE id = ?').get(req.userId);
    const streak = db.prepare('SELECT current_streak, best_streak, last_active_date FROM user_streaks WHERE user_id = ?').get(req.userId) || { current_streak: 0, best_streak: 0 };
    const completedCount = db.prepare("SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND status = 'completed'").get(req.userId);
    const activeCount = db.prepare("SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND status = 'active'").get(req.userId);

    res.json({
      user,
      streak,
      stats: {
        total_completed: completedCount.count,
        total_active: activeCount.count,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch progress.' });
  }
});

// GET /api/progress/history
router.get('/history', auth, (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 30, 100);
    const offset = parseInt(req.query.offset) || 0;

    const history = db.prepare(
      `SELECT al.*, t.title as task_title, t.category, t.difficulty
       FROM activity_logs al
       LEFT JOIN tasks t ON al.task_id = t.id
       WHERE al.user_id = ?
       ORDER BY al.completed_at DESC
       LIMIT ? OFFSET ?`
    ).all(req.userId, limit, offset);

    const countRow = db.prepare('SELECT COUNT(*) as count FROM activity_logs WHERE user_id = ?').get(req.userId);

    res.json({ history, total: countRow.count, limit, offset });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history.' });
  }
});

// GET /api/progress/streak
router.get('/streak', auth, (req, res) => {
  try {
    const streak = db.prepare('SELECT * FROM user_streaks WHERE user_id = ?').get(req.userId) || { current_streak: 0, best_streak: 0 };
    const calendar = db.prepare(
      `SELECT DATE(completed_at) as date, COUNT(*) as count, SUM(xp_earned) as xp
       FROM activity_logs
       WHERE user_id = ? AND completed_at >= datetime('now', '-90 days')
       GROUP BY DATE(completed_at)
       ORDER BY date ASC`
    ).all(req.userId);

    res.json({ streak, calendar });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch streak data.' });
  }
});

module.exports = router;
