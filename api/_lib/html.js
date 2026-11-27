// Small server-rendered pages that reuse the site stylesheet.
// They work without JavaScript and stay readable if the stylesheet fails.

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// options.wide: a wider column, for the admin lists.
function page(title, innerHtml, options) {
  const wide = options && options.wide;
  return '<!DOCTYPE html>\n' +
    '<html lang="en" data-theme="dark" class="no-js home recommendations">\n' +
    '<head>\n' +
    '<meta charset="utf-8">\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
    '<title>' + esc(title) + ' | Charles S. Carreon</title>\n' +
    '<meta name="robots" content="noindex, nofollow">\n' +
    '<meta name="theme-color" content="#0f1115">\n' +
    '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">\n' +
    '<link rel="icon" type="image/svg+xml" sizes="any" href="/favicon.svg">\n' +
    '<link rel="apple-touch-icon" href="/apple-touch-icon.png">\n' +
    // Same saved theme as the rest of the site, applied before first paint.
    '<script src="/theme-init.js"></script>\n' +
    '<style>\n' +
    'main { max-width: 56rem; margin: 0 auto; padding: 0 1rem 1rem; }\n' +
    'h1, h2, h3 { line-height: 1.25; margin: 1.5rem 0 0.5rem; }\n' +
    'p { margin: 0.75rem 0; }\n' +
    '</style>\n' +
    '<link rel="stylesheet" href="/styles.css">\n' +
    '</head>\n' +
    '<body class="internal">\n' +
    '<header class="internal-bar"><div class="internal-bar__inner">' +
    '<a class="internal-bar__name" href="/">Charles S. Carreon</a>' +
    '<span class="internal-bar__tag">Recommendations</span></div></header>\n' +
    '<main id="main" class="internal-main' + (wide ? ' internal-main--wide' : '') + '">\n' +
    '<div class="card internal-card">\n' +
    innerHtml + '\n' +
    '</div>\n' +
    '<p class="internal-back"><a href="/recommendations">Back to recommendations</a> · <a href="/">Home</a></p>\n' +
    '</main>\n' +
    '</body>\n' +
    '</html>\n';
}

function respond(res, status, title, innerHtml, options) {
  res.status(status);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex');
  return res.send(page(title, innerHtml, options));
}

module.exports = { esc, page, respond };
