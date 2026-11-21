// The public list of approved recommendations.
// It is kept as one JSON value in Redis, rebuilt whenever an entry is approved, so a
// page view costs one read. Only fields meant for the public are copied into it:
// never the email, the IP hash or the tokens.

const config = require('./config');
const redis = require('./redis');
const { relationshipLine } = require('./ownerMail');

const KEY = config.PREFIX + 'public';
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

// Reads every published entry and stores the public copy. Uses the full-access token.
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
  await redis.command('SET', KEY, JSON.stringify(list));
  return list;
}

// Reads the stored list with the read-only token. Throws if Redis cannot be reached.
async function loadPublic() {
  const token = process.env.KV_REST_API_READ_ONLY_TOKEN || process.env.KV_REST_API_TOKEN;
  const result = await redis.pipeline([['GET', KEY]], token);
  if (!result[0]) return [];
  return JSON.parse(result[0]);
}

module.exports = { rebuildPublic, loadPublic, toPublic };
