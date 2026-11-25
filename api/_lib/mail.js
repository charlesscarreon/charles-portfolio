// Sends one email through Resend (plain fetch, no packages).

const { FROM } = require('./config');

async function sendMail(options) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('Email is not configured');

  const payload = { from: FROM, to: [options.to], subject: options.subject, text: options.text };
  // The plain-text part is always sent. The designed HTML part is added when given.
  if (options.html) payload.html = options.html;
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

// Looks up an email already sent, by the id Resend gave back. Used to read the real
// Message-ID so a reminder can reply in the same thread.
async function getEmail(id) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('Email is not configured');
  const res = await fetch('https://api.resend.com/emails/' + encodeURIComponent(id), {
    headers: { Authorization: 'Bearer ' + key }
  });
  const body = await res.json().catch(function () { return {}; });
  if (!res.ok) throw new Error('Email lookup failed with status ' + res.status + ': ' + (body.message || 'no message'));
  return body;
}

module.exports = { sendMail, getEmail };
