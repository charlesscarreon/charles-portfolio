// The owner's backup: every recommendation in all four states, as one JSON object.
// It is meant to be restorable, so it keeps what the writer gave (including the email and
// the private profile links). Only fields on the list below are copied, so a secret that is
// added to an entry later (a token hash, the IP hash, the email service's ids) can never
// leak into a backup by accident. Unconfirmed entries are left out: they are not decided,
// and they expire after 48 hours.

const config = require('./config');
const entries = require('./entries');
const { getFeatured } = require('./publicList');

const FORMAT = 'portfolio-recommendations-backup';
const VERSION = 1;
const STATES = ['awaiting', 'published', 'hidden', 'rejected'];
const MAX_PER_STATE = 5000;

// Stored values are kept exactly as saved (showLinks is '1' or '0').
const FIELDS = [
  'id', 'state', 'createdAt', 'name', 'email', 'role', 'organization', 'relationship', 'message',
  'linkedin', 'facebook', 'showLinks', 'consent', 'consentAt', 'confirmedAt', 'decidedAt',
  'decision', 'publishedAt', 'hiddenAt', 'reminderSentAt'
];

function pick(entry) {
  const out = {};
  FIELDS.forEach(function (key) {
    if (entry[key] !== undefined && entry[key] !== '') out[key] = entry[key];
  });
  return out;
}

async function build() {
  const lists = await Promise.all(STATES.map(function (state) { return entries.list(state, MAX_PER_STATE); }));
  const data = {
    format: FORMAT,
    version: VERSION,
    exportedAt: new Date().toISOString(),
    environment: config.ENV,
    counts: {},
    featured: await getFeatured(),
    entries: {}
  };
  STATES.forEach(function (state, i) {
    data.entries[state] = lists[i].map(pick);
    data.counts[state] = lists[i].length;
  });
  return data;
}

function filename(data) {
  return 'recommendations-backup-' + data.exportedAt.slice(0, 10) + '.json';
}

module.exports = { build, filename };
