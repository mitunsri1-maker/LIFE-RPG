/**
 * Level XP curve: Level N requires floor(100 * 1.5^(N-1)) XP
 */
const pool = require('../db/pool');
const db = pool._db;

const xpForLevel = (level) => {
  if (level <= 1) return 0;
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

const getLevelFromXp = (totalXp) => {
  let level = 1;
  let accumulatedXp = 0;
  while (true) {
    const xpNeeded = xpForLevel(level + 1);
    if (accumulatedXp + xpNeeded > totalXp) break;
    accumulatedXp += xpNeeded;
    level++;
    if (level >= 100) break;
  }
  return level;
};

const getXpProgress = (totalXp, currentLevel) => {
  let accumulated = 0;
  for (let i = 1; i < currentLevel; i++) {
    accumulated += xpForLevel(i + 1);
  }
  const xpInCurrentLevel = totalXp - accumulated;
  const xpForNextLevel = xpForLevel(currentLevel + 1);
  return { xpInCurrentLevel, xpForNextLevel };
};

const checkLevelUp = (userId) => {
  const row = db.prepare('SELECT xp, level FROM users WHERE id = ?').get(userId);
  if (!row) return { leveled_up: false, new_level: 1, old_level: 1 };
  const { xp, level: oldLevel } = row;
  const newLevel = getLevelFromXp(xp);

  if (newLevel > oldLevel) {
    db.prepare('UPDATE users SET level = ? WHERE id = ?').run(newLevel, userId);
    return { leveled_up: true, new_level: newLevel, old_level: oldLevel };
  }
  return { leveled_up: false, new_level: oldLevel, old_level: oldLevel };
};

module.exports = { xpForLevel, getLevelFromXp, getXpProgress, checkLevelUp };
