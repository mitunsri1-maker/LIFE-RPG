const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '..', '..', 'data', 'life_rpg.db');

// Ensure data directory exists
const fs = require('fs');
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Auto-initialize schema and seeds if not already present
try {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const seedPath = path.join(__dirname, 'seed.sql');
  if (fs.existsSync(schemaPath)) {
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schemaSql);
  }
  if (fs.existsSync(seedPath)) {
    const seedSql = fs.readFileSync(seedPath, 'utf8');
    db.exec(seedSql);
  }
  console.log('[Life RPG] Database schema and seeds ready.');
} catch (initErr) {
  console.error('[Life RPG] Database auto-init error:', initErr.message);
}

// Wrap in a pg-compatible interface so routes don't need to change much
const pool = {
  query: (text, params = []) => {
    // Convert $1, $2 style params to ? style
    let convertedText = text;
    let paramIndex = 0;
    convertedText = convertedText.replace(/\$(\d+)/g, () => '?');

    // Remove PostgreSQL-specific syntax
    convertedText = convertedText.replace(/::[\w]+/g, ''); // remove type casts
    convertedText = convertedText.replace(/TIMESTAMPTZ/g, 'TEXT');
    convertedText = convertedText.replace(/SERIAL PRIMARY KEY/g, 'INTEGER PRIMARY KEY AUTOINCREMENT');
    convertedText = convertedText.replace(/JSONB/g, 'TEXT');
    convertedText = convertedText.replace(/NOW\(\)/g, "datetime('now')");
    convertedText = convertedText.replace(/INTERVAL '(\d+) days'/g, "'$1 days'");

    const trimmed = convertedText.trim();

    if (trimmed.toUpperCase().startsWith('SELECT') || trimmed.toUpperCase().startsWith('WITH')) {
      const stmt = db.prepare(convertedText);
      const rows = stmt.all(...params);
      return { rows };
    } else if (trimmed.toUpperCase().startsWith('INSERT') && trimmed.toUpperCase().includes('RETURNING')) {
      // Handle RETURNING clause
      const parts = convertedText.split(/\bRETURNING\b/i);
      const insertSql = parts[0].trim();
      const returningCols = parts[1] ? parts[1].trim() : '*';

      const stmt = db.prepare(insertSql);
      const info = stmt.run(...params);

      // Get the inserted row
      const tableName = insertSql.match(/INSERT INTO\s+(\w+)/i)?.[1];
      if (tableName && info.lastInsertRowid) {
        const selectStmt = db.prepare(`SELECT ${returningCols === '*' ? '*' : returningCols} FROM ${tableName} WHERE rowid = ?`);
        const row = selectStmt.get(info.lastInsertRowid);
        return { rows: row ? [row] : [] };
      }
      return { rows: [], rowCount: info.changes };
    } else if (trimmed.toUpperCase().startsWith('UPDATE') && trimmed.toUpperCase().includes('RETURNING')) {
      const parts = convertedText.split(/\bRETURNING\b/i);
      const updateSql = parts[0].trim();
      const returningCols = parts[1] ? parts[1].trim() : '*';

      const stmt = db.prepare(updateSql);
      const info = stmt.run(...params);

      // Re-query to get updated rows - extract table and WHERE clause
      const tableName = updateSql.match(/UPDATE\s+(\w+)/i)?.[1];
      const whereMatch = updateSql.match(/WHERE\s+(.+)$/i);
      if (tableName && whereMatch) {
        // Find which params belong to WHERE clause
        const setClauses = updateSql.substring(0, updateSql.search(/WHERE/i));
        const setParamCount = (setClauses.match(/\?/g) || []).length;
        const whereParams = params.slice(setParamCount);

        const selectStmt = db.prepare(`SELECT ${returningCols === '*' ? '*' : returningCols} FROM ${tableName} WHERE ${whereMatch[1]}`);
        const rows = selectStmt.all(...whereParams);
        return { rows };
      }
      return { rows: [], rowCount: info.changes };
    } else if (trimmed.toUpperCase().startsWith('DELETE') && trimmed.toUpperCase().includes('RETURNING')) {
      // For DELETE with RETURNING, first SELECT then DELETE
      const parts = convertedText.split(/\bRETURNING\b/i);
      const deleteSql = parts[0].trim();
      const returningCols = parts[1] ? parts[1].trim() : '*';

      const tableName = deleteSql.match(/DELETE FROM\s+(\w+)/i)?.[1];
      const whereMatch = deleteSql.match(/WHERE\s+(.+)$/i);
      let rows = [];
      if (tableName && whereMatch) {
        const selectStmt = db.prepare(`SELECT ${returningCols === '*' ? '*' : returningCols} FROM ${tableName} WHERE ${whereMatch[1]}`);
        rows = selectStmt.all(...params);
      }

      const stmt = db.prepare(deleteSql);
      stmt.run(...params);
      return { rows };
    } else {
      try {
        const stmt = db.prepare(convertedText);
        const info = stmt.run(...params);
        return { rows: [], rowCount: info.changes };
      } catch (err) {
        // For multi-statement SQL (like schema), execute directly
        if (err.message.includes('more than one')) {
          db.exec(convertedText);
          return { rows: [] };
        }
        throw err;
      }
    }
  },

  connect: () => {
    // Return a client-like object for transactions
    return Promise.resolve({
      query: (text, params) => pool.query(text, params),
      release: () => {},
    });
  },
};

module.exports = pool;
module.exports._db = db; // expose raw db for transactions
