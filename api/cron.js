// GET /api/cron
// The daily job, called by Vercel's cron schedule (see vercel.json). It only runs when the
// request carries the CRON_SECRET, which Vercel adds on its own once the variable exists.
// It answers with a short count, never with entry details.
// Outside production only, ?minAgeHours=0 skips the 24-hour wait, so it can be tested.

const crypto = require('crypto');
const config = require('./_lib/config');
const reminders = require('./_lib/reminders');

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
  }

  try {
    const result = await reminders.run(options);
    console.log('cron: reminders ' + JSON.stringify(result));
    return send(res, 200, { ok: true, reminders: result });
  } catch (error) {
    console.error('cron failed:', error && error.message);
    return send(res, 500, { ok: false });
  }
};
