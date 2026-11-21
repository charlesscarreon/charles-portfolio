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

module.exports = { newToken, newId, hashToken, hmac };
