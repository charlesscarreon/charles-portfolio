#!/usr/bin/env node
"use strict";

/* Preview of the emails the site sends, with invented details. Nothing is sent.
   It uses the real builders from api/_lib, so what you see is what is sent: the
   designed HTML version, the plain-text version and the subject line.
   Run via dev\preview-email.bat, then open http://localhost:8127.
   Pick an email, then switch between a desktop and a phone width. The email has no
   dark-mode code: each mail app shows it in its own default light or dark way.
   Node built-ins only. */

const http = require("http");
const fs = require("fs");
const url = require("url");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PORT = process.env.PORT || 8127;
const { buildOwnerEmail } = require(path.join(ROOT, "api", "_lib", "ownerMail"));
const { buildConfirmEmail } = require(path.join(ROOT, "api", "_lib", "writerMail"));
const esc = require(path.join(ROOT, "api", "_lib", "html")).esc;
const LIVE_LOGO = "https://charlescarreon.dev/images/email-logo.png";

const FULL = {
    name: "Jordan Sample", email: "jordan@example.com", relationship: "project",
    role: "Senior Software Engineer", organization: "Example Corp",
    linkedin: "https://www.linkedin.com/in/jordan-sample", facebook: "https://www.facebook.com/jordan.sample",
    showLinks: "1",
    message: "Charles took the front-end work on our team project and kept it moving when the requirements changed twice in a week.\n\nHe asked good questions early, wrote code that was easy to review, and helped the teammates around him get unstuck. I would gladly work with him again."
};

const EMAILS = {
    "confirm": ["Confirm (to the writer)", function (o) {
        return buildConfirmEmail("Jordan Sample", "https://charlescarreon.dev/api/confirm?token=Zk3v9Qm2sample-token-1234567890abcdef", o);
    }, "jordan@example.com"],
    "owner": ["Decision, links public (to Charles)", function (o) {
        return buildOwnerEmail(FULL, "sample-decision-token-abcdef0123456789", o);
    }, "you@example.com"],
    "owner-private": ["Decision, links private", function (o) {
        return buildOwnerEmail(Object.assign({}, FULL, { showLinks: "0" }), "sample-decision-token-abcdef0123456789", o);
    }, "you@example.com"],
    "owner-minimal": ["Decision, no role, organization or links", function (o) {
        return buildOwnerEmail(Object.assign({}, FULL, { name: "Ana Placeholder", role: "", organization: "", linkedin: "", facebook: "", relationship: "classmate", message: "Reliable, calm under deadlines, and always willing to explain how something works." }), "sample-decision-token-abcdef0123456789", o);
    }, "you@example.com"]
};

const FROM = "Portfolio Recommendations <recommendations@charlescarreon.dev>";

function pageShell(title, body) {
    const dark = false;
    return "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"utf-8\"><title>" + esc(title) + "</title>" +
        "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><style>" +
        "body{font:15px/1.5 system-ui,sans-serif;margin:0;padding:1.5rem;background:" + (dark ? "#0b0d11" : "#e9ecef") + ";color:" + (dark ? "#e6e8ec" : "#1f2937") + "}" +
        "a{color:" + (dark ? "#5eead4" : "#0b5ed7") + "}h1{font-size:1.3rem;margin:0 0 .75rem}" +
        ".bar{display:flex;flex-wrap:wrap;gap:.5rem 1.25rem;margin:0 0 1rem}.bar b{margin-right:.4rem}" +
        ".meta{font-size:.9rem;opacity:.85;margin:0 0 1rem}iframe{display:block;border:0;background:#fff;margin:0 auto;height:900px;max-width:100%;border-radius:8px}" +
        "pre{white-space:pre-wrap;word-break:break-word;background:" + (dark ? "#171a21" : "#fff") + ";padding:1rem;border-radius:8px;max-width:42rem}" +
        "</style></head><body>" + body + "</body></html>";
}

function index() {
    return pageShell("Email preview",
        "<h1>Email preview</h1><p>Invented details, nothing is sent.</p><ul>" +
        Object.keys(EMAILS).map(function (k) {
            return "<li><a href=\"/view/" + k + "\">" + esc(EMAILS[k][0]) + "</a></li>";
        }).join("") + "</ul>");
}

function view(key, width) {
    const mail = EMAILS[key][1]();
    const frameWidth = width === "phone" ? 375 : 640;
    return pageShell(EMAILS[key][0],
        "<p><a href=\"/\">All emails</a></p><h1>" + esc(EMAILS[key][0]) + "</h1>" +
        "<div class=\"bar\"><span><b>Width:</b><a href=\"/view/" + key + "?width=desktop\">desktop</a> · <a href=\"/view/" + key + "?width=phone\">phone</a></span></div>" +
        "<p class=\"meta\"><b>From:</b> " + esc(FROM) + "<br><b>To:</b> " + esc(EMAILS[key][2]) + "<br><b>Subject:</b> " + esc(mail.subject) + "</p>" +
        "<iframe title=\"Email\" style=\"width:" + frameWidth + "px\" src=\"/raw/" + key + "\"></iframe>" +
        "<h2 style=\"font-size:1.05rem;margin:1.5rem 0 .5rem\">Plain-text version (sent beside it)</h2><pre>" + esc(mail.text) + "</pre>");
}

http.createServer(function (req, res) {
    const parsed = url.parse(req.url, true);
    const parts = decodeURIComponent(parsed.pathname).split("/").filter(Boolean);
    const send = function (code, body) { res.writeHead(code, { "Content-Type": "text/html; charset=utf-8" }); res.end(body); };
    if (!parts.length) { return send(200, index()); }
    if (parts[0] === "view" && EMAILS[parts[1]]) {
        return send(200, view(parts[1], parsed.query.width === "phone" ? "phone" : "desktop"));
    }
    if (parts[0] === "raw" && EMAILS[parts[1]]) {
        // Only in this preview: the logo is read from the local file, since the live
        // address it uses in the real emails is not there until the site is deployed.
        return send(200, EMAILS[parts[1]][1]().html.split(LIVE_LOGO).join("/logo.png"));
    }
    if (parts[0] === "logo.png") {
        return fs.readFile(path.join(ROOT, "images", "email-logo.png"), function (err, data) {
            if (err) { return send(404, "Not found"); }
            res.writeHead(200, { "Content-Type": "image/png" });
            res.end(data);
        });
    }
    return send(404, "Not found");
}).listen(PORT, function () {
    console.log("Email preview: http://localhost:" + PORT);
});
