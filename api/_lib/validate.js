// Cleans and checks the submitted form fields.

const { LIMITS, RELATIONSHIPS } = require('./config');

// Removes control characters (keeps tab and newline) and trims.
function clean(value) {
  return String(value == null ? '' : value)
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim();
}

// Single-line fields: also collapse any run of whitespace to one space.
function cleanLine(value) {
  return clean(value).replace(/\s+/g, ' ');
}

function isChecked(value) {
  const v = String(value == null ? '' : value).toLowerCase();
  return v === 'on' || v === 'yes' || v === 'true' || v === '1';
}

function hostMatches(host, domain) {
  return host === domain || host.endsWith('.' + domain);
}

// Accepts only https links on the given site. Returns the address or '' if empty;
// returns null if the value is not acceptable.
function cleanProfileUrl(value, domain) {
  const raw = cleanLine(value);
  if (!raw) return '';
  if (raw.length > LIMITS.url) return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : 'https://' + raw;
  let url;
  try { url = new URL(withScheme); } catch (e) { return null; }
  if (url.protocol !== 'https:') return null;
  if (url.username || url.password) return null;
  if (!hostMatches(url.hostname.toLowerCase(), domain)) return null;
  return url.href;
}

function countLinks(text) {
  const matches = text.match(/(https?:\/\/|www\.)\S+/gi);
  return matches ? matches.length : 0;
}

function parseSubmission(body) {
  const errors = [];
  const b = body || {};

  const name = cleanLine(b.name);
  const email = cleanLine(b.email).toLowerCase();
  const role = cleanLine(b.role);
  const organization = cleanLine(b.organization);
  const relationship = cleanLine(b.relationship);
  const message = clean(b.message);

  if (!name) errors.push('Enter your name.');
  else if (name.length > LIMITS.name) errors.push('Your name must be ' + LIMITS.name + ' characters or fewer.');

  if (!email) errors.push('Enter your email address.');
  else if (email.length > LIMITS.email || !/^[^\s@<>",;:]+@[^\s@<>",;:]+\.[^\s@<>",;:]+$/.test(email)) {
    errors.push('Enter a valid email address.');
  }

  if (role.length > LIMITS.role) errors.push('Role must be ' + LIMITS.role + ' characters or fewer.');
  if (organization.length > LIMITS.organization) errors.push('Organization must be ' + LIMITS.organization + ' characters or fewer.');

  if (!Object.prototype.hasOwnProperty.call(RELATIONSHIPS, relationship)) {
    errors.push('Choose how you know Charles.');
  }

  if (message.length < LIMITS.messageMin) {
    errors.push('Your recommendation must be at least ' + LIMITS.messageMin + ' characters.');
  } else if (message.length > LIMITS.messageMax) {
    errors.push('Your recommendation must be ' + LIMITS.messageMax + ' characters or fewer.');
  } else if (countLinks(message) > LIMITS.maxLinksInMessage) {
    errors.push('Your recommendation can contain at most ' + LIMITS.maxLinksInMessage + ' links.');
  }

  const linkedin = cleanProfileUrl(b.linkedin, 'linkedin.com');
  if (linkedin === null) errors.push('The LinkedIn link must be an https address on linkedin.com.');
  const facebook = cleanProfileUrl(b.facebook, 'facebook.com');
  if (facebook === null) errors.push('The Facebook link must be an https address on facebook.com.');

  if (!isChecked(b.consent)) errors.push('Tick the box to agree to publication.');

  return {
    errors: errors,
    value: {
      name: name,
      email: email,
      role: role,
      organization: organization,
      relationship: relationship,
      message: message,
      linkedin: linkedin || '',
      facebook: facebook || '',
      // Only meaningful when at least one link was given.
      showLinks: isChecked(b.show_links) && Boolean(linkedin || facebook)
    }
  };
}

module.exports = { clean, cleanLine, parseSubmission };
