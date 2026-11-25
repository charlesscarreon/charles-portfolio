// Shared settings for the recommendations backend.

const ENV = process.env.VERCEL_ENV || 'local';
const IS_PROD = ENV === 'production';

// Every Redis key starts with this, so preview and local tests never touch real data.
const PREFIX = 'recs:' + ENV + ':';

// Address used in emailed links. If the domain changes, change it here.
const BASE_URL = IS_PROD
  ? 'https://charlescarreon.dev'
  : 'https://' + (process.env.VERCEL_URL || 'localhost:3000');

const FROM = 'Portfolio Recommendations <recommendations@charlescarreon.dev>';

// Field limits (characters).
const LIMITS = {
  name: 80,
  role: 80,
  organization: 100,
  url: 200,
  email: 254,
  messageMin: 50,
  messageMax: 1200,
  maxLinksInMessage: 2
};

// Spam limits. Production values; preview and local are relaxed so testing is easy.
const RATE = {
  perIpPerHour: IS_PROD ? 5 : 50,
  perIpPerDay: IS_PROD ? 10 : 200,
  // New submissions across everyone in 24 hours. Every one sends an email, and the email
  // plan has a daily cap that the owner emails, reminders and digest share.
  siteWidePerDay: IS_PROD ? 30 : 500,
  emailCooldownSeconds: IS_PROD ? 600 : 10,
  // The form carries a signed time stamp from when the page was built. A submission is
  // refused when it arrives sooner than the minimum or later than the maximum.
  formMinSeconds: IS_PROD ? 8 : 1,
  formMaxSeconds: 24 * 60 * 60
};

// The owner gets one reminder per undecided recommendation, this many hours after the
// first email, from the daily job. At most this many reminders go out in one run.
const REMINDER_AFTER_HOURS = 24;
const MAX_REMINDERS_PER_RUN = 20;

// The weekly digest goes out on the daily job's run that falls on this UTC weekday
// (0 = Sunday). The job runs at 23:00 UTC, which is 7 AM Monday in Manila. The digest
// lists at most this many entries; the rest are counted and left for the admin page.
const DIGEST_UTC_DAY = 0;
const MAX_DIGEST_ENTRIES = 15;

// Approve and Reject links in the owner's email work for 30 days.
const DECISION_LINK_TTL_SECONDS = 30 * 24 * 60 * 60;

// Unconfirmed submissions disappear after 48 hours.
const UNCONFIRMED_TTL_SECONDS = 48 * 60 * 60;

// "How do you know Charles?" Options are written for the writer (first person).
// "line" is what visitors see next to the testimony.
const RELATIONSHIPS = {
  classmate: { label: "I was Charles's classmate", line: 'Classmate of Charles' },
  project: { label: 'I worked with Charles on a project or team', line: 'Worked with Charles on a project or team' },
  organization: { label: 'I worked with Charles at the same organization', line: 'Worked with Charles at the same organization' },
  mentor: { label: "I was Charles's teacher or mentor", line: 'Teacher or mentor of Charles' },
  supervisor: { label: "I was Charles's supervisor or manager", line: 'Supervisor or manager of Charles' },
  user: { label: 'I used something Charles built', line: 'Used something Charles built' },
  other: { label: 'Other', line: 'Knows Charles' }
};

module.exports = { ENV, IS_PROD, PREFIX, BASE_URL, FROM, LIMITS, RATE, REMINDER_AFTER_HOURS, MAX_REMINDERS_PER_RUN, DIGEST_UTC_DAY, MAX_DIGEST_ENTRIES, UNCONFIRMED_TTL_SECONDS, DECISION_LINK_TTL_SECONDS, RELATIONSHIPS };
