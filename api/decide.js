// /api/decide
// GET  ?token=...            shows the entry with Approve and Reject buttons (changes nothing).
// POST token + action        asks "are you sure?" (changes nothing).
// POST token + action + confirm=yes   records the owner's decision.
// Safe to repeat: once decided, the same page just reports the decision.

const config = require('./_lib/config');
const redis = require('./_lib/redis');
const tokens = require('./_lib/tokens');
const { relationshipLine } = require('./_lib/ownerMail');
const { esc, respond } = require('./_lib/html');

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
  return respond(res, 404, 'Link not valid',
    '<h1>This link is not valid</h1>' +
    '<p>It may have expired (decision links last 30 days) or been mistyped.</p>');
}

function multiline(text) {
  return esc(text).replace(/\n/g, '<br>');
}

function row(label, value) {
  return '<li><strong>' + esc(label) + ':</strong> ' + value + '</li>';
}

function link(url) {
  if (!url) return '(none given)';
  return '<a href="' + esc(url) + '" rel="noopener noreferrer">' + esc(url) + '</a>';
}

function entryDetails(entry) {
  return '<ul>' +
    row('Name', esc(entry.name)) +
    row('Email', esc(entry.email)) +
    row('How they know you', esc(relationshipLine(entry))) +
    row('Role', entry.role ? esc(entry.role) : '(none given)') +
    row('Organization', entry.organization ? esc(entry.organization) : '(none given)') +
    row('LinkedIn', link(entry.linkedin)) +
    row('Facebook', link(entry.facebook)) +
    row('Show profile links publicly', entry.showLinks === '1' ? 'yes' : 'no') +
    '</ul>' +
    '<h2>Recommendation</h2>' +
    '<blockquote><p>' + multiline(entry.message) + '</p></blockquote>';
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return respond(res, 405, 'Not allowed', '<h1>Not allowed</h1>');
  }

  try {
    const token = field(req, 'token');
    if (!token || token.length > 200) return invalidPage(res);

    const id = await redis.command('GET', config.PREFIX + 'decide:' + tokens.hashToken(token));
    if (!id) return invalidPage(res);

    const entryKey = config.PREFIX + 'entry:' + id;
    const entry = await redis.hgetall(entryKey);
    if (!entry.id) return invalidPage(res);

    if (entry.state === 'published' || entry.state === 'rejected') {
      return respond(res, 200, 'Already decided',
        '<h1>Already decided</h1><p>This recommendation was ' +
        (entry.state === 'published' ? 'approved and published' : 'rejected') +
        ' on ' + esc(entry.decidedAt || 'an earlier date') + '. Nothing was changed.</p>');
    }
    if (entry.state !== 'awaiting') return invalidPage(res);

    const backLink = '/api/decide?token=' + encodeURIComponent(token);
    const action = field(req, 'action');
    const chosen = action === 'approve' || action === 'reject';

    // Step 1: show the entry with both buttons.
    if (req.method === 'GET' || !chosen) {
      return respond(res, 200, 'Approve or reject',
        '<h1>Approve or reject this recommendation?</h1>' +
        entryDetails(entry) +
        '<form method="post" action="/api/decide">' +
        '<input type="hidden" name="token" value="' + esc(token) + '">' +
        '<button type="submit" name="action" value="approve" class="btn">Approve</button> ' +
        '<button type="submit" name="action" value="reject" class="btn">Reject</button>' +
        '</form>' +
        '<p>Nothing changes until you press a button and confirm.</p>');
    }

    const approving = action === 'approve';

    // Step 2: ask "are you sure?".
    if (field(req, 'confirm') !== 'yes') {
      return respond(res, 200, 'Are you sure?',
        '<h1>Are you sure you want to ' + (approving ? 'approve and publish' : 'reject') + ' this recommendation?</h1>' +
        '<p>From ' + esc(entry.name) + '. ' +
        (approving
          ? 'Approving marks it as published.'
          : 'Rejecting keeps it private.') + '</p>' +
        '<form method="post" action="/api/decide">' +
        '<input type="hidden" name="token" value="' + esc(token) + '">' +
        '<input type="hidden" name="action" value="' + esc(action) + '">' +
        '<input type="hidden" name="confirm" value="yes">' +
        '<button type="submit" class="btn">' + (approving ? 'Yes, approve and publish' : 'Yes, reject') + '</button>' +
        '</form>' +
        '<p><a href="' + esc(backLink) + '">No, go back</a></p>');
    }

    // Step 3: record the decision.
    const now = new Date();
    const commands = [
      ['HSET', entryKey,
        'state', approving ? 'published' : 'rejected',
        'decidedAt', now.toISOString(),
        'decision', approving ? 'approved' : 'rejected'],
      ['ZREM', config.PREFIX + 'awaiting', id]
    ];
    if (approving) {
      commands[0].push('publishedAt', now.toISOString());
      commands.push(['ZADD', config.PREFIX + 'published', String(now.getTime()), id]);
    }
    await redis.pipeline(commands);

    return respond(res, 200, approving ? 'Approved' : 'Rejected',
      approving
        ? '<h1>Approved</h1><p>The recommendation is marked as published. It will appear on the recommendations page once the public list is switched on.</p>'
        : '<h1>Rejected</h1><p>The recommendation will stay private.</p>');
  } catch (error) {
    console.error('decide failed:', error && error.message);
    return respond(res, 500, 'Something went wrong',
      '<h1>Something went wrong</h1><p>Please try the link again in a few minutes.</p>');
  }
};
