// Owner login. The secret lives in the ADMIN_SECRET environment variable. After a correct
// login the browser gets a signed cookie that lasts 5 days. Nothing is stored on the server,
// and changing ADMIN_SECRET signs every browser out.

const crypto = require('crypto');
const config = require('./config');

const SESSION_SECONDS = 5 * 24 * 60 * 60;

function secret() { return process.env.ADMIN_SECRET || ''; }

function configured() { return secret().length >= 16; }

function sign(expires) {
  return crypto.createHmac('sha256', secret()).update('admin-session:' + expires).digest('hex');
}

function safeEqual(a, b) {
  const x = crypto.createHash('sha256').update(String(a)).digest();
  const y = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(x, y);
}

function secretMatches(input) {
  return configured() && safeEqual(input, secret());
}

function readCookie(req, name) {
  const header = String((req.headers && req.headers.cookie) || '');
  const parts = header.split(';');
  for (let i = 0; i < parts.length; i++) {
    const idx = parts[i].indexOf('=');
    if (idx > 0 && parts[i].slice(0, idx).trim() === name) return parts[i].slice(idx + 1).trim();
  }
  return '';
}

function isAuthed(req) {
  if (!configured()) return false;
  const bits = readCookie(req, 'admin').split('.');
  if (bits.length !== 3 || bits[0] !== 'v1') return false;
  const expires = Number(bits[1]);
  if (!(expires > Date.now())) return false;
  return safeEqual(bits[2], sign(bits[1]));
}

function cookieFlags() {
  return 'Path=/; HttpOnly; SameSite=Strict;' + (config.ENV === 'production' || config.ENV === 'preview' ? ' Secure;' : '');
}

function sessionCookie() {
  const expires = Date.now() + SESSION_SECONDS * 1000;
  return 'admin=v1.' + expires + '.' + sign(expires) + '; ' + cookieFlags() + ' Max-Age=' + SESSION_SECONDS;
}

function clearCookie() {
  return 'admin=; ' + cookieFlags() + ' Max-Age=0';
}

// A POST from another site is refused. SameSite=Strict already keeps the cookie off such requests.
function sameOrigin(req) {
  const origin = req.headers && req.headers.origin;
  if (!origin) return true;
  try { return new URL(origin).host === req.headers.host; } catch (e) { return false; }
}

module.exports = { configured, secretMatches, isAuthed, sessionCookie, clearCookie, sameOrigin };
