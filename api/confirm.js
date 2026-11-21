// /api/confirm
// GET  ?token=...  shows a page with a confirm button (opening the link changes nothing,
//                  so email scanners that pre-open links cannot confirm by accident).
// POST token=...   marks the entry "awaiting", keeps it, and emails the owner once.
// Safe to repeat: confirming twice just shows the same result.

const config = require('./_lib/config');
const redis = require('./_lib/redis');
const tokens = require('./_lib/tokens');
const { sendMail } = require('./_lib/mail');
const { buildOwnerEmail } = require('./_lib/ownerMail');
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

// Tells the owner. A failure here must not undo the writer's confirmation, so the entry
// is flagged and the problem is logged; a later daily job can retry flagged entries.
async function notifyOwner(entry, entryKey, decideToken) {
  try {
    const owner = process.env.OWNER_EMAIL;
    if (!owner) throw new Error('OWNER_EMAIL is not set');
    const mail = buildOwnerEmail(entry, decideToken);
    // The email service replaces any Message-ID we set, so we keep its own email id
    // and look the real Message-ID up from it when the reminder is sent.
    const result = await sendMail({ to: owner, subject: mail.subject, text: mail.text });
    await redis.command('HSET', entryKey,
      'ownerMailAt', new Date().toISOString(),
      'ownerMailId', String(result.id || ''));
  } catch (error) {
    console.error('owner email failed:', error && error.message);
    await redis.command('HSET', entryKey, 'ownerMailFailed', '1').catch(function () {});
  }
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
    const entry = await redis.hgetall(entryKey);
    if (!entry.id) return invalidPage(res);

    if (entry.state !== 'unconfirmed') {
      return respond(res, 200, 'Already confirmed',
        '<h1>Already confirmed</h1><p>You have already confirmed this recommendation. Thank you! ' +
        'It will be reviewed before anything is published.</p>');
    }

    if (req.method === 'GET') {
      return respond(res, 200, 'Confirm your recommendation',
        '<h1>Confirm your recommendation</h1>' +
        '<p>Hi ' + esc(entry.name) + ', press the button to confirm that you wrote the recommendation you submitted for Charles S. Carreon.</p>' +
        '<form method="post" action="/api/confirm">' +
        '<input type="hidden" name="token" value="' + esc(token) + '">' +
        '<button type="submit" class="btn">Yes, I wrote this</button>' +
        '</form>' +
        '<p>If you did not write it, just close this page. It will be deleted automatically.</p>');
    }

    // POST: mark as awaiting the owner's decision, keep the entry, and create the
    // owner's decision token (stored only as a hash).
    const decideToken = tokens.newToken();
    const now = new Date();
    const linkTtl = String(config.DECISION_LINK_TTL_SECONDS);
    await redis.pipeline([
      ['HSET', entryKey,
        'state', 'awaiting',
        'confirmedAt', now.toISOString(),
        'decideHash', tokens.hashToken(decideToken)],
      ['PERSIST', entryKey],
      ['EXPIRE', confirmKey, String(KEEP_CONFIRM_LINK_SECONDS)],
      ['SET', config.PREFIX + 'decide:' + tokens.hashToken(decideToken), id, 'EX', linkTtl],
      ['ZADD', config.PREFIX + 'awaiting', String(now.getTime()), id]
    ]);

    await notifyOwner(entry, entryKey, decideToken);

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
