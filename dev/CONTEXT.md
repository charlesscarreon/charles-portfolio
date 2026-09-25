# Portfolio Project — Development Notes

This document provides context about the portfolio project for human readers and AI assistants. Its purpose is to provide enough background to understand the project when starting from scratch, with no prior chat history.

## Last Updated

September 25, 2026

## Project Summary

Personal portfolio website for Charles S. Carreon (full name Charles Serrano Carreon), a Computer Science student at Pamantasan ng Cabuyao, Philippines.

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
- Link styling: no persistent underlines; the underline appears on hover only. Pill/button links (`.links a`, `.btn`) stay underline-free even on hover.
- Maintain the existing SEO setup: per-page metadata, canonical URLs, Open Graph, Twitter Card, and JSON-LD structured data, plus `sitemap.xml` and `robots.txt`. As a standing maintenance habit, periodically review and refresh content (education, projects, skills, achievements) and update `sitemap.xml` lastmod dates when pages meaningfully change.
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
- Google Developer profile: https://g.dev/CharlesCarreon

## The `/dev` Folder

Contains local development tooling and documentation only. It is never deployed.

## Contents of `/dev`

- `serve.js` — Zero-dependency static server for local development. Mirrors the deployed Vercel `cleanUrls` behavior: `/` maps to `index.html`, clean paths like `/projects` serve `projects.html`, and `.html` paths redirect (308) to their clean equivalents. Uses only Node.js built-ins. Run with `node dev/serve.js`. Serves on port 8123 (or the `PORT` environment variable). Includes path-traversal protection.
- `serve.bat` — Windows batch launcher. Changes to the project root, opens http://localhost:8123 in the browser, then runs `node dev/serve.js`.
- `test-fallback.js` — Zero-dependency fallback-testing server for verifying the site's no-CSS and no-JS views. Serves on port 8124 (or the `PORT` environment variable), reusing the same static-serving and clean-URL logic as `serve.js`. For HTML responses it strips tags based on query-string flags; JSON-LD structured data is always preserved. Usage: `?css=0` removes the stylesheet, `?js=0` removes the external script, and `?css=0&js=0` removes both (full fallback view). `?redirect=0` strips the automatic redirect mechanisms (any `<meta http-equiv="refresh">` and inline `window.location.replace` scripts) so the manual fallback content of a redirect stub can be viewed in-browser. Set the `ROOT` environment variable to serve a different folder (e.g., the old website repo).
- `test-fallback.bat` — Windows batch launcher. Changes to the project root, opens http://localhost:8124 in the browser, then runs `node dev/test-fallback.js`.
- `test-fallback-old.bat` — Windows batch launcher for previewing the old website's redirect stubs. Sets `ROOT` to `C:\Projects\personal\charles-old-portfolio`, opens http://localhost:8124/?redirect=0 in the browser (so the stub renders its manual fallback instead of auto-redirecting), then runs `node dev/test-fallback.js`. `?redirect=0` is needed because a browser always honors `<meta http-equiv="refresh">`. Useful because the fallback state can only be seen this way.
- `seo-audit-260904/` — A three-stage SEO audit with a consolidated report. The documents are:
  - `personal-website-seo-audit-stage-1.md` — Technical SEO foundation audit.
  - `personal-website-seo-audit-stage-2.md` — Name search and identity discoverability audit.
  - `personal-website-seo-audit-stage-3.md` — Practical identity and SEO implementation strategy.
  - `personal-website-seo-audit-consolidated-stages-1-to-3.md` — Consolidated findings and recommendations.
  - Key conclusions: the technical SEO foundation is already strong; the main challenge is name ambiguity (the name "Charles Carreon" is shared by multiple people); the current website should become the authoritative identity hub; and the old website should be consolidated so it no longer competes with the current one.

## Current Objectives

Work in progress or planned to be done immediately.

- Accessibility audit (current objective, started 2026-09-25): verify WCAG AA color contrast in both dark and light themes, confirm layouts hold at 200% zoom and text-only resizing, and run a keyboard-only + screen-reader walkthrough of all three pages. Include the bare-HTML polish in this round: clean up semantic structure so the no-CSS / no-JS view reads well and add a small color-agnostic inline `<style>` fallback in each page's `<head>` (covers container width, vertical rhythm, and list/table spacing without relying on CSS custom properties or colors).

## Planned Changes

Changes to be done in the future, not immediately. The bullets below are NOT ordered — position in this list does not imply priority or sequence.

### Content additions

- Add a Certifications section to the current website using the certificate scans and links from the old site (EF SET English C2, DICT Programming for Beginners Using Python, DICT-WD001 Principles of Web Development). The certificate scans are preserved in the old repo at `images/cert01-03.png` (reachable at https://csselrahc.github.io/images/cert0X.png). Display format (scan images vs. text links) to be decided when this task is planned out.

### SEO and identity (from audit)

- Consider dedicated pages for major projects once they have enough meaningful content (for example, MUTED) — deferred until projects have enough content to justify them.

## Completed Changes

Work that has been finished. Kept as a record for continuity.

### Consolidate the old website (`csselrahc.github.io`)

All changes were scoped to the old site only; the current website was not touched.

COMPLETED 2026-09-25. The commits `ad065a9` + `544f6b5` belong to the old website repo's history (`CSselrahC/CSselrahC.github.io`), pushed to its `main` branch — they are not part of this repo's history.

- Constraint #1 (auto-reroute): done — `index.html` is a minimal redirect stub (meta refresh + `window.location.replace`).
- Constraint #2 (manual fallback link): done — a visible link to the current website works even if auto-reroute fails or CSS/JS is disabled.
- Constraint #3 (no personal data in the fallback view): done — verified zero PII in the remaining old-site files.
- Final approach: Option A stub for `index.html`; `suggestionBox.html` / `suggestionBoxRedirect.html` were DELETED (their URLs now 404).
- Final repo footprint: `index.html` (stub), `README.md`, `.gitignore`, `images/cert01-03.png`. The `css/` and `js/` folders and all other images were deleted.
- Removed personal data: home address, phone number, full birthdate (September 6, 2004), age, sex, nickname.
- Kept unchanged on the current website: full name, the education section (all 4 schools), portrait, email, GitHub/LinkedIn/social links.
- Certificate scans preserved at `images/cert01-03.png` (served at https://csselrahc.github.io/images/cert0X.png) for the planned Certifications section (see Planned Changes).
- Verified live: `/` redirects to https://charlescarreon.vercel.app/; deleted URLs 404; cert scans return 200; served pages contain no sensitive strings.
- Note: the Road to Rich Farming game stays live at https://csselrahc.github.io/road-to-rich-farming/ — a separate repo's GitHub Pages project site, unaffected by this consolidation, still referenced from the current site's `projects.html`.

### Fallback-testing helper

`dev/test-fallback.js` + `dev/test-fallback.bat` are in place and verified. Launched via `dev/test-fallback.bat` (serves on port 8124). Add `?css=0`, `?js=0`, or `?css=0&js=0` to a URL to witness the no-CSS, no-JS, and full-fallback views in-browser. JSON-LD structured data is preserved in all views. `?redirect=0` strips automatic redirects so a redirect stub's manual fallback can be previewed; `dev/test-fallback-old.bat` serves the old website repo (`ROOT` env override) and opens that preview. Future expansion (e.g., additional simulated problems) can be planned under this note when needed.

### Establish "Charles S. Carreon" as the main identity

COMPLETED 2026-09-25. Local commits `d5f3620` (dev tooling + audit), `3dcea29` (identity rebrand), `411b250` (sitemap lastmod refresh + CONTEXT close-out), and `6632594` (share-image handling, Google Developer `sameAs`, link-styling update). All pushed to `origin/main` and live on Vercel (2026-09-25).

Final decisions (where they deviate from the audit docs' "keep the full name primary everywhere" advice, the deviation is intentional; the SEO audit files stay as the historical record):
- Display-first: the visible identity on every page is "Charles S. Carreon" (brand, `h1`, hero, footer, copyright, `<title>`, `meta name="author"`, `og:`/`twitter:` titles).
- Structured data keeps the full name canonical: `Person.name` = "Charles Serrano Carreon", `alternateName` = ["Charles S. Carreon", "Charles Carreon"]; project `author` and `ItemList` blocks unchanged.
- Uniform page titles: "Charles S. Carreon | <section>" (Home = "Charles S. Carreon | Computer Science Student & Software Developer"; the location suffix is gone).
- The homepage About Me intro and the meta/og/twitter descriptions intentionally use the full name "Charles Serrano Carreon".
- No homepage identity statement connecting the name forms (Option E decision).
- `README.md` heading and `script.js`/`styles.css` header comments updated.
- Verified with the fallback helper (`?css=0`, `?js=0`, `?css=0&js=0`): identity renders in all views, JSON-LD survives intact.
- Off-site identity gap closed 2026-09-25: the GitHub display name was changed from "Charles Carreon" to "Charles S. Carreon" in GitHub settings — profile name, bio, and website link now all match the site's identity.
- `sameAs` in the Person structured data also now includes the Google Developer profile (https://g.dev/CharlesCarreon), matching the GitHub profile README's contact list. It is intentionally NOT offered as a visible contact channel on the site: g.dev has no contact feature and is not actively used, so it stays a machine-readable identity link only.
- Social share images (`og:image` / `twitter:image`): `/projects` defaults to `images/projects/kotsell-1.png`; `/` and `/skills` use `images/charles-portrait.png`. Each page carries an HTML comment above its OG metas documenting the swap convention (candidate list + restore-the-portrait fallback rule).

### Responsive layout improvements

COMPLETED 2026-09-25. Local work included in the next commit of this round.

- Fluid side padding via `clamp(1rem, 4vw, 1.25rem)` for `main`, `.site-nav`, and `.site-footer`.
- Breakpoint ladder: 760px (`.entry-grid` / `.meta` collapse to one column), 620px (nav stacks, hero left-aligns, contact/footer link groups stack into one column, gallery thumbnails revert to natural ratios), 400px (small-phone spacing tightening).
- Contact and footer link groups are flex-gap spaced with no literal separators, so wrapped lines never start with a stray dot.
- `overflow-wrap` guard on `main` prevents any token from causing horizontal overflow.
- Theme switch tap target enlarged (~44px) on `pointer: coarse` devices.
- Verified: no horizontal scroll at 320 / 375 / 414 / 480 / 620 / 768 / 900 / 1024 / 1280 / 1440 px, both themes.
- Explicitly skipped: short/landscape-viewport spacing trim (cosmetic) and carousel fill-width on portrait phones (`contain` is acceptable). The WCAG AA contrast + 200% zoom audit is now the Current Objective (see above).