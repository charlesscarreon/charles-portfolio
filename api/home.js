// GET / (rewritten to this function in vercel.json)
// Serves the homepage, with the Recommendations section filled in from the database.
// Any problem at all falls back to the plain template, so the homepage never breaks.
// The page layout comes from homepage.template.html in the project root.

const fs = require('fs');
const path = require('path');
const { loadPublic, homeSelection } = require('./_lib/publicList');
const { renderEntry } = require('./_lib/render');
const config = require('./_lib/config');

const START = '<!-- recommendations:home -->';
const END = '<!-- /recommendations:home -->';
const MAX_CHARS = 450;

function readTemplate() {
  const candidates = [
    path.join(process.cwd(), 'homepage.template.html'),
    path.join(__dirname, '..', 'homepage.template.html')
  ];
  for (let i = 0; i < candidates.length; i++) {
    try { return fs.readFileSync(candidates[i], 'utf8'); } catch (e) { /* try the next path */ }
  }
  return null;
}

const BUTTONS =
  '<p class="recs-write"><a class="btn" href="/recommendations#write">Write a recommendation</a></p>' +
  '<p class="featured-more"><a class="view-all" href="/recommendations">' +
  '<span class="view-all__text">View all recommendations</span>' +
  '<span class="view-all__head" aria-hidden="true"></span></a></p>';

module.exports = async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).send('Method not allowed');
  }

  const template = readTemplate();
  if (!template) {
    console.error('homepage template not found');
    res.status(500).setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.send('The page is unavailable right now.');
  }

  let html = template;
  let cache = 'public, s-maxage=30';
  // Says what the function did, so a plain homepage can be explained. Error details are
  // only included outside production.
  let outcome = 'none';
  try {
    const data = await loadPublic();
    const picks = homeSelection(data);
    const from = template.indexOf(START);
    const to = template.indexOf(END);
    outcome = 'entries=' + data.entries.length + ' featured=' + data.featured.length + ' picks=' + picks.length +
      (from === -1 || to <= from ? ' markers=missing' : '');
    if (picks.length && from !== -1 && to > from) {
      const cards = picks.map(function (e) { return renderEntry(e, { max: MAX_CHARS }); }).join('\n');
      html = template.slice(0, from) + cards + '\n' + BUTTONS + template.slice(to + END.length);
    }
  } catch (error) {
    console.error('homepage recommendations failed:', error && error.message);
    cache = 'no-store';
    outcome = 'error' + (config.IS_PROD ? '' : ': ' + String((error && error.message) || error).slice(0, 120));
  }

  res.status(200);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', cache);
  res.setHeader('X-Recommendations-Home', outcome.replace(/[^\x20-\x7E]/g, ' '));
  return res.send(html);
};
