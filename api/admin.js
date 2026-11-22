// /admin (rewritten to this function in vercel.json). Owner only.
// Login, then lists of pending, published, hidden and rejected entries with buttons.
// Everything is a plain HTML form, so it works with no JavaScript.

const config = require('./_lib/config');
const redis = require('./_lib/redis');
const tokens = require('./_lib/tokens');
const admin = require('./_lib/admin');
const entries = require('./_lib/entries');
const { relationshipLine } = require('./_lib/ownerMail');
const { respond } = require('./_lib/html');
const pages = require('./_lib/pages');
const { getFeatured, MAX_FEATURED } = require('./_lib/publicList');

const MAX_FAILED_LOGINS = 10;
const LOGIN_WINDOW_SECONDS = 15 * 60;

function body(req) {
  const b = req.body;
  if (b && typeof b === 'object' && !Buffer.isBuffer(b)) return b;
  if (typeof b === 'string') return Object.fromEntries(new URLSearchParams(b));
  return {};
}

function clientIp(req) {
  return String((req.headers && req.headers['x-forwarded-for']) || '').split(',')[0].trim() || 'unknown';
}

function redirect(res, where) {
  res.status(303);
  res.setHeader('Location', where || '/admin');
  res.setHeader('Cache-Control', 'no-store');
  return res.end();
}

function loginPage(res, message, status) {
  return respond(res, status || 200, 'Admin login', pages.loginPage(message));
}

const NOTES = {
  full: 'The top ' + MAX_FEATURED + ' is full. Remove one first, then feature this one.',
  invalid: 'That recommendation could not be changed. It may have been hidden or deleted.'
};

function withLine(list) {
  return list.map(function (e) { return Object.assign({}, e, { relationshipLine: relationshipLine(e) }); });
}

async function dashboard(res, noteKey) {
  const results = await Promise.all([
    entries.list('awaiting'), entries.list('published'), entries.list('hidden'), entries.list('rejected')
  ]);
  const featuredIds = (await getFeatured()).filter(function (id) {
    return results[1].some(function (e) { return e.id === id; });
  });
  const featured = featuredIds.map(function (id) {
    return results[1].filter(function (e) { return e.id === id; })[0];
  });
  return respond(res, 200, 'Admin', pages.dashboardPage({
    awaiting: withLine(results[0]),
    published: withLine(results[1]),
    hidden: withLine(results[2]),
    rejected: withLine(results[3]),
    featured: withLine(featured),
    featuredIds: featuredIds,
    maxFeatured: MAX_FEATURED,
    note: NOTES[noteKey] || ''
  }), { wide: true });
}

async function login(req, res) {
  const key = config.PREFIX + 'rl:admin:' + tokens.hmac(clientIp(req));
  const failed = Number(await redis.command('GET', key)) || 0;
  if (failed >= MAX_FAILED_LOGINS) return loginPage(res, 'Too many attempts. Try again in a few minutes.', 429);

  if (admin.secretMatches(String(body(req).secret || ''))) {
    res.setHeader('Set-Cookie', admin.sessionCookie());
    return redirect(res, '/admin');
  }
  await redis.pipeline([['INCR', key], ['EXPIRE', key, String(LOGIN_WINDOW_SECONDS), 'NX']]);
  return loginPage(res, 'That secret is not correct.', 401);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return respond(res, 405, 'Not allowed', pages.messagePage('bad', 'Not allowed'));
  }

  try {
    if (!admin.configured()) {
      return respond(res, 503, 'Admin unavailable', pages.messagePage('warn', 'Admin is not set up'));
    }

    if (req.method === 'GET') {
      const note = String((req.query && req.query.note) || '');
      return admin.isAuthed(req) ? dashboard(res, note) : loginPage(res);
    }

    if (!admin.sameOrigin(req)) return respond(res, 403, 'Not allowed', pages.messagePage('bad', 'Not allowed'));
    const b = body(req);
    const action = String(b.action || '');

    if (action === 'login') return login(req, res);

    if (!admin.isAuthed(req)) return loginPage(res, 'Please log in.', 401);

    if (action === 'logout') {
      res.setHeader('Set-Cookie', admin.clearCookie());
      return redirect(res, '/admin');
    }

    const id = String(b.id || '');
    if (!entries.validId(id)) return redirect(res, '/admin');

    if (action === 'delete' && String(b.confirm) !== 'yes') {
      const e = await entries.get(id);
      if (!e.id) return redirect(res, '/admin');
      return respond(res, 200, 'Delete this recommendation?', pages.deletePage(e));
    }

    if (action === 'feature') {
      const outcome = await entries.feature(id);
      return redirect(res, outcome === 'ok' ? '/admin' : '/admin?note=' + outcome);
    }
    const actions = {
      approve: entries.approve, reject: entries.reject, hide: entries.hide, unhide: entries.unhide, delete: entries.remove,
      unfeature: entries.unfeature,
      up: function (x) { return entries.moveFeatured(x, 'up'); },
      down: function (x) { return entries.moveFeatured(x, 'down'); }
    };
    if (actions[action]) await actions[action](id);
    return redirect(res, '/admin');
  } catch (error) {
    console.error('admin failed:', error && error.message);
    return respond(res, 500, 'Something went wrong', pages.messagePage('warn', 'Something went wrong', 'Please try again.'));
  }
};
