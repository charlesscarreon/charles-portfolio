// /api/decide
// GET  ?token=...            shows the entry with Approve and Reject buttons (changes nothing).
// POST token + action        asks "are you sure?" (changes nothing).
// POST token + action + confirm=yes   records the owner's decision.
// Safe to repeat: once decided, the same page just reports the decision.

const config = require('./_lib/config');
const redis = require('./_lib/redis');
const tokens = require('./_lib/tokens');
const { relationshipLine } = require('./_lib/ownerMail');
const entries = require('./_lib/entries');
const { respond } = require('./_lib/html');
const pages = require('./_lib/pages');

function field(req, name) {
  const body = req.body;
  if (req.method === 'POST') {
    if (body && typeof body === 'object' && !Buffer.isBuffer(body)) return String(body[name] || '');
    if (typeof body === 'string') return new URLSearchParams(body).get(name) || '';
    return '';
  }
  const q = req.query && req.query[name];
  return String(Array.isArray(q) ? q[0] : q || '');
}

function invalidPage(res) {
  return respond(res, 404, 'Link not valid', pages.invalidDecidePage());
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return respond(res, 405, 'Not allowed', pages.messagePage('bad', 'Not allowed'));
  }

  try {
    const token = field(req, 'token');
    if (!token || token.length > 200) return invalidPage(res);

    const id = await redis.command('GET', config.PREFIX + 'decide:' + tokens.hashToken(token));
    if (!id) return invalidPage(res);

    const entryKey = config.PREFIX + 'entry:' + id;
    const entry = await redis.hgetall(entryKey);
    if (!entry.id) return invalidPage(res);

    if (entry.state === 'published' || entry.state === 'rejected' || entry.state === 'hidden') {
      return respond(res, 200, 'Already decided', pages.alreadyDecidedPage(entry));
    }
    if (entry.state !== 'awaiting') return invalidPage(res);

    const backLink = '/api/decide?token=' + encodeURIComponent(token);
    const action = field(req, 'action');
    const chosen = action === 'approve' || action === 'reject';

    // Step 1: show the entry with both buttons.
    if (req.method === 'GET' || !chosen) {
      return respond(res, 200, 'Approve or reject',
        pages.decidePage(Object.assign({}, entry, { relationshipLine: relationshipLine(entry) }), token));
    }

    const approving = action === 'approve';

    // Step 2: ask "are you sure?".
    if (field(req, 'confirm') !== 'yes') {
      return respond(res, 200, 'Are you sure?', pages.decideSurePage(entry, token, action, backLink));
    }

    // Step 3: record the decision (the shared code also refreshes the public list).
    if (approving) await entries.approve(id);
    else await entries.reject(id);

    return respond(res, 200, approving ? 'Approved' : 'Rejected', pages.decideDonePage(approving));
  } catch (error) {
    console.error('decide failed:', error && error.message);
    return respond(res, 500, 'Something went wrong',
      pages.messagePage('warn', 'Something went wrong', 'Please try the link again in a few minutes.'));
  }
};
