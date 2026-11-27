#!/usr/bin/env node
"use strict";

/* Preview of the published-recommendation cards, and of the form, with invented sample entries.
   It renders the real renderEntry() from api/_lib/render.js on the real
   stylesheet, so what you see is what the site will show. The samples exist
   only here: they are never part of the site, the API or the stored entries.
   Run from the project root via dev\previews\preview-recommendations.bat, then open
   http://localhost:8125 (add ?theme=light for the light theme).
   Uses only Node built-ins. */

const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const ROOT = path.resolve(__dirname, "..", "..");
const PORT = process.env.PORT || 8125;
const { renderPageList, renderHomeSection } = require(path.join(ROOT, "api", "_lib", "render"));

const MIME = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".webp": "image/webp",
    ".ico": "image/x-icon"
};

const SAMPLES = [
    {
        id: "sample-1",
        name: "Jordan Sample",
        role: "Senior Software Engineer",
        organization: "Example Corp",
        line: "Worked with Charles on a project or team",
        message: "Charles took the front-end work on our team project and kept it moving when the requirements changed twice in a week.\n\nHe asked good questions early, wrote code that was easy to review, and helped the teammates around him get unstuck. I would gladly work with him again.",
        publishedAt: "2026-11-20T08:00:00Z",
        links: [{ label: "LinkedIn", url: "https://example.com/in/jordan-sample" }]
    },
    {
        id: "sample-2",
        name: "Ana Placeholder",
        role: "",
        organization: "",
        line: "Classmate of Charles",
        message: "Reliable, calm under deadlines, and always willing to explain how something works.",
        publishedAt: "2026-11-12T08:00:00Z",
        links: []
    },
    {
        id: "sample-3",
        name: "Dr. Riley Example",
        role: "Instructor",
        organization: "Sample University",
        line: "Teacher or mentor of Charles",
        message: "Charles approaches a problem methodically. In my class he turned a vague brief into a working prototype, documented the decisions he made along the way, and presented the result clearly to a mixed audience.\n\nHis attention to detail stood out among the group. He tests his own work before asking anyone to look at it, and he takes feedback well. He also keeps notes that other students ended up borrowing, which says a lot about how organised he is.\n\nI recommend him for any junior developer role where steady, thoughtful work matters.",
        publishedAt: "2026-10-30T08:00:00Z",
        links: [
            { label: "LinkedIn", url: "https://example.com/in/riley-example" },
            { label: "Facebook", url: "https://example.com/riley.example" }
        ]
    },
    {
        id: "sample-4",
        name: "Charles S. Carreon",
        role: "Software Developer",
        organization: "Kamote Studios",
        line: "Used something Charles built",
        message: "A short sample with a long role and company name, to check how the footer wraps in a narrow card.",
        publishedAt: "2026-11-27T08:00:00Z",
        links: [
            { label: "LinkedIn", url: "https://example.com/in/charles-sample" },
            { label: "Facebook", url: "https://example.com/charles.sample" }
        ]
    }
];

/* The real form from the page template, so the profile-field icons can be checked here.
   Submitting does nothing in this preview. */
function formSection() {
    const file = path.join(ROOT, "recommendations.template.html");
    const html = fs.readFileSync(file, "utf8");
    const match = html.match(/<form class="recommendation-form"[\s\S]*?<\/form>/);
    if (!match) return "<p class=\"preview-note\">The form was not found in recommendations.template.html.</p>";
    const form = match[0].replace("method=\"post\" action=\"/api/submit\"", "method=\"get\" action=\"#\" onsubmit=\"return false\"");
    return "<p id=\"write-note\" class=\"recommendation-form__note\">Preview only: nothing is sent.</p>\n" + form;
}

function page(theme) {
    const toggle = theme === "light" ? ["dark", "Switch to dark"] : ["light", "Switch to light"];
    return "<!DOCTYPE html>\n" +
        "<html lang=\"en\" data-theme=\"" + theme + "\" class=\"home recommendations\">\n<head>\n" +
        "<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n" +
        "<title>Recommendation cards preview</title>\n<meta name=\"robots\" content=\"noindex, nofollow\">\n" +
        "<link rel=\"stylesheet\" href=\"/styles.css\">\n" +
        "<style>main{padding-top:2rem}.preview-note{color:var(--muted);font-size:.9rem}</style>\n" +
        "</head>\n<body>\n<main id=\"main\">\n" +
        "<p class=\"preview-note\">Preview with invented sample entries, never published. " +
        "<a href=\"/?theme=" + toggle[0] + "\">" + toggle[1] + "</a></p>\n" +
        "<section class=\"section\" aria-label=\"Recommendations page\">\n<h2>On the recommendations page</h2>\n" +
        renderPageList(SAMPLES) + "\n</section>\n" +
        "<section class=\"section\" aria-label=\"Homepage\">\n<h2>On the homepage (the top three, as the homepage builds them)</h2>\n" +
        renderHomeSection(SAMPLES.slice(0, 3)) + "\n</section>\n" +
        "<section class=\"section\" aria-label=\"Form\">\n<h2>The form (profile links)</h2>\n" +
        formSection() + "\n</section>\n" +
        "</main>\n</body>\n</html>\n";
}

http.createServer(function (req, res) {
    const parsed = url.parse(req.url, true);
    const pathname = decodeURIComponent(parsed.pathname);
    if (pathname === "/") {
        res.writeHead(200, { "Content-Type": MIME[".html"] });
        res.end(page(parsed.query.theme === "light" ? "light" : "dark"));
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
    console.log("Recommendation cards preview: http://localhost:" + PORT);
});
