// Every change to an entry's state goes through here, so the decision page and the
// admin page behave the same. Each change also refreshes the public list.
//
// States: unconfirmed -> awaiting -> published <-> hidden, or awaiting -> rejected.

const config = require('./config');
const redis = require('./redis');
const { rebuildPublic } = require('./publicList');

const P = config.PREFIX;
const SETS = {
  awaiting: P + 'awaiting',
  published: P + 'published',
  hidden: P + 'hidden',
  rejected: P + 'rejected'
};

function entryKey(id) { return P + 'entry:' + id; }

function validId(id) { return /^[A-Za-z0-9_-]{6,24}$/.test(String(id || '')); }

async function get(id) {
  if (!validId(id)) return {};
  return redis.hgetall(entryKey(id));
}

// A failed refresh is logged. The change itself is already saved.
async function refresh() {
  try { await rebuildPublic(); } catch (e) { console.error('public list rebuild failed:', e && e.message); }
}

async function approve(id) {
  const e = await get(id);
  if (!e.id || (e.state !== 'awaiting' && e.state !== 'rejected')) return false;
  const now = new Date();
  await redis.pipeline([
    ['HSET', entryKey(id), 'state', 'published', 'decidedAt', now.toISOString(), 'decision', 'approved', 'publishedAt', now.toISOString()],
    ['ZREM', SETS.awaiting, id],
    ['ZREM', SETS.rejected, id],
    ['ZADD', SETS.published, String(now.getTime()), id]
  ]);
  await refresh();
  return true;
}

async function reject(id) {
  const e = await get(id);
  if (!e.id || e.state !== 'awaiting') return false;
  const now = new Date();
  await redis.pipeline([
    ['HSET', entryKey(id), 'state', 'rejected', 'decidedAt', now.toISOString(), 'decision', 'rejected'],
    ['ZREM', SETS.awaiting, id],
    ['ZADD', SETS.rejected, String(now.getTime()), id]
  ]);
  return true;
}

async function hide(id) {
  const e = await get(id);
  if (!e.id || e.state !== 'published') return false;
  const now = new Date();
  await redis.pipeline([
    ['HSET', entryKey(id), 'state', 'hidden', 'hiddenAt', now.toISOString()],
    ['ZREM', SETS.published, id],
    ['ZADD', SETS.hidden, String(now.getTime()), id]
  ]);
  await refresh();
  return true;
}

async function unhide(id) {
  const e = await get(id);
  if (!e.id || e.state !== 'hidden') return false;
  // Keep the original publish date so the order on the page does not change.
  const score = Date.parse(e.publishedAt) || Date.now();
  await redis.pipeline([
    ['HSET', entryKey(id), 'state', 'published'],
    ['HDEL', entryKey(id), 'hiddenAt'],
    ['ZREM', SETS.hidden, id],
    ['ZADD', SETS.published, String(score), id]
  ]);
  await refresh();
  return true;
}

// Permanent. Removes the entry, its links and every list entry.
async function remove(id) {
  const e = await get(id);
  if (!e.id) return false;
  const commands = [['DEL', entryKey(id)]];
  Object.keys(SETS).forEach(function (name) { commands.push(['ZREM', SETS[name], id]); });
  if (e.confirmHash) commands.push(['DEL', P + 'confirm:' + e.confirmHash]);
  if (e.statusHash) commands.push(['DEL', P + 'status:' + e.statusHash]);
  if (e.decideHash) commands.push(['DEL', P + 'decide:' + e.decideHash]);
  await redis.pipeline(commands);
  await refresh();
  return true;
}

// Newest first, up to a limit, with the full entries.
async function list(setName, limit) {
  const ids = await redis.command('ZREVRANGE', SETS[setName], '0', String((limit || 100) - 1));
  if (!ids || !ids.length) return [];
  const rows = await redis.pipeline(ids.map(function (id) { return ['HGETALL', entryKey(id)]; }));
  return rows.map(redis.toObject).filter(function (e) { return e.id; });
}

module.exports = { SETS, validId, get, approve, reject, hide, unhide, remove, list };
