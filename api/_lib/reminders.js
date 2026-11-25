// The daily reminder job: one email per recommendation that is still undecided a day
// after the owner was first emailed. The reminder replies in the same email thread when
// the original's real Message-ID can be read back from the email service.

const config = require('./config');
const redis = require('./redis');
const tokens = require('./tokens');
const { sendMail, getEmail } = require('./mail');
const { buildReminderEmail } = require('./ownerMail');

const P = config.PREFIX;

// The real Message-ID of the owner's first email, or '' when it cannot be read.
async function threadId(entry) {
  if (!entry.ownerMailId) return '';
  try {
    const found = await getEmail(entry.ownerMailId);
    const id = found && found.message_id ? String(found.message_id).trim() : '';
    if (!id) {
      console.error('reminder: no message_id in the email lookup; fields found: ' +
        Object.keys(found || {}).join(','));
      return '';
    }
    return id.charAt(0) === '<' ? id : '<' + id + '>';
  } catch (error) {
    console.error('reminder: email lookup failed:', error && error.message);
    return '';
  }
}

// options.minAgeHours overrides the 24-hour wait (the route allows it outside production).
async function run(options) {
  const minAge = options && typeof options.minAgeHours === 'number'
    ? options.minAgeHours : config.REMINDER_AFTER_HOURS;
  const cutoff = Date.now() - minAge * 60 * 60 * 1000;
  const result = { checked: 0, sent: 0, skipped: 0, failed: 0 };
  const owner = process.env.OWNER_EMAIL;
  if (!owner) throw new Error('OWNER_EMAIL is not set');

  // The "awaiting" list is scored by the time the writer confirmed.
  const ids = await redis.command('ZRANGEBYSCORE', P + 'awaiting', '-inf', String(cutoff));
  for (let i = 0; i < (ids || []).length && result.sent < config.MAX_REMINDERS_PER_RUN; i += 1) {
    const id = ids[i];
    const entryKey = P + 'entry:' + id;
    const entry = await redis.hgetall(entryKey);
    result.checked += 1;
    // Only entries still awaiting, never reminded, whose first owner email really went out.
    if (!entry.id || entry.state !== 'awaiting' || entry.reminderSentAt ||
        entry.ownerMailFailed === '1' || !entry.ownerMailId) {
      result.skipped += 1;
      continue;
    }
    try {
      // A new decision link: the first one is stored only as a hash. The first link keeps working.
      const decideToken = tokens.newToken();
      const decideHash = tokens.hashToken(decideToken);
      const mail = buildReminderEmail(entry, decideToken);
      const message = await threadId(entry);
      const headers = message ? { 'In-Reply-To': message, 'References': message } : undefined;
      const subject = message ? 'Re: ' + mail.subject : 'Reminder: ' + mail.subject;
      await sendMail({ to: owner, subject: subject, text: mail.text, html: mail.html, headers: headers });
      await redis.pipeline([
        ['SET', P + 'decide:' + decideHash, id, 'EX', String(config.DECISION_LINK_TTL_SECONDS)],
        ['HSET', entryKey, 'reminderSentAt', new Date().toISOString(), 'reminderDecideHash', decideHash]
      ]);
      result.sent += 1;
    } catch (error) {
      console.error('reminder failed:', error && error.message);
      result.failed += 1;
    }
    // A short pause keeps well inside the email service's request rate.
    await new Promise(function (resolve) { setTimeout(resolve, 600); });
  }
  return result;
}

module.exports = { run };
