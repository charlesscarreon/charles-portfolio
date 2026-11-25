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

module.exports = { buildOwnerEmail, buildReminderEmail, relationshipLine };
