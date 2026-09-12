const express = require('express');
const pool = require('../db/pool');
const db = pool._db;
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/shop/items
router.get('/items', auth, (req, res) => {
  try {
    const items = db.prepare('SELECT * FROM items ORDER BY type, cost').all();
    const ownedRows = db.prepare('SELECT item_id FROM inventory WHERE user_id = ?').all(req.userId);
    const ownedSet = new Set(ownedRows.map((r) => r.item_id));

    const mapped = items.map((item) => ({ ...item, owned: ownedSet.has(item.id) }));
    res.json({ items: mapped });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch shop items.' });
  }
});

// POST /api/shop/items/:id/buy
router.post('/items/:id/buy', auth, (req, res) => {
  try {
    const buyTx = db.transaction(() => {
      const item = db.prepare('SELECT * FROM items WHERE id = ?').get(req.params.id);
      if (!item) throw { status: 404, message: 'Item not found.' };

      const owned = db.prepare('SELECT id FROM inventory WHERE user_id = ? AND item_id = ?').get(req.userId, item.id);
      if (owned) throw { status: 400, message: 'You already own this item.' };

      const user = db.prepare('SELECT gold FROM users WHERE id = ?').get(req.userId);
      if (user.gold < item.cost) {
        throw { status: 400, message: `Insufficient gold. Need ${item.cost}, have ${user.gold}.` };
      }

      db.prepare('UPDATE users SET gold = gold - ? WHERE id = ?').run(item.cost, req.userId);
      const invInfo = db.prepare('INSERT INTO inventory (user_id, item_id) VALUES (?, ?)').run(req.userId, item.id);
      const invEntry = db.prepare('SELECT * FROM inventory WHERE id = ?').get(invInfo.lastInsertRowid);
      const updatedUser = db.prepare('SELECT gold FROM users WHERE id = ?').get(req.userId);

      return { item, invEntry, remaining_gold: updatedUser.gold };
    });

    const result = buyTx();
    res.json({
      message: `Successfully purchased ${result.item.name}!`,
      inventory_entry: result.invEntry,
      remaining_gold: result.remaining_gold,
    });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    console.error('Buy item error:', err);
    res.status(500).json({ error: 'Failed to purchase item.' });
  }
});

module.exports = router;
