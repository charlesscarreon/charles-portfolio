// GET /api/cron
// The daily job (23:00 UTC, which is 7 AM in Manila), called by Vercel's cron schedule (see vercel.json). It only runs when the
// request carries the CRON_SECRET, which Vercel adds on its own once the variable exists.
// It answers with a short count, never with entry details.
// On the run that falls on the digest weekday (Sunday UTC, Monday morning in Manila) it
// also sends the weekly digest.
// Outside production only, ?minAgeHours=0 skips the 24-hour wait and ?digest=1 sends the
// digest on any day, so both can be tested.

const crypto = require('crypto');
const config = require('./_lib/config');
const reminders = require('./_lib/reminders');
const digest = require('./_lib/digest');

function send(res, status, body) {
  res.status(status);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  return res.send(JSON.stringify(body));
}

// Compares the sent header with the expected one without revealing where they differ.
function authorised(req) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const given = crypto.createHash('sha256').update(String(req.headers.authorization || '')).digest();
  const expected = crypto.createHash('sha256').update('Bearer ' + secret).digest();
  return crypto.timingSafeEqual(given, expected);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return send(res, 405, { ok: false });
  }
  if (!authorised(req)) return send(res, 401, { ok: false });

  const options = {};
  if (!config.IS_PROD) {
    const q = req.query && req.query.minAgeHours;
    const value = Number(Array.isArray(q) ? q[0] : q);
    if (q !== undefined && Number.isFinite(value) && value >= 0) options.minAgeHours = value;
    const d = req.query && req.query.digest;
    options.forceDigest = (Array.isArray(d) ? d[0] : d) === '1';
  }

  // Each job runs on its own, so a failure in one does not stop the other.
  const body = { ok: true };
  let failed = false;
  try {
    body.reminders = await reminders.run(options);
    console.log('cron: reminders ' + JSON.stringify(body.reminders));
  } catch (error) {
    console.error('cron reminders failed:', error && error.message);
    failed = true;
  }
  if (options.forceDigest || new Date().getUTCDay() === config.DIGEST_UTC_DAY) {
    try {
      body.digest = await digest.run();
      console.log('cron: digest ' + JSON.stringify(body.digest));
    } catch (error) {
      console.error('cron digest failed:', error && error.message);
      failed = true;
    }
  }
  if (failed) return send(res, 500, { ok: false });
  return send(res, 200, body);
};
