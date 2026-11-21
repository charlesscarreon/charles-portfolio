#!/usr/bin/env node
"use strict";

/* Zero-dependency fallback-testing server for local development.
   Serves static files (default: the current project root) but lets you
   simulate failures by stripping tags from HTML responses based on
   query-string flags:
       (none)        -> normal view (CSS + JS present)
       ?css=0        -> "styles.css" link tag removed (no CSS)
       ?js=0         -> external "script.js" tag removed (no JS)
       ?css=0&js=0   -> both removed (full fallback view)
       ?redirect=0   -> automatic redirects removed (meta refresh +
                        inline window.location.replace), revealing the
                        manual fallback content; only meaningful for
                        pages that auto-redirect (e.g. the old site's
                        redirect stubs)
   Set ROOT to serve a different folder, e.g.:
       set ROOT=C:\Projects\personal\charles-old-portfolio
       node dev/test-fallback.js
   Run from the project root via:
       node dev/test-fallback.js
   Uses only Node built-ins (no npm). */

const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const ROOT = process.env.ROOT ? path.resolve(process.env.ROOT) : path.resolve(__dirname, "..");
const PORT = process.env.PORT || 8124;

const MIME = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".ico": "image/x-icon",
    ".txt": "text/plain; charset=utf-8",
    ".xml": "application/xml; charset=utf-8",
    ".webmanifest": "application/manifest+json",
    ".json": "application/json; charset=utf-8"
};

/* Remove only the external stylesheet link and/or the external script.js
   tag from an HTML document. JSON-LD and all other inline/content scripts
   are left untouched. */
function stripTags(html, cssOff, jsOff) {
    if (cssOff) {
        html = html.replace(/<link[^>]*rel\s*=\s*["']stylesheet["'][^>]*>/gi, "");
    }
    if (jsOff) {
        html = html.replace(/<script[^>]*src\s*=\s*["']script\.js["'][^>]*><\/script>/gi, "");
    }
    return html;
}

/* Remove only the automatic redirect mechanisms: any <meta http-equiv=
   "refresh"> and any inline <script>window.location.replace(...)</script>.
   Everything else (JSON-LD, external scripts, the manual fallback link)
   is left untouched. */
function stripRedirect(html) {
    html = html.replace(/<meta[^>]*http-equiv\s*=\s*["']refresh["'][^>]*>/gi, "");
    html = html.replace(/<\s*script[^>]*>\s*window\.location\.replace\([^)]*\)\s*;?\s*<\/script>/gi, "");
    return html;
}

function sendFile(res, filepath, cssOff, jsOff, redirectOff) {
    if (filepath.toLowerCase().endsWith(".html")) {
        let html = fs.readFileSync(filepath, "utf8");
        if (cssOff || jsOff) html = stripTags(html, cssOff, jsOff);
        if (redirectOff) html = stripRedirect(html);
        res.writeHead(200, { "Content-Type": MIME[".html"] });
        res.end(html);
        return;
    }
    const ext = path.extname(filepath).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    fs.createReadStream(filepath).pipe(res);
}

function resolvePath(pathname) {
    /* Turn a URL pathname into an absolute filesystem path inside ROOT. */
    let decoded;
    try {
        decoded = decodeURIComponent(pathname);
    } catch (err) {
        return null;
    }
    if (decoded.includes("\0")) return null;
    const normalized = path.normalize(decoded);
    if (normalized === "\\" || normalized === "/" || normalized === ".") {
        return path.join(ROOT, "index.template.html");
    }
    const full = path.resolve(ROOT, "." + normalized);
    if (full !== ROOT && !full.startsWith(ROOT + path.sep)) {
        return null; /* path escape */
    }
    return full;
}

function isFile(p) {
    try {
        return fs.statSync(p).isFile();
    } catch (err) {
        return false;
    }
}

const server = http.createServer((req, res) => {
    const parsed = url.parse(req.url, true);
    let pathname = parsed.pathname;
    if (!pathname) { pathname = "/"; }

    const cssOff = parsed.query.css === "0";
    const jsOff = parsed.query.js === "0";
    const redirectOff = parsed.query.redirect === "0";

    /* Vercel cleanUrls semantics (flattened site):
       1. A path ending in .html redirects (308) to its clean form,
          so /projects.html -> /projects and /index.html -> /.
       2. Otherwise resolve as-is; if no file, append .html and try
          again (so /projects serves projects.html). */
    if (/\.html$/i.test(pathname)) {
        let clean = pathname.replace(/\.html$/i, "") || "/";
        if (pathname === "/index.html") clean = "/";
        res.writeHead(308, { Location: clean });
        res.end();
        return;
    }

    let target = resolvePath(pathname);
    if (target && isFile(target)) {
        sendFile(res, target, cssOff, jsOff, redirectOff);
        return;
    }

    /* Try appending .html (clean URL -> flat file). */
    let fallback = resolvePath(pathname + ".html");
    if (fallback && isFile(fallback)) {
        sendFile(res, fallback, cssOff, jsOff, redirectOff);
        return;
    }

    /* /recommendations is rendered by a function on Vercel. Locally, serve the template
       (the empty-state version of the page). */
    if (pathname === "/recommendations") {
        let template = resolvePath("/recommendations.template.html");
        if (template && isFile(template)) {
            sendFile(res, template, cssOff, jsOff, redirectOff);
            return;
        }
    }

    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("404 Not Found");
});

server.listen(PORT, () => {
    console.log("Serving " + ROOT + " at http://localhost:" + PORT);
    console.log("Add ?css=0 and/or ?js=0 to see the no-CSS/no-JS views (e.g. http://localhost:" + PORT + "/?css=0&js=0).");
    console.log("Add ?redirect=0 to strip automatic redirects and see the manual fallback content (e.g. http://localhost:" + PORT + "/?redirect=0).");
});
