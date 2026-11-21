// The public list of approved recommendations.
// It is kept as one JSON value in Redis, rebuilt whenever an entry is approved, so a
// page view costs one read. Only fields meant for the public are copied into it:
// never the email, the IP hash or the tokens.

const config = require('./config');
const redis = require('./redis');
const { relationshipLine } = require('./ownerMail');

const KEY = config.PREFIX + 'public';
const FEATURED_KEY = config.PREFIX + 'featured';
const MAX_FEATURED = 3;
const MAX_ENTRIES = 200;

function toPublic(entry) {
  const links = [];
  if (entry.showLinks === '1') {
    if (entry.linkedin) links.push({ label: 'LinkedIn', url: entry.linkedin });
    if (entry.facebook) links.push({ label: 'Facebook', url: entry.facebook });
  }
  return {
    id: entry.id,
    name: entry.name,
    role: entry.role || '',
    organization: entry.organization || '',
    line: relationshipLine(entry),
    message: entry.message,
    publishedAt: entry.publishedAt || entry.decidedAt || '',
    links: links
  };
}

// The owner's top picks, as an ordered list of entry ids.
async function getFeatured() {
  try {
    const parsed = JSON.parse((await redis.command('GET', FEATURED_KEY)) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

async function setFeatured(ids) {
  await redis.command('SET', FEATURED_KEY, JSON.stringify(ids));
}

// Reads every published entry and stores the public copy: { entries, featured }.
// Uses the full-access token. Featured ids that are no longer published are dropped.
async function rebuildPublic() {
  const ids = await redis.command('ZREVRANGE', config.PREFIX + 'published', '0', String(MAX_ENTRIES - 1));
  let list = [];
  if (ids && ids.length) {
    const flat = await redis.pipeline(ids.map(function (id) { return ['HGETALL', config.PREFIX + 'entry:' + id]; }));
    list = flat
      .map(function (fields) { return redis.toObject(fields); })
      .filter(function (entry) { return entry.id && entry.state === 'published'; })
      .map(toPublic);
  }
  const featured = (await getFeatured())
    .filter(function (id) { return list.some(function (e) { return e.id === id; }); })
    .slice(0, MAX_FEATURED);
  const data = { entries: list, featured: featured };
  await redis.command('SET', KEY, JSON.stringify(data));
  return data;
}

// Reads the stored copy with the read-only token. Throws if Redis cannot be reached.
// Understands the older format (a plain list) too.
async function loadPublic() {
  const token = process.env.KV_REST_API_READ_ONLY_TOKEN || process.env.KV_REST_API_TOKEN;
  const result = await redis.pipeline([['GET', KEY]], token);
  if (!result[0]) return { entries: [], featured: [] };
  const parsed = JSON.parse(result[0]);
  if (Array.isArray(parsed)) return { entries: parsed, featured: [] };
  return { entries: parsed.entries || [], featured: parsed.featured || [] };
}

// What the homepage shows: the owner's picks in their order, or, when nothing is picked,
// the newest published entries.
function homeSelection(data) {
  const picked = (data.featured || [])
    .map(function (id) { return data.entries.filter(function (e) { return e.id === id; })[0]; })
    .filter(Boolean);
  return picked.length ? picked.slice(0, MAX_FEATURED) : data.entries.slice(0, MAX_FEATURED);
}

module.exports = { rebuildPublic, loadPublic, toPublic, getFeatured, setFeatured, homeSelection, MAX_FEATURED };
