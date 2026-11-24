// GET /recommendations (rewritten to this function in vercel.json)
// Serves the recommendations page with the approved testimonies written into the HTML,
// so it reads fully with no JavaScript and no CSS.
// The page layout comes from recommendations.template.html in the project root.

const fs = require('fs');
const path = require('path');
const { renderEntry } = require('./_lib/render');
const { loadPublic } = require('./_lib/publicList');
const tokens = require('./_lib/tokens');

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

function renderList(list) {
  return '<section class="section" aria-label="Published recommendations">' +
    '<h2 class="visually-hidden">Published recommendations</h2>' +
    list.map(function (e) { return renderEntry(e); }).join('\n') +
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
    list = (await loadPublic()).entries;
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

  // The form's signed time stamp (see tokens.js). Without script or styles it still works.
  html = html.replace('name="ts" value=""', 'name="ts" value="' + tokens.formStamp() + '"');

  res.status(200);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  // A short shared cache keeps the page fast and the database reads low. A copy is never
  // served more than 30 seconds old, so an approval shows up within about half a minute.
  // Errors are never cached.
  res.setHeader('Cache-Control', loaded ? 'public, s-maxage=30' : 'no-store');
  return res.send(html);
};
