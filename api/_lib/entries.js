// Every change to an entry's state goes through here, so the decision page and the
// admin page behave the same. Each change also refreshes the public list.
//
// States: unconfirmed -> awaiting -> published <-> hidden, or awaiting -> rejected.

const config = require('./config');
const redis = require('./redis');
const { rebuildPublic, getFeatured, setFeatured, MAX_FEATURED } = require('./publicList');

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

async function dropFeatured(id) {
  const f = await getFeatured();
  if (f.indexOf(id) !== -1) await setFeatured(f.filter(function (x) { return x !== id; }));
}

async function hide(id) {
  const e = await get(id);
  if (!e.id || e.state !== 'published') return false;
  await dropFeatured(id);
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
  await dropFeatured(id);
  const commands = [['DEL', entryKey(id)]];
  Object.keys(SETS).forEach(function (name) { commands.push(['ZREM', SETS[name], id]); });
  if (e.confirmHash) commands.push(['DEL', P + 'confirm:' + e.confirmHash]);
  if (e.decideHash) commands.push(['DEL', P + 'decide:' + e.decideHash]);
  if (e.reminderDecideHash) commands.push(['DEL', P + 'decide:' + e.reminderDecideHash]);
  await redis.pipeline(commands);
  await refresh();
  return true;
}

// Top picks for the homepage (at most three, only published entries).
// Returns 'ok', 'full' (three already chosen) or 'invalid'.
async function feature(id) {
  const e = await get(id);
  if (!e.id || e.state !== 'published') return 'invalid';
  const f = await getFeatured();
  if (f.indexOf(id) !== -1) return 'ok';
  if (f.length >= MAX_FEATURED) return 'full';
  f.push(id);
  await setFeatured(f);
  await refresh();
  return 'ok';
}

async function unfeature(id) {
  await dropFeatured(id);
  await refresh();
  return true;
}

async function moveFeatured(id, direction) {
  const f = await getFeatured();
  const i = f.indexOf(id);
  const j = direction === 'up' ? i - 1 : i + 1;
  if (i === -1 || j < 0 || j >= f.length) return false;
  const tmp = f[i]; f[i] = f[j]; f[j] = tmp;
  await setFeatured(f);
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

module.exports = { SETS, validId, get, approve, reject, hide, unhide, remove, list, feature, unfeature, moveFeatured };
