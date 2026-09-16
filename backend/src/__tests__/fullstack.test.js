const request = require('supertest');
const app = require('../app');
const pool = require('../db/pool');
const db = pool._db;

describe('Life RPG Full-Stack Backend Architecture Verification', () => {
  let userToken = '';
  let userId = null;
  const testEmail = 'agent_' + Date.now() + '@cybermetropolis.io';
  const testPassword = 'Password123!';
  const testUsername = 'operative_' + Date.now();

  afterAll(() => {
    if (userId) {
      try {
        db.prepare('DELETE FROM users WHERE id = ?').run(userId);
      } catch (e) {}
    }
  });

  describe('1. Health & Server Connectivity', () => {
    it('returns 200 OK on /health', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });

  describe('2. User Authentication & Cross-Device JWT', () => {
    it('registers a new operative with hashed credentials and initialized stats', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          username: testUsername,
          email: testEmail,
          password: testPassword,
        });

      expect(res.status).toBe(201);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.username).toBe(testUsername);
      expect(res.body.user.level).toBe(1);
      expect(res.body.user.xp).toBe(0);
      expect(res.body.user.gold).toBe(0);

      userToken = res.body.token;
      userId = res.body.user.id;

      const stats = db.prepare('SELECT * FROM character_stats WHERE user_id = ?').get(userId);
      expect(stats).toBeDefined();
      expect(stats.intellect).toBe(0);

      const streak = db.prepare('SELECT * FROM user_streaks WHERE user_id = ?').get(userId);
      expect(streak).toBeDefined();
    });

    it('authenticates user across devices via /api/auth/login and /api/auth/me', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: testPassword,
        });

      expect(loginRes.status).toBe(200);
      expect(loginRes.body.token).toBeDefined();

      const meRes = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer ' + loginRes.body.token);

      expect(meRes.status).toBe(200);
      expect(meRes.body.user.id).toBe(userId);
      expect(meRes.body.user.email).toBe(testEmail);
    });

    it('rejects unauthorized access without valid JWT', async () => {
      const res = await request(app).get('/api/quests');
      expect(res.status).toBe(401);
    });
  });

  describe('3. Anti-Cheat Server-Side Reward Validation', () => {
    let questId = null;

    it('creates a task directive where XP/gold rewards are calculated server-side', async () => {
      const res = await request(app)
        .post('/api/quests')
        .set('Authorization', 'Bearer ' + userToken)
        .send({
          title: 'Master Cyberpunk Architecture',
          description: 'Build robust database pipelines',
          category: 'Coding / Study',
          difficulty: 'hard',
          xp_reward: 999999,
          gold_reward: 999999,
        });

      expect(res.status).toBe(201);
      expect(res.body.quest).toBeDefined();
      expect(res.body.quest.xp_reward).toBe(200);
      expect(res.body.quest.gold_reward).toBe(50);
      questId = res.body.quest.id;
    });

    it('completes the quest inside a transaction and records immutable activity_logs', async () => {
      const completeRes = await request(app)
        .post('/api/quests/' + questId + '/complete')
        .set('Authorization', 'Bearer ' + userToken);

      expect(completeRes.status).toBe(200);
      expect(completeRes.body.xp_earned).toBe(200);
      expect(completeRes.body.gold_earned).toBe(50);
      expect(completeRes.body.attribute_gain).toEqual({ intellect: 3 });
      expect(completeRes.body.total_xp).toBe(200);
      expect(completeRes.body.total_gold).toBe(50);
      expect(completeRes.body.level_up).toBe(true);
      expect(completeRes.body.new_level).toBe(2);

      const log = db.prepare('SELECT * FROM activity_logs WHERE task_id = ?').get(questId);
      expect(log).toBeDefined();
      expect(log.user_id).toBe(userId);
      expect(log.xp_earned).toBe(200);
      expect(log.gold_earned).toBe(50);

      const stats = db.prepare('SELECT intellect FROM character_stats WHERE user_id = ?').get(userId);
      expect(stats.intellect).toBe(3);
    });

    it('prevents double-completion exploit (anti-cheat idempotent constraint)', async () => {
      const res = await request(app)
        .post('/api/quests/' + questId + '/complete')
        .set('Authorization', 'Bearer ' + userToken);

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/already been completed/i);
    });
  });

  describe('4. Historical Logs & Evolution Telemetry', () => {
    it('retrieves detailed historical activity telemetry via /api/progress/history', async () => {
      const res = await request(app)
        .get('/api/progress/history?limit=10')
        .set('Authorization', 'Bearer ' + userToken);

      expect(res.status).toBe(200);
      expect(res.body.history.length).toBeGreaterThanOrEqual(1);
      expect(res.body.history[0].task_title).toBe('Master Cyberpunk Architecture');
      expect(res.body.history[0].category).toBe('Coding / Study');
    });

    it('retrieves accurate streak telemetry via /api/progress/streak', async () => {
      const res = await request(app)
        .get('/api/progress/streak')
        .set('Authorization', 'Bearer ' + userToken);

      expect(res.status).toBe(200);
      expect(res.body.streak.current_streak).toBe(1);
    });
  });

  describe('5. Inventory & Bazaar Transaction Integrity', () => {
    it('prevents purchasing items when insufficient gold is held', async () => {
      const expensiveItem = db.prepare('SELECT id, cost FROM items WHERE cost > 50 LIMIT 1').get();
      if (expensiveItem) {
        const res = await request(app)
          .post('/api/shop/items/' + expensiveItem.id + '/buy')
          .set('Authorization', 'Bearer ' + userToken);

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/insufficient/i);
      }
    });

    it('allows purchasing within budget, atomically deducting gold and persisting to inventory', async () => {
      const affordableItem = db.prepare('SELECT id, cost, name FROM items WHERE cost <= 50 LIMIT 1').get();
      expect(affordableItem).toBeDefined();

      const buyRes = await request(app)
        .post('/api/shop/items/' + affordableItem.id + '/buy')
        .set('Authorization', 'Bearer ' + userToken);

      expect(buyRes.status).toBe(200);
      expect(buyRes.body.inventory_entry).toBeDefined();
      expect(buyRes.body.remaining_gold).toBe(50 - affordableItem.cost);

      const invRow = db.prepare('SELECT * FROM inventory WHERE user_id = ? AND item_id = ?').get(userId, affordableItem.id);
      expect(invRow).toBeDefined();

      const invRes = await request(app)
        .get('/api/inventory')
        .set('Authorization', 'Bearer ' + userToken);

      expect(invRes.status).toBe(200);
      expect(invRes.body.inventory.some((i) => i.item_id === affordableItem.id)).toBe(true);
    });
  });
});
