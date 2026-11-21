// GET /api/status?token=...
// A private page for the writer, reached from their confirmation email.
// It shows only that writer's own entry, in plain words. It never shows why an entry
// was rejected, and it is not indexed.

const config = require('./_lib/config');
const redis = require('./_lib/redis');
const tokens = require('./_lib/tokens');
const { esc, respond } = require('./_lib/html');

function invalidPage(res) {
  return respond(res, 404, 'Link not valid',
    '<h1>This link is not valid</h1>' +
    '<p>It may have expired, or the recommendation was never confirmed and has been deleted. ' +
    'Unconfirmed recommendations are removed after 48 hours.</p>');
}

function describe(entry) {
  switch (entry.state) {
    case 'unconfirmed':
      return { title: 'Waiting for your confirmation',
        text: 'Open the confirmation email we sent you and press the confirm button. Until you do, nothing is shared, and the recommendation is deleted 48 hours after you submitted it.' };
    case 'awaiting':
      return { title: 'Confirmed, waiting for review',
        text: 'Thank you for confirming. Charles has been asked to review your recommendation. It is not public yet.' };
    case 'published':
      return { title: 'Published',
        text: 'Your recommendation has been approved and is on the recommendations page. Thank you!',
        link: true };
    case 'rejected':
      return { title: 'Not published',
        text: 'Your recommendation will not be published on the site. Thank you for taking the time to write it.' };
    default:
      return null;
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return respond(res, 405, 'Not allowed', '<h1>Not allowed</h1>');
  }

  try {
    const q = req.query && req.query.token;
    const token = String(Array.isArray(q) ? q[0] : q || '');
    if (!token || token.length > 200) return invalidPage(res);

    const id = await redis.command('GET', config.PREFIX + 'status:' + tokens.hashToken(token));
    if (!id) return invalidPage(res);

    const entry = await redis.hgetall(config.PREFIX + 'entry:' + id);
    const info = entry.id ? describe(entry) : null;
    if (!info) return invalidPage(res);

    return respond(res, 200, 'Recommendation status',
      '<h1>Recommendation status</h1>' +
      '<p>For ' + esc(entry.name) + '.</p>' +
      '<h2>' + esc(info.title) + '</h2>' +
      '<p>' + esc(info.text) + '</p>' +
      (info.link ? '<p><a href="/recommendations">View the recommendations page</a></p>' : ''));
  } catch (error) {
    console.error('status failed:', error && error.message);
    return respond(res, 500, 'Something went wrong',
      '<h1>Something went wrong</h1><p>Please try again in a few minutes.</p>');
  }
};
