const pool = require('../db/pool');
const db = pool._db;

const ACHIEVEMENT_DEFINITIONS = [
  {
    key: 'first_quest',
    label: 'First Steps',
    description: 'Complete your first quest.',
    check: (context) => context.total_completed >= 1,
  },
  {
    key: 'quest_10',
    label: 'Quest Veteran',
    description: 'Complete 10 quests.',
    check: (context) => context.total_completed >= 10,
  },
  {
    key: 'quest_50',
    label: 'Quest Master',
    description: 'Complete 50 quests.',
    check: (context) => context.total_completed >= 50,
  },
  {
    key: 'level_5',
    label: 'Rising Hero',
    description: 'Reach level 5.',
    check: (context) => context.level >= 5,
  },
  {
    key: 'level_10',
    label: 'Champion',
    description: 'Reach level 10.',
    check: (context) => context.level >= 10,
  },
  {
    key: 'streak_7',
    label: 'Streak Warrior',
    description: 'Maintain a 7-day streak.',
    check: (context) => context.streak >= 7,
  },
  {
    key: 'streak_30',
    label: 'Legendary',
    description: 'Maintain a 30-day streak.',
    check: (context) => context.streak >= 30,
  },
  {
    key: 'gold_1000',
    label: 'Midas Touch',
    description: 'Accumulate 1000 total gold.',
    check: (context) => context.total_gold >= 1000,
  },
  {
    key: 'hard_quest',
    label: 'Challenge Seeker',
    description: 'Complete your first Hard quest.',
    check: (context) => context.completed_hard >= 1,
  },
];

const checkAndUnlock = (userId, context) => {
  const newlyUnlocked = [];
  const existingRows = db.prepare('SELECT achievement_key FROM achievements WHERE user_id = ?').all(userId);
  const existing = new Set(existingRows.map((r) => r.achievement_key));

  for (const def of ACHIEVEMENT_DEFINITIONS) {
    if (!existing.has(def.key) && def.check(context)) {
      try {
        db.prepare('INSERT OR IGNORE INTO achievements (user_id, achievement_key) VALUES (?, ?)').run(userId, def.key);
        newlyUnlocked.push({ key: def.key, label: def.label, description: def.description });
      } catch (err) {}
    }
  }

  return newlyUnlocked;
};

const getAllDefinitions = () => ACHIEVEMENT_DEFINITIONS;

module.exports = { checkAndUnlock, getAllDefinitions };
