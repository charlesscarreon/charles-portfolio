// The weekly digest: one email listing every recommendation still awaiting the owner's
// decision, including ones that were reminded or are under a day old. Each entry gets a
// fresh decision link (the older links keep working). Nothing is sent when none is waiting.

const config = require('./config');
const redis = require('./redis');
const tokens = require('./tokens');
const { sendMail } = require('./mail');
const { buildDigestEmail } = require('./ownerMail');

const P = config.PREFIX;
const MAX_SCANNED = 60;

async function run() {
  const owner = process.env.OWNER_EMAIL;
  if (!owner) throw new Error('OWNER_EMAIL is not set');

  // [id, score, id, score, ...] oldest first; the score is the time the writer confirmed.
  const flat = (await redis.command('ZRANGE', P + 'awaiting', '0', '-1', 'WITHSCORES')) || [];
  const waiting = [];
  for (let i = 0; i + 1 < flat.length; i += 2) waiting.push({ id: flat[i], since: Number(flat[i + 1]) });

  const rows = [];
  const writes = [];
  let scanned = 0;
  while (scanned < waiting.length && scanned < MAX_SCANNED && rows.length < config.MAX_DIGEST_ENTRIES) {
    const item = waiting[scanned];
    scanned += 1;
    const entry = await redis.hgetall(P + 'entry:' + item.id);
    if (!entry.id || entry.state !== 'awaiting') continue;
    const token = tokens.newToken();
    writes.push(['SET', P + 'decide:' + tokens.hashToken(token), item.id, 'EX', String(config.DECISION_LINK_TTL_SECONDS)]);
    rows.push({ entry: entry, token: token, waitedMs: Date.now() - item.since });
  }
  const result = { awaiting: rows.length + (waiting.length - scanned), listed: rows.length, sent: 0, failed: 0 };
  if (!rows.length) { result.awaiting = 0; return result; }

  const counts = await redis.pipeline([['ZCARD', P + 'published'], ['ZCARD', P + 'hidden']]);
  const mail = buildDigestEmail(rows, { awaiting: result.awaiting, published: counts[0] || 0, hidden: counts[1] || 0 });
  try {
    // The links are saved first, so they work as soon as the email arrives.
    await redis.pipeline(writes);
    await sendMail({ to: owner, subject: mail.subject, text: mail.text, html: mail.html });
    result.sent = 1;
  } catch (error) {
    console.error('digest failed:', error && error.message);
    result.failed = 1;
  }
  return result;
}

module.exports = { run };
