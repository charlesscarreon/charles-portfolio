// Temporary Phase 1 check for the recommendations backend.
// Writes, reads and deletes one Redis key, then sends one email to the owner.
// Locked by SETUP_TEST_TOKEN. Delete this file and the variable after the check.

const crypto = require('crypto');

function sameToken(given, expected) {
  const a = Buffer.from(String(given || ''));
  const b = Buffer.from(String(expected || ''));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

async function checkRedis(url, token, key) {
  const started = Date.now();
  const res = await fetch(url + '/pipeline', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify([
      ['SET', key, 'hello', 'EX', '60'],
      ['GET', key],
      ['DEL', key]
    ])
  });
  if (!res.ok) return { ok: false, status: res.status };
  const out = await res.json();
  const read = out[1] && out[1].result;
  return { ok: read === 'hello', read: read, ms: Date.now() - started };
}

async function checkEmail(apiKey, to) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Portfolio Recommendations <recommendations@charlescarreon.dev>',
      to: [to],
      subject: 'Portfolio setup check',
      text: 'This is the one-time setup check for the recommendations feature. Redis and Resend are both working. You can delete the test file and SETUP_TEST_TOKEN now.'
    })
  });
  const body = await res.json().catch(function () { return {}; });
  return res.ok ? { ok: true, id: body.id } : { ok: false, status: res.status, message: body.message };
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex');

  const expected = process.env.SETUP_TEST_TOKEN;
  if (!expected) return res.status(503).json({ error: 'SETUP_TEST_TOKEN is not set' });
  if (req.method !== 'GET' || !sameToken(req.query && req.query.token, expected)) {
    return res.status(404).json({ error: 'Not found' });
  }

  const env = process.env.VERCEL_ENV || 'local';
  const result = { environment: env };

  try {
    result.redis = await checkRedis(
      process.env.KV_REST_API_URL,
      process.env.KV_REST_API_TOKEN,
      'recs:' + env + ':setup-test'
    );
  } catch (err) {
    result.redis = { ok: false, error: String(err && err.message) };
  }

  try {
    result.email = await checkEmail(process.env.RESEND_API_KEY, process.env.OWNER_EMAIL);
  } catch (err) {
    result.email = { ok: false, error: String(err && err.message) };
  }

  return res.status(200).json(result);
};
