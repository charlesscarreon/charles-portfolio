// GET /recommendations (rewritten to this function in vercel.json)
// Serves the recommendations page with the approved testimonies written into the HTML,
// so it reads fully with no JavaScript and no CSS.
// The page layout comes from recommendations.template.html in the project root.

const fs = require('fs');
const path = require('path');
const { esc } = require('./_lib/html');
const { loadPublic } = require('./_lib/publicList');

const START = '<!-- recommendations:list -->';
const END = '<!-- /recommendations:list -->';

function readTemplate() {
  const candidates = [
    path.join(process.cwd(), 'recommendations.template.html'),
    path.join(__dirname, '..', 'recommendations.template.html')
  ];
  for (let i = 0; i < candidates.length; i++) {
    try { return fs.readFileSync(candidates[i], 'utf8'); } catch (e) { /* try the next path */ }
  }
  return null;
}

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

function renderEntry(e) {
  const who = [e.role, e.organization].filter(Boolean).map(esc).join(', ');
  const date = formatDate(e.publishedAt);
  const links = (e.links || []).map(function (l) {
    return '<a href="' + esc(l.url) + '" rel="noopener noreferrer">' + esc(l.label) + '</a>';
  }).join(' · ');
  return '<article class="card recommendation">' +
    '<blockquote class="recommendation__text">' + paragraphs(e.message) + '</blockquote>' +
    '<p class="recommendation__author"><strong>' + esc(e.name) + '</strong>' +
    (who ? '<br>' + who : '') +
    '<br>' + esc(e.line) +
    (date ? '<br><time datetime="' + esc(String(e.publishedAt).slice(0, 10)) + '">' + date + '</time>' : '') +
    '</p>' +
    (links ? '<p class="recommendation__links">' + links + '</p>' : '') +
    '</article>';
}

function renderList(list) {
  return '<section class="section" aria-label="Published recommendations">' +
    '<h2 class="visually-hidden">Published recommendations</h2>' +
    list.map(renderEntry).join('\n') +
    '</section>';
}

function renderUnavailable() {
  return '<section class="section" aria-label="Published recommendations">' +
    '<div class="card empty-state">' +
    '<p class="empty-state__title">Recommendations could not be loaded right now.</p>' +
    '<p>Please try again in a few minutes.</p>' +
    '</div></section>';
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).send('Method not allowed');
  }

  const template = readTemplate();
  if (!template) {
    console.error('recommendations template not found');
    res.status(500).setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.send('The page is unavailable right now.');
  }

  let list = [];
  let loaded = true;
  try {
    list = await loadPublic();
  } catch (error) {
    console.error('loading recommendations failed:', error && error.message);
    loaded = false;
  }

  const from = template.indexOf(START);
  const to = template.indexOf(END);
  let html = template;
  if (from !== -1 && to !== -1 && to > from) {
    let replacement = null;
    if (!loaded) replacement = renderUnavailable();
    else if (list.length) replacement = renderList(list);
    // An empty, loaded list keeps the template's own empty state.
    if (replacement !== null) html = template.slice(0, from) + replacement + template.slice(to + END.length);
  }

  res.status(200);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  // A short shared cache keeps the page fast and the database reads low. A copy is never
  // served more than 30 seconds old, so an approval shows up within about half a minute.
  // Errors are never cached.
  res.setHeader('Cache-Control', loaded ? 'public, s-maxage=30' : 'no-store');
  return res.send(html);
};
