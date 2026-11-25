// POST /api/submit
// Receives the recommendation form, stores it as "unconfirmed", and emails the writer
// a link to confirm they wrote it. Nothing is published or sent to the owner here.

const config = require('./_lib/config');
const redis = require('./_lib/redis');
const { sendMail } = require('./_lib/mail');
const { buildConfirmEmail } = require('./_lib/writerMail');
const tokens = require('./_lib/tokens');
const { esc, respond } = require('./_lib/html');
const { parseSubmission } = require('./_lib/validate');

function readBody(req) {
  const body = req.body;
  if (body && typeof body === 'object' && !Buffer.isBuffer(body)) return body;
  if (typeof body === 'string') return Object.fromEntries(new URLSearchParams(body));
  return {};
}

function clientIp(req) {
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return forwarded || (req.socket && req.socket.remoteAddress) || 'unknown';
}

function thanksPage(res) {
  return respond(res, 200, 'Check your email',
    '<h1>Check your email</h1>' +
    '<p>If the address you entered is valid, a message with a confirmation link is on its way. ' +
    'Open it and confirm that you wrote this recommendation. Until you do, nothing is shared.</p>' +
    '<p>The link works for 48 hours. If nothing arrives, check your spam folder.</p>' +
    // Leaves a note in this browser tab so the form page empties itself if the back button
    // brings it back with the old text (see script.js, initFormClear).
    '<script>try{sessionStorage.setItem("recs-sent","1")}catch(e){}</script>');
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return respond(res, 405, 'Not allowed', '<h1>Not allowed</h1><p>This address only accepts the recommendation form.</p>');
  }

  try {
    const body = readBody(req);

    // Hidden "website" field: real people leave it empty. Pretend success for bots.
    if (String(body.website || '').trim() !== '') return thanksPage(res);

    // The signed time stamp the page put in the form: refuses posts that never loaded the
    // page, that came back instantly, or that are more than a day old. Skipped only when
    // running locally from the plain template, which has no stamp.
    if (config.ENV !== 'local') {
      const age = tokens.formStampAge(body.ts);
      if (age === null || age < config.RATE.formMinSeconds || age > config.RATE.formMaxSeconds) {
        return respond(res, 400, 'Please reload the form',
          '<h1>Please reload the form</h1>' +
          '<p>This form could not be checked, or it was sent too quickly or too long after it was opened. ' +
          'Reload the page, fill it in again and submit. Nothing was sent.</p>');
      }
    }

    const parsed = parseSubmission(body);
    if (parsed.errors.length) {
      const items = parsed.errors.map(function (e) { return '<li>' + esc(e) + '</li>'; }).join('');
      return respond(res, 400, 'Please check the form',
        '<h1>Please check the form</h1><ul>' + items + '</ul>' +
        '<p>Use your browser\'s back button to fix these and try again.</p>');
    }
    const v = parsed.value;

    // Throttling: per IP per hour and per day, one submission per email per cooldown, and a
    // site-wide daily total. The site-wide count only grows for submissions that passed
    // the other checks, so one noisy visitor cannot use up everyone's allowance.
    const ipHash = tokens.hmac(clientIp(req));
    const ipKey = config.PREFIX + 'rl:ip:' + ipHash;
    const ipDayKey = config.PREFIX + 'rl:ipday:' + ipHash;
    const siteKey = config.PREFIX + 'rl:site:day';
    const emailKey = config.PREFIX + 'rl:email:' + tokens.hmac(v.email);
    const limits = await redis.pipeline([
      ['INCR', ipKey],
      ['EXPIRE', ipKey, '3600', 'NX'],
      ['INCR', ipDayKey],
      ['EXPIRE', ipDayKey, '86400', 'NX'],
      ['SET', emailKey, '1', 'NX', 'EX', String(config.RATE.emailCooldownSeconds)]
    ]);
    if (limits[0] > config.RATE.perIpPerHour || limits[2] > config.RATE.perIpPerDay) {
      return respond(res, 429, 'Too many attempts', '<h1>Too many attempts</h1><p>Please try again later.</p>');
    }
    if (limits[4] === null) {
      // Same email submitted very recently. Same generic page, no new email.
      return thanksPage(res);
    }
    const site = await redis.pipeline([
      ['INCR', siteKey],
      ['EXPIRE', siteKey, '86400', 'NX']
    ]);
    if (site[0] > config.RATE.siteWidePerDay) {
      // Over the daily total: free the email's cooldown so they can try again later.
      await redis.pipeline([['DEL', emailKey]]).catch(function () {});
      return respond(res, 429, 'Too many attempts', '<h1>Too many attempts</h1><p>Please try again later.</p>');
    }

    const id = tokens.newId();
    const confirmToken = tokens.newToken();
    const entryKey = config.PREFIX + 'entry:' + id;
    const confirmKey = config.PREFIX + 'confirm:' + tokens.hashToken(confirmToken);
    const ttl = String(config.UNCONFIRMED_TTL_SECONDS);

    await redis.pipeline([
      ['HSET', entryKey,
        'id', id,
        'state', 'unconfirmed',
        'createdAt', new Date().toISOString(),
        'name', v.name,
        'email', v.email,
        'role', v.role,
        'organization', v.organization,
        'relationship', v.relationship,
        'message', v.message,
        'linkedin', v.linkedin,
        'facebook', v.facebook,
        'showLinks', v.showLinks ? '1' : '0',
        'consent', '1',
        'consentAt', new Date().toISOString(),
        'ipHash', ipHash,
        'confirmHash', tokens.hashToken(confirmToken)],
      ['EXPIRE', entryKey, ttl],
      ['SET', confirmKey, id, 'EX', ttl]
    ]);

    const link = config.BASE_URL + '/api/confirm?token=' + encodeURIComponent(confirmToken);
    try {
      const mail = buildConfirmEmail(v.name, link);
      await sendMail({ to: v.email, subject: mail.subject, text: mail.text, html: mail.html });
    } catch (mailError) {
      // Remove the entry so a failed send leaves nothing behind.
      await redis.pipeline([['DEL', entryKey], ['DEL', confirmKey], ['DEL', emailKey], ['DECR', siteKey]]).catch(function () {});
      throw mailError;
    }

    return thanksPage(res);
  } catch (error) {
    console.error('submit failed:', error && error.message);
    return respond(res, 500, 'Something went wrong',
      '<h1>Something went wrong</h1><p>Your recommendation was not submitted. Please try again in a few minutes.</p>');
  }
};
