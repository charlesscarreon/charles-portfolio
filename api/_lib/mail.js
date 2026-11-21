// Sends one email through Resend (plain fetch, no packages).

const { FROM } = require('./config');

async function sendMail(options) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('Email is not configured');

  const payload = { from: FROM, to: [options.to], subject: options.subject, text: options.text };
  if (options.headers) payload.headers = options.headers;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const body = await res.json().catch(function () { return {}; });
  if (!res.ok) throw new Error('Email request failed with status ' + res.status + ': ' + (body.message || 'no message'));
  return body; // { id }
}

module.exports = { sendMail };
