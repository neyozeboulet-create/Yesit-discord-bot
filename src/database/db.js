const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../../data.sqlite');
if (!fs.existsSync(path.dirname(dbPath))) fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Users - extended
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT,
    guild_id TEXT,
    coins INTEGER DEFAULT 100,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    daily_last INTEGER DEFAULT 0,
    warnings INTEGER DEFAULT 0,
    rep INTEGER DEFAULT 0,
    rep_last INTEGER DEFAULT 0,
    afk_reason TEXT,
    afk_since INTEGER,
    PRIMARY KEY (id, guild_id)
  )`);

  // Guild config - comprehensive
  db.run(`CREATE TABLE IF NOT EXISTS guild_config (
    guild_id TEXT PRIMARY KEY,
    welcome_channel TEXT,
    welcome_message TEXT DEFAULT 'Bienvenue {user} sur {server} !',
    welcome_embed INTEGER DEFAULT 1,
    goodbye_channel TEXT,
    goodbye_message TEXT DEFAULT '{user} a quitté le serveur.',
    log_channel TEXT,
    modlog_channel TEXT,
    ticket_category TEXT,
    ticket_support_role TEXT,
    autorole TEXT,
    auto_mod INTEGER DEFAULT 1,
    xp_enabled INTEGER DEFAULT 1,
    level_channel TEXT,
    level_message TEXT DEFAULT 'GG {user} niveau {level} !',
    automod_words TEXT DEFAULT '[]',
    automod_links INTEGER DEFAULT 1,
    automod_invites INTEGER DEFAULT 1,
    automod_caps INTEGER DEFAULT 1,
    automod_spam INTEGER DEFAULT 1,
    automod_mentions INTEGER DEFAULT 0,
    starboard_channel TEXT,
    starboard_emoji TEXT DEFAULT '⭐',
    starboard_threshold INTEGER DEFAULT 3,
    suggestion_channel TEXT,
    giveaway_role TEXT,
    antinuke INTEGER DEFAULT 0,
    raidmode INTEGER DEFAULT 0,
    verification_role TEXT,
    prefix TEXT DEFAULT '/'
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guild_id TEXT,
    user_id TEXT,
    channel_id TEXT,
    status TEXT DEFAULT 'open',
    created_at INTEGER
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS shop (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guild_id TEXT,
    name TEXT,
    price INTEGER,
    role_id TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guild_id TEXT,
    type TEXT,
    user_id TEXT,
    target_id TEXT,
    moderator_id TEXT,
    channel_id TEXT,
    content TEXT,
    reason TEXT,
    timestamp INTEGER,
    extra TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS warns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guild_id TEXT,
    user_id TEXT,
    moderator_id TEXT,
    reason TEXT,
    timestamp INTEGER
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS giveaways (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guild_id TEXT,
    channel_id TEXT,
    message_id TEXT,
    prize TEXT,
    winners INTEGER DEFAULT 1,
    ends_at INTEGER,
    created_by TEXT,
    ended INTEGER DEFAULT 0
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS reminders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    guild_id TEXT,
    content TEXT,
    remind_at INTEGER,
    created_at INTEGER
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS afk (
    user_id TEXT,
    guild_id TEXT,
    reason TEXT,
    since INTEGER,
    PRIMARY KEY (user_id, guild_id)
  )`);

  // Migrations for old schema
  db.all(`PRAGMA table_info(guild_config)`, (e, cols) => {
    if (!cols) return;
    const names = cols.map(c => c.name);
    const add = (col, def) => { if (!names.includes(col)) db.run(`ALTER TABLE guild_config ADD COLUMN ${col} ${def}`); };
    add('welcome_message', `TEXT DEFAULT 'Bienvenue {user} sur {server} !'`);
    add('welcome_embed', `INTEGER DEFAULT 1`);
    add('goodbye_channel', `TEXT`);
    add('goodbye_message', `TEXT DEFAULT '{user} a quitté le serveur.'`);
    add('modlog_channel', `TEXT`);
    add('ticket_support_role', `TEXT`);
    add('autorole', `TEXT`);
    add('level_channel', `TEXT`);
    add('level_message', `TEXT DEFAULT 'GG {user} niveau {level} !'`);
    add('automod_words', `TEXT DEFAULT '[]'`);
    add('automod_links', `INTEGER DEFAULT 1`);
    add('automod_invites', `INTEGER DEFAULT 1`);
    add('automod_caps', `INTEGER DEFAULT 1`);
    add('automod_spam', `INTEGER DEFAULT 1`);
    add('automod_mentions', `INTEGER DEFAULT 0`);
    add('starboard_channel', `TEXT`);
    add('suggestion_channel', `TEXT`);
    add('antinuke', `INTEGER DEFAULT 0`);
    add('raidmode', `INTEGER DEFAULT 0`);
  });

  db.all(`PRAGMA table_info(users)`, (e, cols) => {
    if (!cols) return;
    const names = cols.map(c => c.name);
    const add = (col, def) => { if (!names.includes(col)) db.run(`ALTER TABLE users ADD COLUMN ${col} ${def}`); };
    add('rep', `INTEGER DEFAULT 0`);
    add('rep_last', `INTEGER DEFAULT 0`);
    add('afk_reason', `TEXT`);
    add('afk_since', `INTEGER`);
  });
});

function getUser(userId, guildId) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM users WHERE id=? AND guild_id=?`, [userId, guildId], (err, row) => {
      if (err) return reject(err);
      if (row) return resolve(row);
      db.run(`INSERT INTO users (id, guild_id) VALUES (?,?)`, [userId, guildId], (e) => {
        if (e) return reject(e);
        db.get(`SELECT * FROM users WHERE id=? AND guild_id=?`, [userId, guildId], (err2, r2) => err2 ? reject(err2) : resolve(r2));
      });
    });
  });
}
function updateUser(userId, guildId, fields) {
  const keys = Object.keys(fields);
  if (!keys.length) return Promise.resolve();
  const set = keys.map(k => `${k}=?`).join(', ');
  const vals = keys.map(k => fields[k]);
  return new Promise((res, rej) => {
    db.run(`UPDATE users SET ${set} WHERE id=? AND guild_id=?`, [...vals, userId, guildId], (err) => err ? rej(err) : res());
  });
}
function getGuildConfig(guildId) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM guild_config WHERE guild_id=?`, [guildId], (err, row) => {
      if (err) return reject(err);
      if (row) return resolve(row);
      db.run(`INSERT INTO guild_config (guild_id) VALUES (?)`, [guildId], (e) => {
        if (e) return reject(e);
        db.get(`SELECT * FROM guild_config WHERE guild_id=?`, [guildId], (err2, r2) => err2 ? reject(err2) : resolve(r2));
      });
    });
  });
}
function updateGuildConfig(guildId, fields) {
  const keys = Object.keys(fields);
  if (!keys.length) return Promise.resolve();
  const set = keys.map(k => `${k}=?`).join(', ');
  const vals = keys.map(k => fields[k]);
  return new Promise((res, rej) => {
    db.run(`UPDATE guild_config SET ${set} WHERE guild_id=?`, [...vals, guildId], (err) => err ? rej(err) : res());
  });
}
function addLog(entry) {
  return new Promise((res, rej) => {
    const { guild_id, type, user_id, target_id, moderator_id, channel_id, content, reason, extra } = entry;
    db.run(`INSERT INTO logs (guild_id, type, user_id, target_id, moderator_id, channel_id, content, reason, timestamp, extra) VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [guild_id, type, user_id||null, target_id||null, moderator_id||null, channel_id||null, content||null, reason||null, Date.now(), extra ? JSON.stringify(extra) : null],
      (err) => err ? rej(err) : res());
  });
}
function getLogs(guildId, { type, user, limit=50, offset=0, from, to } = {}) {
  return new Promise((resolve, reject) => {
    let sql = `SELECT * FROM logs WHERE guild_id=?`;
    const params = [guildId];
    if (type) { sql += ` AND type=?`; params.push(type); }
    if (user) { sql += ` AND (user_id=? OR target_id=? OR moderator_id=?)`; params.push(user, user, user); }
    if (from) { sql += ` AND timestamp>=?`; params.push(from); }
    if (to) { sql += ` AND timestamp<=?`; params.push(to); }
    sql += ` ORDER BY timestamp DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);
    db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows || []));
  });
}

module.exports = { db, getUser, updateUser, getGuildConfig, updateGuildConfig, addLog, getLogs };
