#!/usr/bin/env node
"use strict";

/* Preview of the internal pages (admin, approve or reject, confirm) with invented
   data. It renders the real page shell and markup from api/_lib on the real
   stylesheet, so what you see is what the site shows. Nothing is sent or stored.
   Run via dev\previews\preview-internal.bat, then open http://localhost:8126.
   Add ?theme=light for the light theme. Node built-ins only. */

const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const ROOT = path.resolve(__dirname, "..", "..");
const PORT = process.env.PORT || 8126;
const html = require(path.join(ROOT, "api", "_lib", "html"));
const pages = require(path.join(ROOT, "api", "_lib", "pages"));

const MIME = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".webp": "image/webp",
    ".ico": "image/x-icon"
};

function sample(id, name, extra) {
    return Object.assign({
        id: id, name: name, email: "sample@example.com",
        role: "Senior Software Engineer", organization: "Example Corp",
        relationshipLine: "Worked with Charles on a project or team",
        linkedin: "https://example.com/in/" + id, facebook: "", showLinks: "1",
        message: "Charles took the front-end work on our team project and kept it moving when the requirements changed twice in a week.\n\nHe asked good questions early and wrote code that was easy to review.",
        createdAt: "2026-11-20T08:00:00Z", confirmedAt: "2026-11-20T09:00:00Z"
    }, extra || {});
}

const A = sample("a1", "Jordan Sample");
const B = sample("b2", "Ana Placeholder", { role: "", organization: "", relationshipLine: "Classmate of Charles", linkedin: "https://example.com/in/ana", facebook: "https://example.com/ana", showLinks: "0", message: "Reliable and calm under deadlines." });
const C = sample("c3", "Dr. Riley Example", { role: "Instructor", organization: "Sample University", relationshipLine: "Teacher or mentor of Charles", publishedAt: "2026-10-30T08:00:00Z" });
const D = sample("d4", "Sam Hidden", { publishedAt: "2026-10-01T08:00:00Z" });
const F = sample("f6", "Pat Published", { relationshipLine: "Classmate of Charles", publishedAt: "2026-10-15T08:00:00Z" });
const E = sample("e5", "Lee Rejected", { relationshipLine: "Knows Charles" });

const dashboard = {
    awaiting: [A, B], published: [C, F], hidden: [D], rejected: [E],
    featured: [C], featuredIds: ["c3"], maxFeatured: 3, note: ""
};

const PAGES = {
    "admin": ["Admin", function () { return pages.dashboardPage(dashboard); }, { wide: true }],
    "admin-empty": ["Admin (empty)", function () {
        return pages.dashboardPage({ awaiting: [], published: [], hidden: [], rejected: [], featured: [], featuredIds: [], maxFeatured: 3, note: "" });
    }, { wide: true }],
    "admin-note": ["Admin (note)", function () {
        return pages.dashboardPage(Object.assign({}, dashboard, { note: "The top 3 is full. Remove one first, then feature this one." }));
    }, { wide: true }],
    "login": ["Admin login", function () { return pages.loginPage(""); }],
    "login-error": ["Admin login (error)", function () { return pages.loginPage("That secret is not correct."); }],
    "delete": ["Delete?", function () { return pages.deletePage(A); }],
    "decide": ["Approve or reject", function () { return pages.decidePage(A, "sample-token"); }],
    "decide-sure-approve": ["Are you sure (approve)", function () { return pages.decideSurePage(A, "t", "approve", "/decide"); }],
    "decide-sure-reject": ["Are you sure (reject)", function () { return pages.decideSurePage(A, "t", "reject", "/decide"); }],
    "approved": ["Approved", function () { return pages.decideDonePage(true); }],
    "rejected": ["Rejected", function () { return pages.decideDonePage(false); }],
    "already-decided": ["Already decided", function () { return pages.alreadyDecidedPage(Object.assign({}, A, { state: "published", decidedAt: "2026-11-21" })); }],
    "decide-invalid": ["Link not valid (owner)", function () { return pages.invalidDecidePage(); }],
    "confirm": ["Confirm", function () { return pages.confirmPage(A, "sample-token"); }],
    "confirmed": ["Confirmed", function () { return pages.confirmedPage(); }],
    "already-confirmed": ["Already confirmed", function () { return pages.alreadyConfirmedPage(); }],
    "confirm-invalid": ["Link not valid (writer)", function () { return pages.invalidConfirmPage(); }],
    "error": ["Something went wrong", function () { return pages.messagePage("warn", "Something went wrong", "Please try again."); }]
};

function index() {
    return "<!DOCTYPE html><meta charset=\"utf-8\"><title>Internal pages preview</title>" +
        "<body style=\"font:16px system-ui;max-width:36rem;margin:2rem auto;padding:0 1rem\">" +
        "<h1>Internal pages preview</h1><p>Invented data, nothing is sent. Add <code>?theme=light</code> for the light theme.</p><ul>" +
        Object.keys(PAGES).map(function (k) {
            return "<li><a href=\"/" + k + "\">" + PAGES[k][0] + "</a> (<a href=\"/" + k + "?theme=light\">light</a>)</li>";
        }).join("") + "</ul>";
}

http.createServer(function (req, res) {
    const parsed = url.parse(req.url, true);
    const pathname = decodeURIComponent(parsed.pathname);
    const key = pathname.slice(1);
    if (pathname === "/") {
        res.writeHead(200, { "Content-Type": MIME[".html"] });
        res.end(index());
        return;
    }
    if (PAGES[key]) {
        let out = html.page(PAGES[key][0], PAGES[key][1](), PAGES[key][2]);
        if (parsed.query.theme === "light") {
            out = out.replace("data-theme=\"dark\"", "data-theme=\"light\"");
        }
        res.writeHead(200, { "Content-Type": MIME[".html"] });
        res.end(out);
        return;
    }
    const file = path.join(ROOT, pathname);
    if (file.indexOf(ROOT) !== 0 || pathname.indexOf("/dev/") === 0 || pathname.indexOf("/api/") === 0) {
        res.writeHead(404); res.end("Not found"); return;
    }
    fs.readFile(file, function (err, data) {
        if (err) { res.writeHead(404); res.end("Not found"); return; }
        res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream" });
        res.end(data);
    });
}).listen(PORT, function () {
    console.log("Internal pages preview: http://localhost:" + PORT);
});
