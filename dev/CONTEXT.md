# Portfolio Project — Development Notes

This document provides context about the portfolio project for human readers and AI assistants. Its purpose is to provide enough background to understand the project when starting from scratch, with no prior chat history.

## Last Updated

September 6, 2026

## Project Summary

Personal portfolio website for Charles Serrano Carreon, a Computer Science student at Pamantasan ng Cabuyao, Philippines.

The site has three pages:

- `/` — About, experience, achievements, education
- `/projects` — 8 software, web, and game projects
- `/skills` — skills and tools across 5 categories

It is built with pure static HTML, CSS, and vanilla JavaScript. There are no frameworks, build tools, or npm dependencies. The site is fully functional without JavaScript (progressive enhancement); JavaScript only adds the theme toggle and image carousels.

The site is deployed on Vercel and uses Vercel's `cleanUrls` feature, so public URLs have no `.html` extension.

## Technical Constraints

- Pure static HTML5, CSS3, and vanilla JavaScript only.
- No frameworks, no npm packages, no build step, no `package.json`. Do not add dependencies.
- Single global stylesheet `styles.css` with CSS custom properties.
- Single `script.js` written as an IIFE with `"use strict"`, ES5-compatible (no modules, no modern syntax).
- JavaScript must remain progressive enhancement: the site must work without it.
- Local dev can require Node.js, but only for the scripts in `dev/` (`serve.js`, `test-fallback.js`), which use Node.js built-ins only.
- Vercel hosting with `cleanUrls: true` in `vercel.json`. URLs must not end in `.html`.
- The `dev/` folder is excluded from production deploys via `.vercelignore`.
- Keep accessibility features: skip links, semantic HTML, `aria` attributes, `:focus-visible`, `prefers-reduced-motion`.
- Dark theme is the default; light theme is applied via a `data-theme` attribute and persisted in `localStorage`.
- Maintain the existing SEO setup: per-page metadata, canonical URLs, Open Graph, Twitter Card, and JSON-LD structured data, plus `sitemap.xml` and `robots.txt`.
- Content must remain readable even without CSS: if a visitor's browser fails to load or apply the stylesheet, the raw HTML should still present the information in a way human eyes can read.

## Important Links

- Current website: https://charlescarreon.vercel.app/
- GitHub link of current website: https://github.com/CSselrahC/charles-portfolio
- Old website: https://csselrahc.github.io/
- GitHub link of old website: https://github.com/CSselrahC/CSselrahC.github.io
- Local dev server: http://localhost:8123
- Fallback-testing server: http://localhost:8124
- GitHub profile: https://github.com/CSselrahC
- LinkedIn: https://www.linkedin.com/in/charlesscarreon

## The `/dev` Folder

Contains local development tooling and documentation only. It is never deployed.

## Contents of `/dev`

- `serve.js` — Zero-dependency static server for local development. Mirrors the deployed Vercel `cleanUrls` behavior: `/` maps to `index.html`, clean paths like `/projects` serve `projects.html`, and `.html` paths redirect (308) to their clean equivalents. Uses only Node.js built-ins. Run with `node dev/serve.js`. Serves on port 8123 (or the `PORT` environment variable). Includes path-traversal protection.
- `serve.bat` — Windows batch launcher. Changes to the project root, opens http://localhost:8123 in the browser, then runs `node dev/serve.js`.
- `test-fallback.js` — Zero-dependency fallback-testing server for verifying the site's no-CSS and no-JS views. Serves on port 8124 (or the `PORT` environment variable), reusing the same static-serving and clean-URL logic as `serve.js`. For HTML responses it strips tags based on query-string flags; JSON-LD structured data is always preserved. Usage: `?css=0` removes the stylesheet, `?js=0` removes the external script, and `?css=0&js=0` removes both (full fallback view). `?redirect=0` strips the automatic redirect mechanisms (any `<meta http-equiv="refresh">` and inline `window.location.replace` scripts) so the manual fallback content of a redirect stub can be viewed in-browser. Set the `ROOT` environment variable to serve a different folder (e.g., the old website repo).
- `test-fallback.bat` — Windows batch launcher. Changes to the project root, opens http://localhost:8124 in the browser, then runs `node dev/test-fallback.js`.
- `test-fallback-old.bat` — Windows batch launcher for previewing the old website's redirect stubs. Sets `ROOT` to `C:\Projects\personal\charles-old-portfolio`, opens http://localhost:8124/?redirect=0 in the browser (so the stub renders its manual fallback instead of auto-redirecting), then runs `node dev/test-fallback.js`. Preview the other pages at `/suggestionBox?redirect=0` and `/suggestionBoxRedirect?redirect=0`. Useful because a browser always honors `<meta http-equiv="refresh">`, so the fallback state can only be seen this way.
- `seo-audit-260904/` — A three-stage SEO audit with a consolidated report. The documents are:
  - `personal-website-seo-audit-stage-1.md` — Technical SEO foundation audit.
  - `personal-website-seo-audit-stage-2.md` — Name search and identity discoverability audit.
  - `personal-website-seo-audit-stage-3.md` — Practical identity and SEO implementation strategy.
  - `personal-website-seo-audit-consolidated-stages-1-to-3.md` — Consolidated findings and recommendations.
  - Key conclusions: the technical SEO foundation is already strong; the main challenge is name ambiguity (the name "Charles Carreon" is shared by multiple people); the current website should become the authoritative identity hub; and the old website should be consolidated so it no longer competes with the current one.

## Current Objectives

Work that is in progress or planned to be done immediately.

### Consolidate the old website (`csselrahc.github.io`)

All changes are scoped to the old site only; the current website is not touched by this task.

- Constraint #1: reroute all traffic to the current website automatically (meta refresh + `window.location.replace`).
- Constraint #2: include a visible manual fallback link to the current website, so visitors can reach it even if the automatic reroute fails (also works with CSS/JS disabled).
- Constraint #3: no personal data remains in the fallback (no-CSS/no-JS) view of the old site.
- Chosen approach: Option A — the old pages contain zero content beyond a minimal redirect stub (title with the name, a "portfolio moved" message, and the fallback link).
- Removed from the old site (not present on the current website): home address, phone number, birthday, age, sex, nickname.
- Kept unchanged on the current website: full name, the education section (all 4 schools), portrait, email, GitHub/LinkedIn/social links.
- Certificates are NOT being discarded as credentials — they are planned to be added to the current site later (see Planned Changes).
- Steps:
  1. Replace `index.html`, `suggestionBox.html`, and `suggestionBoxRedirect.html` in the old repo with the redirect stub.
  2. Replace the old repo's `README.md` with a short notice that the repo redirects to the current website.
  3. Keep the old repo's asset folders (`css/`, `js/`, `images/`, `.gitignore`) untouched.
  4. Commit and push to `main`; GitHub Pages redeploys automatically.
  5. Verify old URLs land on the current website and that raw sources contain no sensitive strings.

### Fallback-testing helper (built)

`dev/test-fallback.js` + `dev/test-fallback.bat` are in place and verified. Launched via `dev/test-fallback.bat` (serves on port 8124). Add `?css=0`, `?js=0`, or `?css=0&js=0` to a URL to witness the no-CSS, no-JS, and full-fallback views in-browser. JSON-LD structured data is preserved in all views. `?redirect=0` strips automatic redirects so a redirect stub's manual fallback can be previewed; `dev/test-fallback-old.bat` serves the old website repo (`ROOT` env override) and opens that preview. Future expansion (e.g., additional simulated problems) can be planned under this note when needed.

## Planned Changes

Changes to be done in the future, not immediately. The bullets below are NOT ordered — position in this list does not imply priority or sequence.

### Content additions

- Add a Certifications section to the current website using the certificate scans and links from the old site (EF SET English C2, DICT Programming for Beginners Using Python, DICT-WD001 Principles of Web Development). Display format (scan images vs. text links) to be decided when this task is planned out.

### SEO and identity (from audit)

- Implement the changes recommended in the SEO audit (see `/dev/seo-audit-260904/`) at a future time.
- Add `alternateName` values for "Charles Carreon" and "Charles S. Carreon" to the `Person` structured data in `index.html`, keeping "Charles Serrano Carreon" as the primary name.
- Consider adding a natural homepage statement connecting the full and shorter name forms.
- Consider dedicated pages for major projects once they have enough meaningful content (for example, MUTED).
- Periodically review and refresh content (education, projects, skills, achievements) and update `sitemap.xml` lastmod dates when pages meaningfully change.
- Optionally consider a custom domain later as a branding improvement.