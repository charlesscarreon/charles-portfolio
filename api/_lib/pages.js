// The markup of the internal pages: admin, the owner's approve or reject pages and the
// writer's confirm pages. Everything visual lives here and in the "Internal pages" block
// of styles.css, so the look can be changed in one place. No logic: the handlers decide
// what to show, these functions only draw it.
// Every page works with no JavaScript and stays readable if the stylesheet fails.

const { esc } = require('./html');
const { renderEntry } = require('./render');

const ICONS = {
  ok: '<path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',
  bad: '<path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
  warn: '<path d="M12 4l9 16H3z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M12 10v4.5M12 17.2v.1" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>'
};

// kind: ok (check), bad (cross) or warn (triangle). Sized in the markup so it is not huge
// when the stylesheet is missing.
function statusIcon(kind) {
  return '<span class="status-icon status-icon--' + kind + '" aria-hidden="true">' +
    '<svg viewBox="0 0 24 24" width="40" height="40" focusable="false">' + ICONS[kind] + '</svg></span>';
}

function heading(kind, text) {
  return '<div class="internal-head">' + (kind ? statusIcon(kind) : '') + '<h1>' + esc(text) + '</h1></div>';
}

// A banner for something the reader must notice. kind: warn (amber), bad (red) or ok.
function alert(kind, text) {
  return '<div class="internal-alert internal-alert--' + kind + '" role="' + (kind === 'ok' ? 'status' : 'alert') + '">' +
    statusIcon(kind) + '<p>' + esc(text) + '</p></div>';
}

function multiline(text) {
  return esc(text).replace(/\n/g, '<br>');
}

function day(iso) { return iso ? String(iso).slice(0, 10) : ''; }

// A profile link the writer gave, with a tag that says whether it is shown publicly
// (they ticked "Show my profile links") or kept private (only the owner sees it).
function link(url, entry) {
  if (!url) return '(none)';
  const isPublic = entry && entry.showLinks === '1';
  return '<a href="' + esc(url) + '" rel="noopener noreferrer">' + esc(url) + '</a> ' +
    '<span class="chip chip--' + (isPublic ? 'public' : 'private') + '">' + (isPublic ? 'Public' : 'Private') + '</span>';
}

function button(label, kind) {
  return 'btn' + (kind ? ' btn--' + kind : '');
}

// A form with one hidden token field and one or more buttons: [label, name, value, kind].
function tokenForm(action, hidden, buttons) {
  return '<form class="internal-actions__form" method="post" action="' + esc(action) + '">' +
    Object.keys(hidden).map(function (k) {
      return '<input type="hidden" name="' + esc(k) + '" value="' + esc(hidden[k]) + '">';
    }).join('') +
    buttons.map(function (b) {
      return '<button type="submit"' + (b[1] ? ' name="' + esc(b[1]) + '" value="' + esc(b[2]) + '"' : '') +
        ' class="' + button(b[0], b[3]) + '">' + esc(b[0]) + '</button>';
    }).join(' ') +
    '</form>';
}

// The recommendation as it will look when published (profile links only if the writer
// agreed to show them).
function previewCard(entry) {
  const links = [];
  if (entry.showLinks === '1') {
    if (entry.linkedin) links.push({ label: 'LinkedIn', url: entry.linkedin });
    if (entry.facebook) links.push({ label: 'Facebook', url: entry.facebook });
  }
  return renderEntry({
    id: entry.id,
    name: entry.name,
    role: entry.role || '',
    organization: entry.organization || '',
    line: entry.relationshipLine,
    message: entry.message,
    publishedAt: entry.publishedAt || entry.confirmedAt || entry.createdAt || '',
    links: links
  });
}

// ---- admin ----

// The show or hide button for the secret is added by this small script, so with no
// JavaScript the field is just a normal password field and no dead button shows.
const EYE = '<svg class="eye" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2"/></svg>' +
  '<svg class="eye-off" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="M3 3l18 18M10.6 5.2A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4M6.5 6.6A17 17 0 0 0 2 12s3.6 7 10 7a10 10 0 0 0 4.4-1M9.9 9.9a3 3 0 0 0 4.2 4.2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const PASSWORD_TOGGLE = '<script>(function(){var i=document.getElementById("admin-secret");if(!i){return;}' +
  'var b=document.createElement("button");b.type="button";b.className="password-toggle";' +
  'b.setAttribute("aria-label","Show password");b.setAttribute("aria-pressed","false");' +
  'b.innerHTML=' + JSON.stringify(EYE) + ';' +
  'b.addEventListener("click",function(){var show=i.type==="password";i.type=show?"text":"password";' +
  'b.setAttribute("aria-pressed",show?"true":"false");b.setAttribute("aria-label",show?"Hide password":"Show password");' +
  'b.className="password-toggle"+(show?" is-showing":"");});i.parentNode.appendChild(b);})();</script>';

function loginPage(message) {
  return heading('', 'Admin login') +
    (message ? alert('bad', message) : '') +
    '<form class="internal-form" method="post" action="/admin">' +
    '<p><label for="admin-secret">Secret</label></p>' +
    '<div class="password-field">' +
    '<input id="admin-secret" name="secret" type="password" autocomplete="current-password" required>' +
    '</div>' +
    '<input type="hidden" name="action" value="login">' +
    '<p><button type="submit" class="btn">Log in</button></p>' +
    '</form>' + PASSWORD_TOGGLE;
}

function actionForm(id, action, label, kind) {
  return tokenForm('/admin', { id: id }, [[label, 'action', action, kind]]);
}

const STATES = {
  awaiting: ['Awaiting', 'awaiting'],
  published: ['Published', 'published'],
  hidden: ['Hidden', 'hidden'],
  rejected: ['Rejected', 'rejected']
};

function entryBlock(e, state, buttons, open) {
  const when = day(e.publishedAt || e.confirmedAt || e.createdAt);
  const chip = STATES[state];
  return '<details class="admin-entry' + (e.featuredPos ? ' admin-entry--featured' : '') + '"' + (open ? ' open' : '') + '>' +
    '<summary><span class="admin-entry__who"><strong>' + esc(e.name) + '</strong>' +
    '<span class="admin-entry__meta">' + esc(e.relationshipLine) + ' · ' + esc(when) + '</span></span>' +
    '<span class="admin-entry__chips">' +
    (e.featuredPos ? '<span class="chip chip--featured"><span aria-hidden="true">★ </span>Featured #' + e.featuredPos + '</span>' : '') +
    '<span class="chip chip--' + chip[1] + '">' + chip[0] + '</span></span></summary>' +
    '<div class="admin-entry__body">' +
    '<dl class="admin-facts">' +
    '<dt>Email</dt><dd>' + esc(e.email) + '</dd>' +
    '<dt>Role</dt><dd>' + (e.role ? esc(e.role) : '(none)') + '</dd>' +
    '<dt>Organization</dt><dd>' + (e.organization ? esc(e.organization) : '(none)') + '</dd>' +
    '<dt>LinkedIn</dt><dd>' + link(e.linkedin, e) + '</dd>' +
    '<dt>Facebook</dt><dd>' + link(e.facebook, e) + '</dd>' +
    '</dl>' +
    '<blockquote class="admin-entry__message"><p>' + multiline(e.message) + '</p></blockquote>' +
    '<div class="internal-actions">' + buttons + '</div>' +
    '</div>' +
    '</details>';
}

function section(title, state, list, buttonsFor, open, emptyText) {
  return '<section class="admin-section"><h2>' + esc(title) + ' <span class="admin-count">' + list.length + '</span></h2>' +
    (list.length
      ? list.map(function (e) { return entryBlock(e, state, buttonsFor(e), open); }).join('')
      : '<p class="admin-empty">' + esc(emptyText) + '</p>') +
    '</section>';
}

// data: { awaiting, published, hidden, rejected, featured, featuredIds, maxFeatured, note }
// Each entry already carries relationshipLine.
function dashboardPage(data) {
  const ids = data.featuredIds;
  // Mark each entry that is in the homepage top list with its place, so the card can show it.
  const mark = function (list) {
    return list.map(function (e) { return Object.assign({}, e, { featuredPos: ids.indexOf(e.id) + 1 }); });
  };
  const del = function (e) { return actionForm(e.id, 'delete', 'Delete', 'danger'); };
  return '<div class="internal-head internal-head--bar"><h1>Recommendations</h1>' +
    tokenForm('/admin', { action: 'logout' }, [['Log out', '', '', 'secondary']]) + '</div>' +
    (data.note ? alert('warn', data.note) : '') +
    section('Awaiting your decision', 'awaiting', data.awaiting, function (e) {
      return actionForm(e.id, 'approve', 'Approve') + actionForm(e.id, 'reject', 'Reject', 'secondary') + del(e);
    }, true, 'Nothing is waiting for a decision.') +
    section('Top recommendations on the homepage', 'published', mark(data.featured), function (e) {
      const at = ids.indexOf(e.id);
      return (at > 0 ? actionForm(e.id, 'up', 'Move up', 'secondary') : '') +
        (at < ids.length - 1 ? actionForm(e.id, 'down', 'Move down', 'secondary') : '') +
        actionForm(e.id, 'unfeature', 'Remove from top', 'secondary');
    }, false, 'Nothing is chosen. The homepage shows the newest recommendations until you choose up to ' + data.maxFeatured + '.') +
    section('Published', 'published', mark(data.published), function (e) {
      return (ids.indexOf(e.id) === -1 ? actionForm(e.id, 'feature', 'Feature on homepage', 'secondary') : actionForm(e.id, 'unfeature', 'Remove from top', 'secondary')) +
        actionForm(e.id, 'hide', 'Hide', 'secondary') + del(e);
    }, false, 'Nothing is published.') +
    section('Hidden', 'hidden', data.hidden, function (e) {
      return actionForm(e.id, 'unhide', 'Unhide', 'secondary') + del(e);
    }, false, 'Nothing is hidden.') +
    section('Rejected', 'rejected', data.rejected, function (e) {
      return actionForm(e.id, 'approve', 'Approve instead', 'secondary') + del(e);
    }, false, 'Nothing is rejected.') +
    '<p class="internal-hint">Changes show on the public page within about 30 seconds.</p>';
}

function deletePage(e) {
  return heading('warn', 'Delete this recommendation permanently?') +
    '<p>From ' + esc(e.name) + '. This cannot be undone. If you only want it off the page, use Hide instead.</p>' +
    '<div class="internal-actions">' +
    tokenForm('/admin', { id: e.id, action: 'delete', confirm: 'yes' }, [['Yes, delete permanently', '', '', 'danger']]) +
    '<a class="btn btn--secondary" href="/admin">No, go back</a></div>';
}

// ---- the owner's approve or reject pages ----

function decidePage(entry, token) {
  return heading('', 'Approve or reject this recommendation?') +
    '<p class="internal-note">This is how it will look when published.</p>' +
    previewCard(entry) +
    '<dl class="admin-facts admin-facts--card">' +
    '<dt>Email</dt><dd>' + esc(entry.email) + '</dd>' +
    '<dt>LinkedIn</dt><dd>' + link(entry.linkedin, entry) + '</dd>' +
    '<dt>Facebook</dt><dd>' + link(entry.facebook, entry) + '</dd>' +
    '</dl>' +
    '<div class="internal-actions">' +
    tokenForm('/api/decide', { token: token }, [['Approve', 'action', 'approve', ''], ['Reject', 'action', 'reject', 'danger']]) +
    '</div>' +
    '<p class="internal-hint">Nothing changes until you press a button and confirm.</p>';
}

function decideSurePage(entry, token, action, backLink) {
  const approving = action === 'approve';
  return heading('warn', 'Are you sure you want to ' + (approving ? 'approve and publish' : 'reject') + ' this recommendation?') +
    '<p>From ' + esc(entry.name) + '. ' +
    (approving ? 'Approving marks it as published.' : 'Rejecting keeps it private.') + '</p>' +
    '<div class="internal-actions">' +
    tokenForm('/api/decide', { token: token, action: action, confirm: 'yes' },
      [[approving ? 'Yes, approve and publish' : 'Yes, reject', '', '', approving ? '' : 'danger']]) +
    '<a class="btn btn--secondary" href="' + esc(backLink) + '">No, go back</a></div>';
}

function decideDonePage(approving) {
  return approving
    ? heading('ok', 'Approved') + '<p>The recommendation is marked as published. It will appear on the recommendations page within about half a minute.</p>'
    : heading('bad', 'Rejected') + '<p>The recommendation will stay private.</p>';
}

function alreadyDecidedPage(entry) {
  return heading('ok', 'Already decided') + '<p>This recommendation was ' +
    (entry.state === 'rejected' ? 'rejected' : 'approved') +
    ' on ' + esc(entry.decidedAt || 'an earlier date') + '. Nothing was changed. You can manage it from the admin page.</p>';
}

function invalidDecidePage() {
  return heading('warn', 'This link is not valid') +
    '<p>It may have expired (decision links last 30 days) or been mistyped.</p>';
}

// ---- the writer's confirm pages ----

function confirmPage(entry, token) {
  return heading('', 'Confirm your recommendation') +
    '<p>Hi ' + esc(entry.name) + ', press the button to confirm that you wrote the recommendation you submitted for Charles S. Carreon.</p>' +
    '<div class="internal-actions">' +
    tokenForm('/api/confirm', { token: token }, [['Yes, I wrote this', '', '', '']]) + '</div>' +
    '<p class="internal-hint">If you did not write it, just close this page. It will be deleted automatically.</p>';
}

function confirmedPage() {
  return heading('ok', 'Thank you, confirmed') +
    '<p>Your recommendation has been confirmed and is now waiting for review. It is not public yet. If it is published, it will appear on the recommendations page.</p>';
}

function alreadyConfirmedPage() {
  return heading('ok', 'Already confirmed') +
    '<p>You have already confirmed this recommendation. Thank you! It will be reviewed before anything is published.</p>';
}

function invalidConfirmPage() {
  return heading('warn', 'This link is not valid') +
    '<p>It may have expired (links last 48 hours) or been mistyped. You can submit your recommendation again from the recommendations page.</p>';
}

// ---- shared ----

function messagePage(kind, title, text) {
  return heading(kind, title) + (text ? '<p>' + esc(text) + '</p>' : '');
}

module.exports = {
  loginPage, dashboardPage, deletePage,
  decidePage, decideSurePage, decideDonePage, alreadyDecidedPage, invalidDecidePage,
  confirmPage, confirmedPage, alreadyConfirmedPage, invalidConfirmPage,
  messagePage, previewCard
};
