// /api/confirm
// GET  ?token=...  shows a page with a confirm button (opening the link changes nothing,
//                  so email scanners that pre-open links cannot confirm by accident).
// POST token=...   marks the entry as "awaiting" (writer confirmed they wrote it).
// Safe to repeat: confirming twice just shows the same result.

const config = require('./_lib/config');
const redis = require('./_lib/redis');
const tokens = require('./_lib/tokens');
const { esc, respond } = require('./_lib/html');

const KEEP_CONFIRM_LINK_SECONDS = 30 * 24 * 60 * 60;

function readToken(req) {
  const body = req.body;
  if (req.method === 'POST') {
    if (body && typeof body === 'object' && !Buffer.isBuffer(body)) return String(body.token || '');
    if (typeof body === 'string') return new URLSearchParams(body).get('token') || '';
    return '';
  }
  const q = req.query && req.query.token;
  return String(Array.isArray(q) ? q[0] : q || '');
}

function invalidPage(res) {
  return respond(res, 404, 'Link not valid',
    '<h1>This link is not valid</h1>' +
    '<p>It may have expired (links last 48 hours) or been mistyped. ' +
    'You can submit your recommendation again from the recommendations page.</p>');
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return respond(res, 405, 'Not allowed', '<h1>Not allowed</h1>');
  }

  try {
    const token = readToken(req);
    if (!token || token.length > 200) return invalidPage(res);

    const confirmKey = config.PREFIX + 'confirm:' + tokens.hashToken(token);
    const id = await redis.command('GET', confirmKey);
    if (!id) return invalidPage(res);

    const entryKey = config.PREFIX + 'entry:' + id;
    const entry = await redis.command('HGETALL', entryKey);
    // HGETALL returns a flat [field, value, ...] list; empty if the entry is gone.
    if (!entry || !entry.length) return invalidPage(res);
    const state = entry[entry.indexOf('state') + 1];

    if (state !== 'unconfirmed') {
      return respond(res, 200, 'Already confirmed',
        '<h1>Already confirmed</h1><p>You have already confirmed this recommendation. Thank you! ' +
        'It will be reviewed before anything is published.</p>');
    }

    if (req.method === 'GET') {
      const name = entry[entry.indexOf('name') + 1];
      return respond(res, 200, 'Confirm your recommendation',
        '<h1>Confirm your recommendation</h1>' +
        '<p>Hi ' + esc(name) + ', press the button to confirm that you wrote the recommendation you submitted for Charles S. Carreon.</p>' +
        '<form method="post" action="/api/confirm">' +
        '<input type="hidden" name="token" value="' + esc(token) + '">' +
        '<button type="submit" class="btn">Yes, I wrote this</button>' +
        '</form>' +
        '<p>If you did not write it, just close this page. It will be deleted automatically.</p>');
    }

    // POST: mark as awaiting the owner's decision and keep the entry permanently.
    const now = new Date();
    await redis.pipeline([
      ['HSET', entryKey, 'state', 'awaiting', 'confirmedAt', now.toISOString()],
      ['PERSIST', entryKey],
      ['EXPIRE', confirmKey, String(KEEP_CONFIRM_LINK_SECONDS)],
      ['ZADD', config.PREFIX + 'awaiting', String(now.getTime()), id]
    ]);

    return respond(res, 200, 'Confirmed',
      '<h1>Thank you, confirmed</h1>' +
      '<p>Your recommendation has been confirmed and is now waiting for review. ' +
      'It is not public yet. If it is published, it will appear on the recommendations page.</p>');
  } catch (error) {
    console.error('confirm failed:', error && error.message);
    return respond(res, 500, 'Something went wrong',
      '<h1>Something went wrong</h1><p>Please try the link again in a few minutes.</p>');
  }
};
