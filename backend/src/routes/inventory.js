const express = require('express');
const pool = require('../db/pool');
const db = pool._db;
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/inventory
router.get('/', auth, (req, res) => {
  try {
    const inventory = db.prepare(
      `SELECT inv.id, inv.equipped, inv.acquired_at,
              i.id as item_id, i.name, i.type, i.cost, i.description
       FROM inventory inv
       JOIN items i ON inv.item_id = i.id
       WHERE inv.user_id = ?
       ORDER BY inv.acquired_at DESC`
    ).all(req.userId);

    const mapped = inventory.map(item => ({
      ...item,
      equipped: Boolean(item.equipped)
    }));

    res.json({ inventory: mapped });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch inventory.' });
  }
});

// POST /api/inventory/:id/equip
router.post('/:id/equip', auth, (req, res) => {
  try {
    const invItem = db.prepare(
      `SELECT inv.*, i.type FROM inventory inv JOIN items i ON inv.item_id = i.id WHERE inv.id = ? AND inv.user_id = ?`
    ).get(req.params.id, req.userId);

    if (!invItem) {
      return res.status(404).json({ error: 'Inventory item not found.' });
    }

    const newEquipped = invItem.equipped ? 0 : 1;

    if (newEquipped === 1) {
      db.prepare(
        `UPDATE inventory SET equipped = 0
         WHERE user_id = ? AND id != ?
         AND item_id IN (SELECT id FROM items WHERE type = ?)`
      ).run(req.userId, req.params.id, invItem.type);
    }

    db.prepare('UPDATE inventory SET equipped = ? WHERE id = ? AND user_id = ?').run(newEquipped, req.params.id, req.userId);
    const updated = db.prepare('SELECT * FROM inventory WHERE id = ?').get(req.params.id);

    res.json({ inventory_item: updated, equipped: Boolean(newEquipped) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update equip status.' });
  }
});

module.exports = router;
