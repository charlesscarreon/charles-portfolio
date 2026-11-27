// GET / (rewritten to this function in vercel.json)
// Serves the homepage, with the Recommendations section filled in from the database.
// Any problem at all falls back to the plain template, so the homepage never breaks.
// The page layout comes from homepage.template.html in the project root.

const fs = require('fs');
const path = require('path');
const { loadPublic, homeSelection } = require('./_lib/publicList');
const { loadSnapshot } = require('./_lib/snapshot');
const { renderHomeSection } = require('./_lib/render');
const config = require('./_lib/config');

const START = '<!-- recommendations:home -->';
const END = '<!-- /recommendations:home -->';

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
    let data;
    let fromSnapshot = false;
    try {
      data = await loadPublic();
    } catch (error) {
      // The database is down: use the saved copy from the repo if there is one.
      data = loadSnapshot();
      if (!data) throw error;
      fromSnapshot = true;
      cache = 'public, s-maxage=10';
      console.error('homepage: showing the repo snapshot after:', error && error.message);
    }
    const picks = homeSelection(data);
    const from = template.indexOf(START);
    const to = template.indexOf(END);
    outcome = 'entries=' + data.entries.length + ' featured=' + data.featured.length + ' picks=' + picks.length +
      (from === -1 || to <= from ? ' markers=missing' : '') + (fromSnapshot ? ' snapshot=1' : '');
    if (picks.length && from !== -1 && to > from) {
      html = template.slice(0, from) + renderHomeSection(picks) + template.slice(to + END.length);
    }
  } catch (error) {
    console.error('homepage recommendations failed:', error && error.message);
    cache = 'no-store';
    outcome = 'error' + (config.IS_PROD ? '' : ': ' + String((error && error.message) || error).slice(0, 120));
  }

  res.status(200);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', cache);
  /* A debugging aid for previews only; production does not publish the counts. */
  if (!config.IS_PROD) {
    res.setHeader('X-Recommendations-Home', outcome.replace(/[^\x20-\x7E]/g, ' '));
  }
  return res.send(html);
};
