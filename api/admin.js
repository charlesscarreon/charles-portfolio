// /admin (rewritten to this function in vercel.json). Owner only.
// Login, then lists of pending, published, hidden and rejected entries with buttons.
// Everything is a plain HTML form, so it works with no JavaScript.

const config = require('./_lib/config');
const redis = require('./_lib/redis');
const tokens = require('./_lib/tokens');
const admin = require('./_lib/admin');
const entries = require('./_lib/entries');
const { relationshipLine } = require('./_lib/ownerMail');
const { esc, respond } = require('./_lib/html');

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
  return respond(res, status || 200, 'Admin login',
    '<h1>Admin login</h1>' +
    (message ? '<p>' + esc(message) + '</p>' : '') +
    '<form method="post" action="/admin">' +
    '<p><label for="admin-secret">Secret</label><br>' +
    '<input id="admin-secret" name="secret" type="password" autocomplete="current-password" required></p>' +
    '<input type="hidden" name="action" value="login">' +
    '<button type="submit" class="btn">Log in</button>' +
    '</form>');
}

function day(iso) { return iso ? String(iso).slice(0, 10) : ''; }

function link(url) {
  return url ? '<a href="' + esc(url) + '" rel="noopener noreferrer">' + esc(url) + '</a>' : '(none)';
}

function actionForm(id, action, label) {
  return '<form method="post" action="/admin" style="display:inline">' +
    '<input type="hidden" name="id" value="' + esc(id) + '">' +
    '<button type="submit" name="action" value="' + action + '" class="btn">' + esc(label) + '</button></form> ';
}

function entryBlock(e, buttons, open) {
  const when = day(e.publishedAt || e.confirmedAt || e.createdAt);
  return '<details' + (open ? ' open' : '') + '>' +
    '<summary><strong>' + esc(e.name) + '</strong> · ' + esc(relationshipLine(e)) + ' · ' + esc(when) + '</summary>' +
    '<ul>' +
    '<li>Email: ' + esc(e.email) + '</li>' +
    '<li>Role: ' + (e.role ? esc(e.role) : '(none)') + '</li>' +
    '<li>Organization: ' + (e.organization ? esc(e.organization) : '(none)') + '</li>' +
    '<li>LinkedIn: ' + link(e.linkedin) + '</li>' +
    '<li>Facebook: ' + link(e.facebook) + '</li>' +
    '<li>Show links publicly: ' + (e.showLinks === '1' ? 'yes' : 'no') + '</li>' +
    '</ul>' +
    '<blockquote><p>' + esc(e.message).replace(/\n/g, '<br>') + '</p></blockquote>' +
    '<p>' + buttons + '</p>' +
    '</details>';
}

function section(title, list, buttonsFor, open, emptyText) {
  return '<h2>' + esc(title) + ' (' + list.length + ')</h2>' +
    (list.length
      ? list.map(function (e) { return entryBlock(e, buttonsFor(e), open); }).join('')
      : '<p>' + esc(emptyText) + '</p>');
}

async function dashboard(res) {
  const results = await Promise.all([
    entries.list('awaiting'), entries.list('published'), entries.list('hidden'), entries.list('rejected')
  ]);
  const del = function (e) { return actionForm(e.id, 'delete', 'Delete'); };
  const html =
    '<h1>Recommendations</h1>' +
    '<form method="post" action="/admin"><input type="hidden" name="action" value="logout">' +
    '<button type="submit" class="btn">Log out</button></form>' +
    section('Pending', results[0], function (e) {
      return actionForm(e.id, 'approve', 'Approve') + actionForm(e.id, 'reject', 'Reject') + del(e);
    }, true, 'Nothing is waiting for a decision.') +
    section('Published', results[1], function (e) {
      return actionForm(e.id, 'hide', 'Hide') + del(e);
    }, false, 'Nothing is published.') +
    section('Hidden', results[2], function (e) {
      return actionForm(e.id, 'unhide', 'Unhide') + del(e);
    }, false, 'Nothing is hidden.') +
    section('Rejected', results[3], function (e) {
      return actionForm(e.id, 'approve', 'Approve instead') + del(e);
    }, false, 'Nothing is rejected.') +
    '<p>Changes show on the public page within about 30 seconds.</p>';
  return respond(res, 200, 'Admin', html);
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
    return respond(res, 405, 'Not allowed', '<h1>Not allowed</h1>');
  }

  try {
    if (!admin.configured()) {
      return respond(res, 503, 'Admin unavailable', '<h1>Admin is not set up</h1>');
    }

    if (req.method === 'GET') {
      return admin.isAuthed(req) ? dashboard(res) : loginPage(res);
    }

    if (!admin.sameOrigin(req)) return respond(res, 403, 'Not allowed', '<h1>Not allowed</h1>');
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
      return respond(res, 200, 'Delete this recommendation?',
        '<h1>Delete this recommendation permanently?</h1>' +
        '<p>From ' + esc(e.name) + '. This cannot be undone. If you only want it off the page, use Hide instead.</p>' +
        '<form method="post" action="/admin">' +
        '<input type="hidden" name="id" value="' + esc(id) + '">' +
        '<input type="hidden" name="action" value="delete">' +
        '<input type="hidden" name="confirm" value="yes">' +
        '<button type="submit" class="btn">Yes, delete permanently</button></form>' +
        '<p><a href="/admin">No, go back</a></p>');
    }

    const actions = { approve: entries.approve, reject: entries.reject, hide: entries.hide, unhide: entries.unhide, delete: entries.remove };
    if (actions[action]) await actions[action](id);
    return redirect(res, '/admin');
  } catch (error) {
    console.error('admin failed:', error && error.message);
    return respond(res, 500, 'Something went wrong', '<h1>Something went wrong</h1><p>Please try again.</p>');
  }
};
