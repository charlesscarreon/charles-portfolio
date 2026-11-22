// Shared HTML for a published recommendation, used by the recommendations page and the homepage.

const { esc } = require('./html');

function formatDate(iso) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

function paragraphs(text) {
  return String(text).split(/\n{2,}/).map(function (block) {
    return '<p>' + esc(block.trim()).replace(/\n/g, '<br>') + '</p>';
  }).join('');
}

// Cuts at a word boundary and adds an ellipsis.
function shorten(text, max) {
  const t = String(text);
  if (t.length <= max) return { text: t, cut: false };
  const part = t.slice(0, max);
  const space = part.lastIndexOf(' ');
  return { text: (space > max * 0.6 ? part.slice(0, space) : part).replace(/[\s.,;:!?-]+$/, '') + '…', cut: true };
}

// Up to two capital letters for the avatar: the first letters of the first and
// last words of the name.
function initials(name) {
  const words = String(name).trim().split(/\s+/).filter(Boolean);
  if (!words.length) return '';
  const first = Array.from(words[0])[0] || '';
  const last = words.length > 1 ? (Array.from(words[words.length - 1])[0] || '') : '';
  return (first + last).toUpperCase();
}

// options.max: shorten the message to this many characters and link to the full page.
function renderEntry(e, options) {
  const opts = options || {};
  const short = opts.max ? shorten(e.message, opts.max) : { text: e.message, cut: false };
  const who = [e.role, e.organization].filter(Boolean).map(esc).join(', ');
  const date = formatDate(e.publishedAt);
  const links = (e.links || []).map(function (l) {
    return '<a href="' + esc(l.url) + '" rel="noopener noreferrer">' + esc(l.label) + '</a>';
  });
  if (short.cut) links.push('<a href="/recommendations#r-' + esc(e.id) + '">Read the full recommendation</a>');
  const orgLine = who ? '<span class="recommendation__role">' + who + '</span><br>' : '';
  return '<article class="card recommendation" id="r-' + esc(e.id) + '">' +
    '<blockquote class="recommendation__text">' + paragraphs(short.text) + '</blockquote>' +
    '<div class="recommendation__author">' +
    '<span class="recommendation__avatar" aria-hidden="true">' + esc(initials(e.name)) + '</span>' +
    '<p class="recommendation__who"><strong>' + esc(e.name) + '</strong><br>' +
    orgLine +
    '<span class="recommendation__line">' + esc(e.line) + '</span></p>' +
    (date ? '<time class="recommendation__date" datetime="' + esc(String(e.publishedAt).slice(0, 10)) + '">' + date + '</time>' : '') +
    '</div>' +
    (links.length ? '<p class="recommendation__links">' + links.join(' · ') + '</p>' : '') +
    '</article>';
}

module.exports = { renderEntry, initials };
