// Random secrets and hashes. Tokens are stored only as hashes.

const crypto = require('crypto');

function newToken() {
  return crypto.randomBytes(32).toString('base64url');
}

function newId() {
  return crypto.randomBytes(9).toString('base64url');
}

function hashToken(token) {
  return crypto.createHash('sha256').update(String(token)).digest('hex');
}

// Keyed hash, used for IP addresses so the raw address is never stored.
function hmac(value) {
  const secret = process.env.KV_REST_API_TOKEN || 'local-development-only';
  return crypto.createHmac('sha256', secret).update(String(value)).digest('hex');
}

// The form's time stamp: the time the page was built, signed so it cannot be invented.
// Value looks like "1700000000000.<signature>".
function formStamp() {
  const now = String(Date.now());
  return now + '.' + hmac('form:' + now);
}

// Returns the age of a stamp in seconds, or null when it is missing or not genuine.
function formStampAge(value) {
  const parts = String(value || '').split('.');
  if (parts.length !== 2 || !/^\d{10,15}$/.test(parts[0]) || !/^[0-9a-f]{64}$/.test(parts[1])) return null;
  const expected = Buffer.from(hmac('form:' + parts[0]), 'hex');
  const given = Buffer.from(parts[1], 'hex');
  if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) return null;
  return (Date.now() - Number(parts[0])) / 1000;
}

module.exports = { newToken, newId, hashToken, hmac, formStamp, formStampAge };
