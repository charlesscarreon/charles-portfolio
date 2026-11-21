#!/usr/bin/env node
"use strict";

/* Zero-dependency static server for local development.
   Mirrors the deployed Vercel behavior (cleanUrls): /
   maps to index.html, clean paths like /projects serve
   projects.html, and .html paths redirect to their clean
   equivalent. Run from the project root via:
       node dev/serve.js
   Uses only Node built-ins (no npm). */

const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const ROOT = path.resolve(__dirname, "..");
const PORT = process.env.PORT || 8123;

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

function sendFile(res, filepath) {
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
    const parsed = url.parse(req.url);
    let pathname = parsed.pathname;
    if (!pathname) { pathname = "/"; }

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
        sendFile(res, target);
        return;
    }

    /* Try appending .html (clean URL -> flat file). */
    let fallback = resolvePath(pathname + ".html");
    if (fallback && isFile(fallback)) {
        sendFile(res, fallback);
        return;
    }

    /* /recommendations is rendered by a function on Vercel. Locally, serve the template
       (the empty-state version of the page). */
    if (pathname === "/recommendations") {
        let template = resolvePath("/recommendations.template.html");
        if (template && isFile(template)) {
            sendFile(res, template);
            return;
        }
    }

    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("404 Not Found");
});

server.listen(PORT, () => {
    console.log("Serving " + ROOT + " at http://localhost:" + PORT);
});
