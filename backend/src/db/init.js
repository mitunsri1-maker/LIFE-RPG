require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('./pool');
const db = pool._db;

try {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  const seed = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');

  console.log('Running schema...');
  db.exec(schema);
  console.log('Schema applied.');

  console.log('Running seed...');
  db.exec(seed);
  console.log('Seed applied.');

  console.log('Database initialized!');
  process.exit(0);
} catch (err) {
  console.error('DB init error:', err);
  process.exit(1);
}
