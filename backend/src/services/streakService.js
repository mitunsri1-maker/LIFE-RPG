const pool = require('../db/pool');
const db = pool._db;

const updateStreak = (userId) => {
  const row = db.prepare(
    'SELECT current_streak, best_streak, last_active_date FROM user_streaks WHERE user_id = ?'
  ).get(userId);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0];

  let currentStreak = 1, bestStreak = 1, bonusGold = 0;

  if (!row) {
    db.prepare(
      'INSERT INTO user_streaks (user_id, current_streak, best_streak, last_active_date) VALUES (?, ?, ?, ?)'
    ).run(userId, 1, 1, todayStr);
  } else {
    const { current_streak, best_streak, last_active_date } = row;
    const lastDate = last_active_date ? new Date(last_active_date) : null;

    if (lastDate) {
      const lastDateStr = lastDate.toISOString().split('T')[0];
      if (lastDateStr === todayStr) {
        return { current_streak, best_streak, bonus_gold: 0, milestone: null };
      }

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastDateStr === yesterdayStr) {
        currentStreak = current_streak + 1;
      } else {
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }

    bestStreak = Math.max(currentStreak, best_streak || 0);

    db.prepare(
      'UPDATE user_streaks SET current_streak = ?, best_streak = ?, last_active_date = ? WHERE user_id = ?'
    ).run(currentStreak, bestStreak, todayStr, userId);
  }

  let milestone = null;
  if (currentStreak === 3) {
    bonusGold = 50;
    milestone = { type: 'gold', value: 50, label: '3-Day Streak Bonus!' };
    db.prepare('UPDATE users SET gold = gold + ? WHERE id = ?').run(50, userId);
  } else if (currentStreak === 7) {
    milestone = { type: 'badge', label: 'Streak Warrior badge unlocked!' };
  } else if (currentStreak === 30) {
    milestone = { type: 'achievement', label: 'Legendary Streak achievement unlocked!' };
  }

  return { current_streak: currentStreak, best_streak: bestStreak, bonus_gold: bonusGold, milestone };
};

module.exports = { updateStreak };
