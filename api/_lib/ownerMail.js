// Builds the email the owner receives when a writer has confirmed a recommendation.
// It shows everything, including the private profile links, plus the decision links.

const { RELATIONSHIPS, BASE_URL } = require('./config');
const { renderEmail, visibilityTag, linkHtml } = require('./emailTemplate');
const { esc } = require('./html');

function decisionLink(token) {
  return BASE_URL + '/api/decide?token=' + encodeURIComponent(token);
}

function relationshipLine(entry) {
  const r = RELATIONSHIPS[entry.relationship];
  return r ? r.line : 'Knows Charles';
}

function buildOwnerEmail(entry, decideToken, options) {
  const lines = [
    'A writer has confirmed a recommendation. It is not public until you approve it.',
    '',
    'Name: ' + entry.name,
    'Email: ' + entry.email,
    'How they know you: ' + relationshipLine(entry),
    'Role: ' + (entry.role || '(none given)'),
    'Organization: ' + (entry.organization || '(none given)'),
    'LinkedIn: ' + (entry.linkedin || '(none given)'),
    'Facebook: ' + (entry.facebook || '(none given)'),
    'Show profile links publicly: ' + (entry.showLinks === '1' ? 'yes' : 'no'),
    '',
    'Recommendation:',
    '',
    entry.message,
    '',
    'Approve or reject it here:',
    decisionLink(decideToken),
    '',
    'The link opens a page with Approve and Reject buttons. Nothing changes until you press one and confirm.',
    'The link works for 30 days.'
  ];
  const isPublic = entry.showLinks === '1';
  const none = '<span style="color:#5f5b50">(none given)</span>';
  const profile = function (url) { return url ? linkHtml(url) + visibilityTag(isPublic) : none; };
  const html = renderEmail(Object.assign({
    preheader: entry.name + ' has confirmed a recommendation. It is not public until you approve it.',
    heading: 'Recommendation awaiting your review',
    intro: [entry.name + ' has confirmed the recommendation below. It will not be published until you approve it.'],
    quote: { text: entry.message, by: entry.name + ' · ' + relationshipLine(entry) },
    details: [
      ['Email', esc(entry.email)],
      ['Role', entry.role ? esc(entry.role) : none],
      ['Organization', entry.organization ? esc(entry.organization) : none],
      ['LinkedIn', profile(entry.linkedin)],
      ['Facebook', profile(entry.facebook)]
    ],
    button: { label: 'Review this recommendation', url: decisionLink(decideToken) },
    notes: [
      'The link opens a page with Approve and Reject buttons. Nothing changes until you press one and confirm.',
      'The link works for 30 days.'
    ],
    footer: ['You received this email because a recommendation was confirmed on charlescarreon.dev.']
  }, options || {}));
  return { subject: 'Recommendation: ' + entry.name, text: lines.join('\n'), html: html };
}

// The reminder: the same entry again, with a fresh decision link, sent once if the owner
// has not decided after a day.
function buildReminderEmail(entry, decideToken, options) {
  const base = buildOwnerEmail(entry, decideToken, Object.assign({
    preheader: 'Reminder: ' + entry.name + '\'s recommendation is still waiting for your decision.',
    heading: 'Reminder: recommendation awaiting your review',
    intro: ['This is a reminder. ' + entry.name + '\'s recommendation below is still waiting for your decision. It will not be published until you approve it.'],
    notes: [
      'The link opens a page with Approve and Reject buttons. Nothing changes until you press one and confirm.',
      'The link works for 30 days. This is the only reminder for this recommendation.'
    ]
  }, options || {}));
  const lines = [
    'Reminder: this recommendation is still waiting for your decision. It is not public until you approve it.',
    '',
    'Name: ' + entry.name,
    'Email: ' + entry.email,
    'How they know you: ' + relationshipLine(entry),
    '',
    'Recommendation:',
    '',
    entry.message,
    '',
    'Approve or reject it here:',
    decisionLink(decideToken),
    '',
    'The link opens a page with Approve and Reject buttons. Nothing changes until you press one and confirm.',
    'The link works for 30 days. This is the only reminder for this recommendation.'
  ];
  return { subject: base.subject, text: lines.join('\n'), html: base.html };
}

// "3 days" / "5 hours": how long an entry has waited.
function waitingText(ms) {
  const hours = Math.max(0, Math.floor(ms / 3600000));
  if (hours < 48) return hours + (hours === 1 ? ' hour' : ' hours');
  const days = Math.floor(hours / 24);
  return days + ' days';
}

function excerptOf(text, max) {
  const flat = String(text || '').replace(/\s+/g, ' ').trim();
  return flat.length > max ? flat.slice(0, max).replace(/\s+\S*$/, '') + '\u2026' : flat;
}

// The weekly digest: every entry still awaiting a decision, each with its own fresh
// decision link. rows: [{ entry, token, waitedMs }] (oldest first); totals: { awaiting,
// published, hidden }, where awaiting can be larger than the rows listed.
function buildDigestEmail(rows, totals, options) {
  const n = totals.awaiting;
  const more = n - rows.length;
  const adminUrl = BASE_URL + '/admin';
  const subject = 'Weekly digest: ' + n + (n === 1 ? ' recommendation' : ' recommendations') + ' awaiting your review';
  const summary = 'This week ' + n + (n === 1 ? ' recommendation is' : ' recommendations are') +
    ' waiting for your decision. None is public until you approve it.';
  const onSite = 'On the site now: ' + totals.published + ' published, ' + totals.hidden + ' hidden.';
  const items = rows.map(function (r) {
    return {
      title: r.entry.name,
      meta: relationshipLine(r.entry) + ' \u00b7 waiting ' + waitingText(r.waitedMs),
      excerpt: excerptOf(r.entry.message, 160),
      url: decisionLink(r.token)
    };
  });
  const notes = [
    'Each review link opens a page with Approve and Reject buttons. Nothing changes until you press one and confirm.',
    'The review links work for 30 days.'
  ];
  if (more > 0) notes.unshift(more + (more === 1 ? ' more is' : ' more are') + ' waiting and not listed here. They are all on the admin page.');
  const footer = ['You receive this digest on Mondays when at least one recommendation is awaiting your decision.'];
  const html = renderEmail(Object.assign({
    preheader: summary,
    heading: 'Weekly digest',
    intro: [summary, onSite],
    items: items,
    button: { label: 'Open the admin page', url: adminUrl },
    notes: notes,
    footer: footer
  }, options || {}));
  const lines = [summary, onSite, ''];
  rows.forEach(function (r, i) {
    lines.push((i + 1) + '. ' + r.entry.name + ' (' + relationshipLine(r.entry) + ', waiting ' + waitingText(r.waitedMs) + ')');
    lines.push('   ' + excerptOf(r.entry.message, 160));
    lines.push('   Review: ' + decisionLink(r.token));
    lines.push('');
  });
  if (more > 0) lines.push(notes[0], '');
  lines.push('Admin page: ' + adminUrl, '', notes[notes.length - 2], notes[notes.length - 1], '', footer[0]);
  return { subject: subject, text: lines.join('\n'), html: html };
}

module.exports = { buildOwnerEmail, buildReminderEmail, buildDigestEmail, relationshipLine };
