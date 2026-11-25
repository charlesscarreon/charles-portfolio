// The repo snapshot: a saved copy of the public recommendations, shown when the database
// cannot be reached. It holds only what the website shows publicly (never an email, a
// private link or a token). dev\make-snapshot.bat rewrites it from a backup downloaded
// from /admin. The JSON file sits beside this one so Vercel bundles it with the functions.

const FORMAT = 'portfolio-recommendations-snapshot';

let saved = null;
try {
  saved = require('./recommendations-snapshot.json');
} catch (e) {
  saved = null;
}

// { entries, featured }, or null when there is no usable snapshot (missing, broken or empty).
function loadSnapshot() {
  if (!saved || saved.format !== FORMAT || !Array.isArray(saved.entries)) return null;
  const entries = saved.entries.filter(function (e) {
    return e && typeof e.id === 'string' && typeof e.name === 'string' && typeof e.message === 'string';
  });
  if (!entries.length) return null;
  return { entries: entries, featured: Array.isArray(saved.featured) ? saved.featured : [] };
}

module.exports = { loadSnapshot, FORMAT };
