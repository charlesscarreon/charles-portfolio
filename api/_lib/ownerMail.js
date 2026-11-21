// Builds the email the owner receives when a writer has confirmed a recommendation.
// It shows everything, including the private profile links, plus the decision links.

const { RELATIONSHIPS, BASE_URL } = require('./config');

function decisionLink(token) {
  return BASE_URL + '/api/decide?token=' + encodeURIComponent(token);
}

function relationshipLine(entry) {
  const r = RELATIONSHIPS[entry.relationship];
  return r ? r.line : 'Knows Charles';
}

function buildOwnerEmail(entry, decideToken) {
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
  return { subject: 'Recommendation: ' + entry.name, text: lines.join('\n') };
}

module.exports = { buildOwnerEmail, relationshipLine };
