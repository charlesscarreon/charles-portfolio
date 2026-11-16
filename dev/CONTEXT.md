# Portfolio Project — Development Notes

This document provides context about the portfolio project for human readers and AI assistants. Its purpose is to provide enough background to understand the project when starting from scratch, with no prior chat history.

## Last Updated

November 15, 2026

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
- Content must remain readable even without CSS: if a visitor's browser fails to load or apply the stylesheet, the raw HTML should still present the information in a way human eyes can read. Each page ships a small color-agnostic inline `<style>` fallback in its `<head>` (placed before the `styles.css` link) that applies container width on `main` (56rem), heading/paragraph vertical rhythm, and `img`/`iframe` width limits — it uses no colors and no CSS custom properties (both die with a failed stylesheet). Every fallback selector is also redefined by `styles.css`, which is linked directly after it, so the fallback cannot leak into the fully styled page.

## Important Links

- Current website: https://charlescarreon.vercel.app/
- GitHub link of current website: https://github.com/charlesscarreon/charles-portfolio
- Old website: https://charlesscarreon.github.io/
- GitHub link of old website: https://github.com/charlesscarreon/charlesscarreon.github.io
- Local dev server: http://localhost:8123
- Fallback-testing server: http://localhost:8124
- GitHub profile: https://github.com/charlesscarreon
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

- Accessibility audit — verification step (started 2026-09-25): the code work is done (light-theme contrast fix + bare-HTML fallback, see Completed Changes). Remaining: in-browser verification pass of all three pages — 200% zoom and text-only 200% resizing at 320 / 375 / 414 / 620 / 768 / 900 / 1024 / 1280 / 1440 px, keyboard-only tab walk with visible focus, and a screen-reader sweep.
- Phase 1 homepage rework — all five planned rounds are written on `feature/homepage-rework` (1, 2, 4, 5, 6; the featured project block was dropped for lack of a screenshot, and section numbers were dropped after review). Nothing merges until the branch is pushed and reviewed on the Vercel preview; the rail and the sticky behaviour need a real browser.

## Planned Changes

Changes to be done in the future, not immediately. The bullets below are NOT ordered — position in this list does not imply priority or sequence.

### Content additions

- Add a Certifications section to the current website using the certificate scans and links from the old site (EF SET English C2, DICT Programming for Beginners Using Python, DICT-WD001 Principles of Web Development). The certificate scans are preserved in the old repo at `images/cert01-03.png` (reachable at https://charlesscarreon.github.io/images/cert0X.png). Display format (scan images vs. text links) to be decided when this task is planned out.

### SEO and identity (from audit)

- Consider dedicated pages for major projects once they have enough meaningful content (for example, MUTED) — deferred until projects have enough content to justify them.

## Completed Changes

Work that has been finished. Kept as a record for continuity.

### Consolidate the old website (`csselrahc.github.io`)

All changes were scoped to the old site only; the current website was not touched.

COMPLETED 2026-09-25. The commits `ad065a9` + `544f6b5` belong to the old website repo's history (`charlesscarreon/charlesscarreon.github.io`), pushed to its `main` branch — they are not part of this repo's history.

- Constraint #1 (auto-reroute): done — `index.html` is a minimal redirect stub (meta refresh + `window.location.replace`).
- Constraint #2 (manual fallback link): done — a visible link to the current website works even if auto-reroute fails or CSS/JS is disabled.
- Constraint #3 (no personal data in the fallback view): done — verified zero PII in the remaining old-site files.
- Final approach: Option A stub for `index.html`; `suggestionBox.html` / `suggestionBoxRedirect.html` were DELETED (their URLs now 404).
- Final repo footprint: `index.html` (stub), `README.md`, `.gitignore`, `images/cert01-03.png`. The `css/` and `js/` folders and all other images were deleted.
- Removed personal data: home address, phone number, full birthdate (September 6, 2004), age, sex, nickname.
- Kept unchanged on the current website: full name, the education section (all 4 schools), portrait, email, GitHub/LinkedIn/social links.
- Certificate scans preserved at `images/cert01-03.png` (served at https://charlesscarreon.github.io/images/cert0X.png) for the planned Certifications section (see Planned Changes).
- Verified live: `/` redirects to https://charlescarreon.vercel.app/; deleted URLs 404; cert scans return 200; served pages contain no sensitive strings.
- Note: the Road to Rich Farming game stays live at https://charlesscarreon.github.io/road-to-rich-farming/ — a separate repo's GitHub Pages project site, unaffected by this consolidation, still referenced from the current site's `projects.html`.
- Note: the GitHub account was renamed from `CSselrahC` to `charlesscarreon` in November 2026. GitHub redirects repository URLs, but GitHub Pages URLs do not follow the rename, so the old `csselrahc.github.io` host now returns 404 while the redirect stub, the certificate scans and the Road to Rich Farming game all keep serving at `charlesscarreon.github.io`.

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
- Breakpoint ladder: 760px (`.entry-grid` / `.meta` collapse to one column), 620px (nav stacks, contact/footer link groups stack into one column, gallery thumbnails revert to natural ratios), 400px (small-phone spacing tightening).
- Contact and footer link groups are flex-gap spaced with no literal separators, so wrapped lines never start with a stray dot.
- `overflow-wrap` guard on `main` prevents any token from causing horizontal overflow.
- Theme switch tap target enlarged (~44px) on `pointer: coarse` devices.
- Verified: no horizontal scroll at 320 / 375 / 414 / 480 / 620 / 768 / 900 / 1024 / 1280 / 1440 px, both themes.
- Explicitly skipped: short/landscape-viewport spacing trim (cosmetic) and carousel fill-width on portrait phones (`contain` is acceptable). The WCAG AA contrast + 200% zoom audit is now the Current Objective (see above).

### Accessibility audit (WCAG AA) and bare-HTML fallback

COMPLETED 2026-09-25 (code portion). Local work for this round; user verification of zoom/keyboard/screen-reader still pending (see Current Objectives).

- Light-theme contrast fix: `--accent` and `--link` changed `#0d9488` → `#0e7a70`. Previously the light-theme teal failed WCAG AA for text — inline links were 3.52:1 on the page background and 3.74:1 on white, and white text on the `--accent` pill/button background was 3.74:1 (all need ≥4.5:1). Verified after the change: links 4.90–5.20:1, white-on-accent button/skip-link labels 5.20:1, hover `#0f766e` 5.15–5.47:1, focus/border/non-text uses ≥4.9:1. Dark theme untouched and still passes everywhere (lowest pair is 6.3:1 on muted small text).
- All 15 images already carry descriptive `alt` text (portrait + 14 project screenshots, each varied per image) — no changes needed.
- Markup and landmarks audited, already compliant — no HTML changes: single `<h1>` per page, ordered `<h2>`/`<h3>` hierarchy, `<main id="main">` skip-link target on every page, `<header>`/`<nav aria-label="Primary">`/`<footer>`/`<address>`/`<figure>`/`<figcaption>`/`<article>`, `lang="en"`, `aria-label` + `aria-current`, theme icons `aria-hidden`, `:focus-visible` ring, `prefers-reduced-motion` handled.
- Bare-HTML fallback added: a small color-agnostic inline `<style>` in each page's `<head>` (placed before the `styles.css` link) applying `max-width: 56rem` on `main`, heading/paragraph vertical rhythm, and `img`/`iframe` `max-width: 100%`. No colors, no CSS custom properties. Every fallback selector is also redefined by `styles.css` (linked after it), so the fallback never affects the fully styled page. Verified via the fallback server: `?css=0` strips the `<link rel="stylesheet">` while keeping the inline `<style>`. (Revised after the first version leaked a `body { max-width: 56rem }` rule into the styled page, which collapsed the layout into a centered column on wide screens; the leak was removed by dropping every fallback rule the stylesheet does not also define — `body`, `ul`, `ol`, `dd`, and `time`.)
- Explicitly skipped / accepted: `color-mix` accent-tinted pill borders measure ~1.6:1 (below the 3:1 non-text guideline), accepted because the pill label text (which passes at ≥4.5:1) conveys the component's identity — the border is decorative reinforcement. Landscape/short-viewport spacing trim is now done (see Mobile and touch polish below).

### Mobile and touch polish

COMPLETED 2026-09-25. Local work for this round, driven by an in-depth look at the phone experience.

- Header balance: `.brand` bumped 1.05rem → 1.2rem; the theme switch is spaced from the tabs with `margin-left: 1rem`; at ≤620px `.nav-list` gets `margin-right: auto` so the toggle sits at the far right of its row instead of hugging the tabs.
- Mobile hero re-centered: the previous responsive round's ≤620px `text-align: left` override was removed, so the name, tagline, intro, and contact return to centered on phones (matching the desktop hero). Top-level `.section` headings (About Me, Experience, Education, Achievements) are also centered at ≤620px for cohesion; project and skill card headings stay left-aligned.
- Hero contact group hidden below 360px (`@media (max-width: 360px)`): the stacked contact column looked cramped on phones ≤360px and is now omitted there. The footer link group still shows all five contacts on every width, so contact access is preserved for small-screen visitors.
- Reduced hero bulk on mobile: ≤620px hero bottom margin 3rem → 2rem and tagline margin 1.25rem → 0.75rem; ≤400px hero margin-bottom 1.5rem. This pulls the profile section up a meaningful amount on phones.
- Touch targets (44px): inside `@media (pointer: coarse)`, `.gallery-nav button` and `.links a` / `.btn` get `min-height: 2.75rem` with inline-flex centering; the theme switch gets a transparent 44×44 `::after` hit area (its compact visual pill is unchanged). Theme switch width was already ~44px wide from the earlier coarse-pointer bump.
- Short/landscape-viewport trim (previously deferred): `@media (orientation: landscape) and (max-height: 520px)` tightens `main` / `.hero` / `.section` vertical spacing so content stays above the fold. The carousel `contain` decision for portrait phones still stands.

### Polish round: carousel counter, pre-paint theme, renamed-account links

COMPLETED 2026-11-15. Local work for this round.

- Carousel counter: `script.js` queried `.gallery-count` inside the gallery, but the element is a sibling of it (inside the generated `.gallery-nav`), so the "1 / 3" indicator never rendered on any multi-image gallery. It is now queried from `nav`.
- Pre-paint theme: each page's `<head>` now carries a small inline script that applies the stored `charles-portfolio-theme` value before first paint, removing the dark flash light-theme visitors saw. Dark stays the default and the no-JS view is unchanged.
- Renamed account: 34 references to `CSselrahC` / `csselrahc.github.io` updated to `charlesscarreon` across the three pages and this document, including three dead URLs (the Road to Rich Farming Pages link, its JSON-LD `url`, and the certificate-scan URLs).
- `sitemap.xml`: lastmod refreshed to 2026-11-15 for all three pages.
- `vercel.json`: added `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and a `Permissions-Policy` limiting geolocation, camera and microphone. Image caching was deliberately not added because the project screenshots are being reviewed for removal or replacement.
- Deliberately skipped: image compression. The three heaviest images (portrait, two Road to Rich Farming captures) are PNG exports of photo-like content, and local PNG re-encoding inflates one of them, so any real gain would need a lossy re-encode or an external tool. Deferred while the project list is being curated.

### Phase 1: homepage rework (`feature/homepage-rework`)

Planned as six rounds on a branch so production stays on `45a7c5c` until the branch is merged. The plan of record is kept outside the repo; this section records what actually landed, round by round, one commit per round. Five of the six were kept.

The featured project block was dropped before it was built. Its purpose was visual proof, and Lunas has no screenshot available: the repo ships none, its README lists hosting as planned, and the only way to capture the patient page is to run the stack locally. A text-only version would have repeated the achievement entry without adding evidence. The slot stays open for the game project, which will have a page and captures.

#### Round 1 — hero availability and a contact button

COMPLETED 2026-11-15.

- Availability line added under the tagline: `Open to internship and junior developer roles`. Deliberately dateless — it cannot go stale, and the graduation year stays in the About and Education sections.
- Hero call to action: a single `Get in touch` button, sized above the project pills. It opens a compose window with the subject `Portfolio inquiry` and the body `Hi Charles,` plus a blank line, so a first reply starts with a greeting instead of an empty page.
- The button's link uses the subaddress `charlesserranocarreon+portfolio@gmail.com`. Gmail delivers it to the same inbox, and the tag survives in the envelope, so mail arriving that way can only have come from this button. A Gmail filter on `deliveredto:` with "Never send it to Spam" keeps first-contact mail out of spam, which is where collaboration enquiries had been landing. Every other email link on the site stays on the plain address so the tag keeps its meaning.
- No public CV PDF and no CV request button. A CV goes out by reply when someone asks.
- The five-link contact row stays in the hero but is demoted to muted, smaller text so the button is the only prominent action. Every link is still present and still hidden below 360px, where the footer carries them.
- New CSS: `.hero-availability`, `.hero-cta`, `.btn--lg`. The tagline's bottom margin is tightened with `.hero .tagline:has(+ .hero-availability)`; browsers without `:has()` keep the previous spacing, so the fallback is a larger gap rather than a broken layout. The `.btn--quiet` style written for the dropped second button was removed along with it.
- `sitemap.xml` needed no change: its lastmod was already 2026-11-15.

#### Round 2 — achievements and About copy

COMPLETED 2026-11-15.

- Both achievement entries now lead with what was built and what role was held, instead of opening with "I participated". Course and event names stay; the phrasing that read like a submission to a professor is gone.
- Lunas: `Built the patient-facing page of Lunas, a QR-based emergency medical information system, as front-end developer on an eight-person team that reached the Top 8 nationally at SIKAPTala 2026.` The team name Otso-Otso was dropped; a recruiter cannot evaluate a nickname, and the sentence already states the team size. The description paragraph below still explains what Lunas does.
- iSITE: `Represented Pamantasan ng Cabuyao in the C# Programming category at the iSITE National IT Skills Competition 2025.` Category and institution keep their `<strong>`.
- About: the "currently seeking opportunities" paragraph and the "browse my projects" paragraph merged into one, so availability is stated once on the page rather than twice (the hero now carries it). Both outbound links survive.
- `projects.html` was deliberately left alone. The project list is being curated, and rewriting copy for cards that may be removed is wasted work.
- The footer build line added in the previous round was removed. Listing the font stack and the fact that the site has no build step is detail the site already demonstrates, and it repeated on every page.
- No JS, no new files.

#### Round 4 — quick facts and stat tiles in the About card

COMPLETED 2026-11-15.

- A `<dl class="quick-facts">` sits between the headline and the prose: Studying / Focus / Based in. It comes before the bio because the bio restates what the hero already says, while the facts are what a reader scans for.
- A `<ol class="stat-row" role="list">` spans the width under the portrait and the text: `Top 8` (SIKAPTala 2026 national finalist), `2` (national competitions), `3` (certifications). `role="list"` is there because `list-style: none` strips list semantics in Safari with VoiceOver.
- The numbers are text, not `::before` content, so a screen reader announces "Top 8, SIKAPTala 2026 national finalist". With CSS off, both elements still read as lists of facts.
- Project count was deliberately not used as a tile. It read `8 projects shipped` in the plan, but the project list is being curated and the tile would go stale the moment a card is removed. `3` and `2` cannot change without a new credential or competition.
- `Top 8` is a rank band, not eighth place; the label carries "finalist" so it cannot be misread.
- Narrow screens: the facts collapse to one label per line, left-aligned, inside the otherwise centred card. The stat row centres its text and wraps at nine rem.
- Contrast, computed from the tokens: tile number 8.51:1 dark / 4.64:1 light, tile label 6.30:1 / 5.35:1, fact label 7.39:1 / 5.64:1. All pass AA.
- No JS, no new images, `sitemap.xml` unchanged.

#### Round 5 — certifications on the skills page

COMPLETED 2026-11-16.

- A `Certifications` card follows the five skill categories on `skills.html`: EF SET English Certificate (C2 Proficient), DICT Programming for Beginners Using Python, DICT-WD001 Principles of Web Development.
- Each row is the title with the issuer underneath, and a `View certificate` link on the right. The rows reuse `.skill-list`, so they inherit the hairline dividers and the wrap behaviour; only `.cert-name` and `.cert-issuer` are new.
- The scans stay on the old site (`charlesscarreon.github.io/images/cert01-03.png`, all 200, 577–606 KB each) and are linked, not copied in. Inline scans were rejected: they are the heavy photo-like PNGs that compression was deferred for, and a title plus a link carries the same information.
- Years appear only where they are certain: both DICT courses are 2024. The EF SET row has no year because the issue date could not be confirmed, and a wrong date on a credential is checkable in one click.
- The section carries `id="certifications"`, so a future table of contents or a stat tile can link straight to it.
- `sitemap.xml`: `/skills` lastmod moved to 2026-11-16. The homepage keeps 2026-11-15 until the next round edits it.
- No JS. `skills.html` gained one section; `styles.css` gained two rules.

#### Round 6 — desktop table of contents

COMPLETED 2026-11-16.

- The four content sections now sit in a `.page-grid` wrapper with a `.page-main` column and a `<nav class="toc" aria-label="Sections">` rail beside it. The hero stays outside the wrapper: a rail beside a centred `h1` reads as a mistake rather than an index.
- Section numbers were planned and dropped. They add visual orientation but no information, and the rail labels already carry the names.
- The rail exists only from 1160px up: `grid-template-columns: minmax(0, 1fr) 11.5rem`, `gap: 3rem`, `position: sticky; top: 5rem` — the same offset `scroll-padding-top` uses, so anchors still land clear of the sticky header. Below that the wrapper is a plain block and the rail is `display: none`, which leaves tablet and phone layout byte-identical to before.
- The content's left edge never moves; only its right edge narrows by the rail width. That is deliberate: `main` and `.site-nav` are both 1040px and centred, so pulling the rail out of that width keeps headings aligned with the brand and with the other two pages.
- `.toc` was added to the existing `@media print` hide list, so a printed page carries no navigation rail.
- `script.js` gains `initToc()`: on `scroll` and `resize` (passive, one `requestAnimationFrame` per frame) it marks the last section whose top has passed a line under the sticky header, using `aria-current="true"`. The line is the measured `.site-header` height plus 24px, not a hardcoded number, so it follows the header instead of duplicating `scroll-padding-top`. The `load` event re-runs it once, because image loading shifts the offsets. Above the first section (the hero) nothing is marked, and scrolling back up clears it.
- The first attempt used an `IntersectionObserver` with `rootMargin: "-5rem 0px -55% 0px"`. `rootMargin` accepts **only `px` and `%`**, so the `rem` value made the constructor throw a `SyntaxError`; `initToc()` died on its first statement and no entry was ever marked. The only evidence was a console error, and `node --check` could not catch it because it is a valid string. The scroll calculation replaces it: no `rootMargin`, no feature guard, and the failure mode is arithmetic that a headless harness can assert.
- `sitemap.xml`: homepage lastmod to 2026-11-16.
- Not verifiable without a browser: the sticky rail, the moving highlight, and the 1160px breakpoint itself. Those need the preview.
