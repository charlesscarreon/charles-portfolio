# Portfolio Project — Development Notes

This document provides context about the portfolio project for human readers and AI assistants. Its purpose is to provide enough background to understand the project when starting from scratch, with no prior chat history.

## Last Updated

November 18, 2026

## Project Summary

Personal portfolio website for Charles S. Carreon (full name Charles Serrano Carreon), a Computer Science student at Pamantasan ng Cabuyao, Philippines.

The built site has five pages:

- `/`, About Me, Featured Projects, Achievements, Skills and Certifications, and Experience
- `/projects`, 4 software and game projects
- `/skills`, skills and tools across 5 categories
- `/achievements`, competitions, recognition, and event highlights
- `/experience`, roles, responsibilities, and education

A sixth page, `/recommendations`, is planned as a later feature.

It is built with pure static HTML, CSS, and vanilla JavaScript. There are no frameworks, build tools, or npm dependencies. The site is fully functional without JavaScript (progressive enhancement). JavaScript adds the theme toggle, image carousels, project, achievement and contact dialogs, table-of-contents marker, and the scroll-linked homepage cover.

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

- Accessibility audit, verification step (started 2026-09-25): the code work is done (light-theme contrast fix and bare-HTML fallback, see Completed Changes). Remaining: in-browser verification pass of all five pages after Phase 5, covering 200% zoom and text-only 200% resizing at 320 / 375 / 414 / 620 / 768 / 900 / 1024 / 1280 / 1440 px, keyboard-only tab walk with visible focus, and a screen-reader sweep.
- Phase 5 homepage rework: implemented and verified, uncommitted on `feature/homepage-rework`. The round adds an Experience page, moves Education off the homepage, reduces the hero contacts, adds an email draft dialog and a Skills and Certifications section, and applies a new homepage section order.
- Phase 4 achievements page: completed and merged through PR #6 on 2026-11-18. The local `feature/achievements-page` branch and local `main` are up to date with the remote merge. The results from that round are recorded under Completed Changes.

## Planned Changes

Changes to be done in the future, not immediately. The bullets below are NOT ordered — position in this list does not imply priority or sequence.

Do not delete this section when the list is empty. An empty list means nothing is planned right now, not that the section is stale or finished.

### Phase 5: homepage rework and Experience page (`feature/homepage-rework`)

DECISIONS RECORDED 2026-11-18. IMPLEMENTED 2026-11-18 on `feature/homepage-rework`, verified and uncommitted. The local branch was updated from `main` before planning.

- Final homepage section order for this build: `About Me`, `Featured Projects`, `Achievements`, `Skills and Certifications`, `Experience`. Education is removed from the homepage and carried on the Experience page.
- Future homepage order after the Recommendations feature is built: `About Me`, `Featured Projects`, `Achievements`, `Skills and Certifications`, `Experience`, `Recommendations`. Recommendations goes last because it is supporting social proof rather than primary work history.
- New `experience.html` uses the shared cover hero pattern. The page carries the detailed experience entries first and the Education section last. The page title stays focused on experience, while Education is a secondary section at the bottom. The homepage Experience section becomes a compact summary with a `View all experience` button to `/experience#experience-hero`.
- Hero contacts are reduced to Email, Facebook, LinkedIn, and GitHub. Facebook stays in both the hero and the footer because it is useful for local contacts in the Philippines. Instagram is removed from both places. The hero uses logo icons with accessible labels, and it does not show usernames.
- Hero sentence becomes `I build games, developer tools, and web apps.` The course and school are removed because they are already covered in About and on the Experience page.
- The About quick fact `Focus` changes from `Front-end and game development` to `Front-End and Game Development`. This is a label value, so it follows the existing `Front-End Developer` wording. Normal prose keeps lowercase `front-end`.
- The `Get in touch` button becomes a mail draft dialog. The destination stays `charlesserranocarreon+portfolio@gmail.com`, the subject stays `Portfolio inquiry`, and the body starts with `Hi Charles,` plus a blank line. Visitors can type a message in a text area, and submitting opens their mail app through `mailto:`. The site does not send mail, has no backend, and shows no fake success state. Without JavaScript, the button remains a plain `mailto:` anchor.
- Add a compact Skills and Certifications section to the homepage, with a summary of the five skill categories and five certifications. The section ends with a `View all skills and certifications` button to `/skills`. Do not add credential schema, local certificate PDFs, or expanded certificate previews to the homepage.
- `sitemap.xml` becomes five page entries after this build, adding `/experience` with `2026-11-18`. Recommendations is recorded but not added to the sitemap until its page exists.
- Build order: record dev notes first, lock information architecture and internal links, create the Experience page and compact homepage summary, add the Skills and Certifications section, update hero copy and contacts, build the email draft dialog, then adjust styles and responsive behavior. Finish with `node --check`, static checks, browser checks, and `git diff --check`.

### Recommendations feature, planned for a later round

- Add a homepage Recommendations section as the last section. It shows the latest recommendations about Charles.
- The section has two buttons: `View all recommendations` to `/recommendations`, and `Write a recommendation` to `/recommendations#write`.
- Add a `/recommendations` page later. It lists all recommendations and has a write area at `#write`.
- The recommendation submission method is undecided. Build the interface first when this feature is approved, then decide whether the write area opens a mail draft or uses another no-backend flow.
- Do not add the section, page, sitemap entry, or navigation link in Phase 5. Record only.
- This plan supersedes the earlier direction that kept testimonials out of the site. Treat recommendations as a separate later feature.

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
- Note: the Road to Rich Farming game stays live at https://charlesscarreon.github.io/road-to-rich-farming/ — a separate repo's GitHub Pages project site, unaffected by this consolidation. It is no longer referenced from `projects.html` (Round 7 removed the card), but the deployment remains live.
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
- Social share images (`og:image` / `twitter:image`): all three pages now use `images/charles-portrait.png`. `/projects` used to default to `images/projects/kotsell-1.png`, which Round 7 deleted along with the rest of the project screenshots. Each page carries an HTML comment above its OG metas documenting the swap convention.

### Responsive layout improvements

COMPLETED 2026-09-25. Local work included in the next commit of this round.

- Fluid side padding via `clamp(1rem, 4vw, 1.25rem)` for `main`, `.site-nav`, and `.site-footer`.
- Breakpoint ladder: 760px (`.entry-grid` / `.meta` collapse to one column), 620px (nav stacks, the contact group stacks into one column while footer links wrap in a centred row, gallery thumbnails revert to natural ratios), 400px (small-phone spacing tightening).
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

Planned as six rounds on a branch so production stays on `45a7c5c` until the branch is merged. The branch was merged into `main` on 2026-11-18 as `633f70d`. The plan of record is kept outside the repo. This section records what actually landed by round, with related revisions folded into the same commit. Five of the six planned rounds were kept, followed by later rounds for the project list and the homepage closeout.

The featured project block was dropped early because Lunas had no screenshot and a text-only version would have repeated the achievements entry. It was later built with the existing project thumbnails from OUTRUN, MUTED, and Lunas. The homepage closeout revision below records the final layout.

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
- Later revision: the certification stat was changed from `3` to `5` in the current skills rework, when two verified Wadhwani certificates were added.

#### Round 5 — certifications on the skills page

COMPLETED 2026-11-16.

- A `Certifications` card follows the five skill categories on `skills.html`: EF SET English Certificate (C2 Proficient), DICT Programming for Beginners Using Python, DICT-WD001 Principles of Web Development.
- Each row is the title with the issuer underneath, and a `View certificate` link on the right. The rows reuse `.skill-list`, so they inherit the hairline dividers and the wrap behaviour; only `.cert-name` and `.cert-issuer` are new.
- The scans stay on the old site (`charlesscarreon.github.io/images/cert01-03.png`, all 200, 577–606 KB each) and are linked, not copied in. Inline scans were rejected: they are the heavy photo-like PNGs that compression was deferred for, and a title plus a link carries the same information.
- Years appear only where they are certain: both DICT courses are 2024. The EF SET row has no year because the issue date could not be confirmed, and a wrong date on a credential is checkable in one click.
- The section carries `id="certifications"`, so a future table of contents or a stat tile can link straight to it.
- `sitemap.xml`: `/skills` lastmod moved to 2026-11-16. The homepage keeps 2026-11-15 until the next round edits it.
- No JS. `skills.html` gained one section; `styles.css` gained two rules.
- Superseded on 2026-11-18 by the five-card certification layout in the current skills rework. The local previews and full issue dates recorded there replace the three remote scans and year-only labels from this round.

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

#### Round 7 — the project list replaced with four current projects

COMPLETED 2026-11-16.

- All eight coursework cards are gone from `projects.html`, replaced by four projects chosen for what they can carry in an interview: OUTRUN, MUTED, 964's C# Game Development Toolkit, and Lunas. Three of the old eight were variations on the same coursework brief, and every card opened with a course code rather than with the thing that was built.
- Each card opens its detail in a native `<dialog>` modal: the page dims behind a `::backdrop`, the panel renders in the top layer, and the card list does not move when a panel opens. `showModal()` supplies focus containment, `Escape`, background inertness and focus return; closing is a `<form method="dialog">`, so no handler is needed for it. The trigger is an outlined pill beside the solid project links, drawn with an inset shadow rather than a border so the row keeps exactly its previous height.
- The panels are hidden only under `html.dialog-capable`, a class `script.js` adds after confirming `showModal()` exists. Without JavaScript the four panels stay visible inline and still read as ordinary sections; with JavaScript but without CSS they open natively. The first attempt used `<details>`, which was replaced because an inline disclosure that later grows to hold screenshots pushes every card below it down.
- `images/projects/` was deleted outright: 14 files, 3.6 MB, of which 2.4 MB was two Road to Rich Farming screenshots. No card carries a screenshot this round, so the directory had no remaining referent. Everything is recoverable from git history, and the deletion retires the compression question for project images — only the three certificate scans remain heavy.
- `Status` now distinguishes something. It previously read `Finished` on all eight cards; it now reads `In development (v0.3.3)`, `Defended`, `Ongoing (v0.1.0)` and `Prototype`.
- OUTRUN follows the itch.io page rather than the author's memory: the game is published as in development, not finished. The card and the store page cannot disagree, because a reader can see both.
- MUTED has no external link, so the card offers only the detail panel. The study's gesture set, evaluation metric and sample size were not available at build time, so the panel carries only what is known — the question, the training and deployment path, and the recorded input. An empty sub-heading was deliberately not shipped.
- The Lunas card links the deployed site **and** the team repository, and labels the repository as the team's. This is the fix for the problem the old TaskFlow card had: it claimed `Project Leader` and linked a repository under someone else's account with no explanation. Lunas states the scope instead — patient client, both registration flows — which is what the card can defend.
- Copy rule applied throughout: every sentence describes the project, not the process, not the developer's feelings, and not what was rejected. No mention of the MUTED name's history, no "still in progress" asides, no disclaimers about how the code was written. Detail that is worth reading but not worth leading with lives in the panel.
- One new CSS block for `.project-dialog`, its head, close button, body and `h4`/list children, plus the outlined trigger pill. Below 620px the dialog fills the viewport using `100dvh`, so the mobile URL bar cannot clip the close button. `@media print` reveals every panel and hides the triggers, so a printout is not missing the detail that was behind a click.
- `script.js` gains `initProjectDialogs()`: it opens the named dialog from `[data-dialog]`, closes on a backdrop click, and records the open panel in the URL with `replaceState` — so `/projects#outrun-detail` opens it, and open/close does not fill the back button. Inline `code` in card copy gets a small rule so the package name and target framework do not fall back to the browser's monospace size. No new tokens, no new files, no library.
- `sitemap.xml`: `/projects` lastmod to 2026-11-16. The homepage was not touched — its stat tiles deliberately avoid a project count, which is why this round could not invalidate them.
- Verification of the modal behaviour — backdrop click, focus return, the 320px full-screen sheet — was still pending when the round was committed. Lunas cannot be walked end to end because login on the deployed site returns an internal server error.

#### Revision — the project detail is a modal, not a disclosure

COMPLETED 2026-11-16.

- `<details class="project-more">` was replaced by a native `<dialog>` before the round was committed: the disclosure grew the card and pushed every card below it down, and the panels are about to hold screenshots.
- Nothing else about the round changed. Same four projects, same copy, same deleted images, same `sitemap.xml` date. The card order was later changed to newest first; see the closing revision.

#### Round 8 — screenshots on the cards, and neutral copy

COMPLETED 2026-11-18 as part of `488cf77`.

- Each project with an image now carries one still on the card above its heading: OUTRUN official artwork, MUTED gameplay, Lunas homepage. The toolkit has no image and none was invented. The stills appear on the page before a reader opens a panel.
- The seven PNGs supplied for the panels were resized to 1200px wide and encoded as WebP at quality 0.82 through Chrome's canvas encoder. Three megabytes became 283 KB. Originals were moved out of the repo to `C:\Users\charles\Pictures\portfolio-project-sources\` and are not tracked; only the WebPs are.
- Cards and the project descriptions in panels use impersonal third person. OUTRUN's pursuit paragraph was rewritten flatly, MUTED's question without rhetorical framing, and Lunas no longer says "My part was..." — the client's scope and the Top 8 result are stated as facts. The closing first-person paragraphs are the only place the work is attributed.
- Every panel ends with one plain first-person paragraph stating what the work covered. It has no name, class, heading, rule or colour change, so the voice shift is the only marker. The `Role` value in the metadata carries the attribution.
- Roles use Pascal case and `&`: Game Designer & Lead Developer, Lead Developer, Owner & Maintainer, Frontend Developer. Only the role values were changed; prose keeps its normal "and".
- Panel headings lost their leading "The". Image captions lost their trailing periods. No em dashes remain in the project copy.
- Topic chips sit inside each panel, directly after the head, and the same topics are added as `keywords` to each JSON-LD item. They are plain text, not links. The toolkit's `license` field was removed from the structured data along with the UI mention.
- OUTRUN's garage is now stated as nine vehicles including the starting e-bike, matching the store page. Its Controls and Team sections were removed. The itch.io link reads "Download on itch.io", and the same action is repeated as a button inside the panel. The toolkit and Lunas panels gained View on GitHub and Visit site buttons respectively; the Lunas card link now reads "Visit site".
- MUTED's "kept rather than discarded" phrasing and the "Not publicly available" line are gone. The toolkit's five modules are presented as examples rather than the full set, with a concrete line each, and no fixed count or licence is claimed.
- Modal geometry: `.card > :last-child` was zeroing the dialog's bottom margin, which cancelled the UA's auto centring and left the panel flush with the bottom of the viewport. `margin: auto` on `.project-dialog[open]` restores centring. `max-height` uses `dvh`, and the scrollbar is thin and theme-coloured with `overscroll-behavior: contain`.
- Print reveals panels whose lazy screenshots were never opened, so `beforeprint` flips their `loading` to `eager`.
- Still outstanding: a visual browser pass on the new card thumbnails and panel buttons, and a privacy check of the Lunas registration screenshot for real names or patient data.

#### Revision — chips in the panels, first-person contributions, OUTRUN artwork

The four topic chip lists moved from the cards into their dialogs, directly after each head. The closing paragraphs are plain first-person `<p>` elements: no `project-contribution` class, no muted colour, no heading, no name. OUTRUN's card uses `outrun-key-art.webp` with alt `OUTRUN official artwork`; the duplicate key-art figure was removed from its panel, leaving the roadblock and regular-play figures.

#### Revision — compact card grid, award pill and dates

The four cards are wrapped in `.project-grid`: one column by default, two from 820px up. Card padding, headings, body size and metadata gaps were tightened only for `.project`, so other cards elsewhere are untouched. The thumbnail keeps `aspect-ratio: 16 / 9` and gains `height: auto` so the HTML `height` attributes cannot stretch the box.

Lunas carries a small `Top 8 National` pill over the top-right of its thumbnail. Card Dates are now 2026 Oct (OUTRUN and MUTED), 2026 Nov (toolkit) and 2026 May (Lunas), with `dateCreated` updated in the JSON-LD to `2026-10`, `2026-11` and `2026-05`. The visible labels were later expanded to `2026 October` and `2026 November` in the current skills round. The JSON-LD values stayed ISO.

The dialog's generic `ul` and `li` rules were scoped with `:not(.tags)`. They had been overriding `.tags` with left padding and per-item margins; in the flex row only the last chip kept full height, which made it look taller than the rest. Print collapses the project grid to one column so the expanded panels are full width.

#### Revision — newest-first order and a first-person intro

The cards now run newest first: toolkit (2026 Nov), OUTRUN and MUTED (2026 Oct, keeping their original relative order), then Lunas (2026 May). The JSON-LD `itemListElement` array was reordered to match, with `position` reset to 1–4, and its list description no longer mentions the school.

The hero paragraph on `/projects` is now consistently first person and no longer names the school or repeats the name: "A selection of software, web and game projects I worked on, with my role in each." The background and skills links stay.

#### Revision — award badge over the Lunas thumbnail

The badge was first modelled on the badge inside the `#projects` section of `https://emieljames.dev/#projects`, then changed to avoid copying it. It now sits at the thumbnail's top-left as a solid site-accent rectangle with an uppercase accent-contrast label and a teal trophy on an accent-contrast tile; there is no translucency, blur or amber left. The image and badge share a `.project-thumb-wrap` positioning context, so the badge overlaps the still instead of occupying a line above the title. The thumbnail selector changed from `.project > .project-thumb` to `.project .project-thumb` to survive the wrapper; its 16:9 ratio and `height: auto` are unchanged.

#### Revision — homepage introduction copy

COMPLETED 2026-11-17 as `3fb005b feat: tighten the homepage introduction`.

- The hero paragraph no longer repeats the name from the `h1` or says "would love to use". It now reads "I build games, developer tools, and web apps while studying Computer Science at Pamantasan ng Cabuyao."
- The About headline is "Games, Tools, and Web Apps".
- The About Me intro keeps the full name "Charles Serrano Carreon" for searchability, as recorded in the identity decisions. It drops "Hi!", the long "currently studying" clause and the aspirational closing. It now states the degree, school, when the interest started and the work done now.
- The About closing is "You can contact me, browse my projects, or review my skills and tools." The three links are unchanged.
- New prose uses the Oxford comma and no em dashes. Meta descriptions, Open Graph, Twitter Card, JSON-LD, Experience, Achievements, Education and the light theme are untouched.

#### Round — homepage cover and TOC theme switch

COMPLETED 2026-11-18 as `df9eab5`, merged through PR #3 as `633f70d`.

- The site header is gone from the homepage only. The theme switch now sits in a `.toc-head` row beside the `On this page` title, and the TOC stays visible at every width: a compact wrapped row on small screens and a sticky sidebar from 1160px up. Projects and skills page links are not replaced yet; projects access will come from the planned feature section and skills links will be added gradually.
- The hero is now outside `<main>`. The skip link still targets `#main`, and `<main>` starts at About Me with `tabindex="-1"`, so keyboard users land on the summary instead of the visual cover. `<html>` has a `home` class to scope the new rules.
- The hero keeps its current copy and contact row. Inside `@supports (height: 100svh)` it becomes a full-screen flex-centered cover using `100vh` then `100svh`. Browsers without `svh` keep the compact single-page layout, and CSS-disabled visitors get the plain stacked document. Short landscape viewports drop the minimum height.
- `html.home` keeps `scroll-padding-top: 1rem` because there is no sticky header on this page. The old header CSS stays for projects and skills, which are untouched this round.
- System default was deliberately not added to the theme switch. It stays a two-state persisted choice, matching the earlier decision to leave `prefers-color-scheme` alone.

#### Revision — scroll-linked cover in normal flow

This is a correction inside the same homepage cover round, not a separate commit.

- The hero shrinks continuously with scroll instead of toggling at a threshold, then scrolls away with the page like any other section. Script writes `--hero-progress` from 0 to 1 across the first 45% of the viewport height, and CSS interpolates height, padding, spacing, and type scale from it. `overflow-anchor: none` on `html.home` keeps the browser from moving scrollY while the cover changes height.
- The cover stays in normal document flow. There is no fixed positioning, spacer, overlay background, or measured height offset. Anchors clear only the normal 1rem padding, and the skip link keeps a stepped scroll because the main target moves while the cover shrinks. The progress-driven rules are scoped to `html.home.js`, so the no-JS fallback stays a static cover. Short landscape viewports drop the minimum height.
- One bare down chevron replaces the circular cue. It bobs and fades out early, and hover and keyboard focus turn it cyan. It is a real anchor, so it works without JavaScript. Scripted clicks step the scroll frame by frame because the About target moves while the cover shrinks.
- The existing global reduced-motion rule disables the bob and smooth scrolling. Instant jumps still settle the moving target in a few frames, so they land with the same 1rem padding. Print hides the chevron and shows the static cover.

#### Revision — footer contact icons

This is a correction inside the same homepage closeout, not a separate commit.

- The footer no longer repeats the name and location line on any page. Each contact route is an inline SVG beside a visible text label, and the SVGs are hidden from assistive technology.
- Labels use handles where the route has one, plus the full email address. The row wraps instead of stacking at small widths, and reduced padding brings the footer to roughly half to three quarters of its former height.

#### Revision — featured projects section

This is a correction inside the same homepage closeout, not a separate commit.

- A Featured Projects section follows About Me with OUTRUN, MUTED, and Lunas in that order. Each card has one factual line and a deep link to the matching detail panel on the projects page.
- The section links to `/projects` with a View all projects button. The TOC gains a matching anchor, and the grid collapses to one column below 760px.
- Each featured card now uses the same thumbnail as its project-list card. Lunas carries the final Top 8 National badge over the still. The More about links share a bottom alignment rule so they sit on one line across the grid.

#### Revision — final section TOC marker

This is a correction inside the same homepage closeout, not a separate commit.

- The TOC keeps the existing activation line for the first four sections. Education also has a lower viewport line, because it sits too near the end of the page to reach the top line before scrolling stops. The marker now lights when the Education heading enters the upper part of the viewport.

#### Verification — homepage closeout

Checked 2026-11-18.

- Static checks, hero scroll checks, TOC checks, and all four fallback variants pass. The footer and featured links are covered by the homepage checks.
- At 200% zoom and 200% text resize there is no horizontal overflow and all hero content stays visible. Keyboard order starts with the skip link, and every control has an accessible name.
- `sitemap.xml` now lists 2026-11-18 for the homepage, projects page, and skills page, matching their latest content dates.

### Phase 2: projects rework (`feature/projects-rework`)

COMPLETED 2026-11-18 as `488cf77`, merged through PR #4 as `8ca41e0`.

- The projects page now matches the homepage cover pattern with a full-screen hero, `My Projects` heading, and back and down cues. The back cue targets `/#featured` and reads `Back to Home`. The down cue targets `#main` and reads `Scroll to projects`. Both hide at hero progress `>= 0.25`.
- The `settledTarget(target)` damping in the shared hero scroll code stays intact.
- The content header reads `What I've Built` with the description `Each project shows the tools I used, my role, and more detail about the work.`
- The four cards run newest first: toolkit, OUTRUN, MUTED, and Lunas. The JSON-LD `itemListElement` order matches the visible order.
- OUTRUN uses `images/projects/outrun/outrun-key-art.webp` with alt `OUTRUN official artwork`. Project tags remain inside the detail dialogs. Contributions stay as plain first-person paragraphs with no name, heading, colour change, or rule.
- Roles use Pascal case with `&` in metadata values. Prose keeps normal `and`.
- The deferred issue with bottom-aligned buttons leaving empty space on image-less cards stays deferred. No fix was attempted in this round.

### Phase 3: skills and certifications rework (`feature/skills-rework`)

COMPLETED 2026-11-18 as `13ba76f`, merged through PR #5 as `90ed14e`.

- The skills page now matches the projects cover style with the id `skills-hero`, heading `My Skills`, tagline `Tools, languages, and certifications`, a back cue to `/`, and a down cue to `#main` labelled `Scroll to skills`. The site header is removed from this page. The theme switch sits outside the hero in the first section header row.
- The page uses `class="no-js home skills"` and keeps a readable no-JS fallback. The cues hide at hero progress `>= 0.25`. The hero stays in normal flow and is not sticky or fixed.
- The theme switch stays binary, with no system-default state.
- The skills header reads `Skills and Tools` with the description `Each group lists the tools and technologies I use with my current proficiency level.` Five compact cards sit in `.skills-grid`, two columns from `760px` up. Tools stays as a normal skill card.
- `Unity Engine` and `C# Game Scripting` are `Proficient` in both visible rows and JSON-LD.
- Certifications are separated from skills with `.cert-grid` and `.cert-card`. The five cards use local PNG previews from `images/certificates/`, remote verification or PDF links, and no copied PDF files. The certificate images use `object-fit: cover` with `object-position: center top` inside an `8rem` frame.
- Certificate order is newest first: Proficiency Certificate, Certificate of Content Completion, EF SET English Certificate, Principles of Web Development, and Programming for Beginners Using Python.
- Visible certificate dates use `YYYY MMMM DD`: `2026 May 13`, `2026 April 30`, `2025 May 23`, `2024 July 18`, and `2024 July 6`. Visible project dates use full month names. JSON-LD and `datetime` values stay ISO. Month-only labels and year-only labels stay compact.
- Certificate tags are styled like the project dialog tags. Certificate buttons use the same cyan fill as the other buttons. Tags sit above buttons in a bottom-aligned footer group.
- EF SET shows `78/100` in the title and keeps `C2 Proficient` as a tag. The Wadhwani certificates count as certifications. The Lunas participation certificate stays out because its verification site refuses to verify it.
- `index.html` records five certifications. `sitemap.xml` already lists 2026-11-18 for all three pages.
- Static checks, `git diff --check`, and browser checks pass for desktop, tablet, mobile, reduced motion, and no-JS.

### Phase 4: achievements page (`feature/achievements-page`)

COMPLETED 2026-11-18 as `214dbb8 feat: add achievements page`, merged through PR #6 as `116823f`.

- The new `achievements.html` uses `class="no-js home achievements"` and reuses the shared cover hero pattern. The hero id is `achievements-hero`, the heading is `My Achievements`, and the tagline is `Competitions, recognition, and event highlights`.
- The back cue targets `/#achievements` and reads `Back to Home`. The down cue targets `#main` and reads `Scroll to achievements`. Both hide at hero progress `>= 0.25`. The site header is removed, and the theme switch sits outside the hero in the first section header row.
- The section header reads `Recognition` with the description `The competitions I joined and what each one involved.` Two cards cover SIKAPTala 2026 and iSITE National IT Skills Competition 2025. Visible dates are `2026 May 11 – 14` and `2025 March 28`. Role values use Pascal case, with `&` only where a combined role needs it. For iSITE, the role is `Contestant` and `C# Programming` stays the category. Prose keeps normal `and`.
- The cards reuse the projects page classes: `.project-grid`, `.card.project`, `.meta`, `.links`, `.project-detail-open`, and `.project-dialog`. Each card has a More dialog. Tags stay inside those dialogs. Computed card styles match the projects page cards.
- The SIKAPTala card and dialog link to the event post, the Lunas source, and `/projects#lunas-detail`, which opens the Lunas More dialog on the projects page. The projects page Lunas dialog links back to `/achievements#sikaptala-2026-detail`. The iSITE card links to its event post. The dialogs carry the longer factual descriptions and the tags.
- `index.html` keeps the Achievements section and TOC entry, but the entries are compact. Each entry has a title, date, role, result where relevant, and one sentence. A `View all achievements` button links to `/achievements#achievements-hero`. The JSON-LD award strings and the iSITE role wording were updated to match the visible content.
- `styles.css` groups `html.achievements .theme-switch` with the projects and skills theme switch rules. It also groups `.achievements-head` with the shared section header rules and resets the figure margin for achievement lead images. No new card style system was added.
- `sitemap.xml` gained `/achievements` with `2026-11-18`. The sitemap now has four page entries.
- `script.js` adds `settleHashTarget()` so deep links to card targets settle after the cover changes height. The existing `settledTarget(target)` damping stays unchanged. Hash links to `.project-dialog` elements still open the matching More dialog.
- The six local WebP files are under `images/achievements/`: `sikaptala-2026/school-congratulations.webp` at 1200x1200, `sikaptala-2026/announcement.webp` at 800x800, `sikaptala-2026/team.webp` at 1200x900, `isite-2025/school-congratulations.webp` at 1080x1080, `isite-2025/behind-the-scenes-with-me.webp` at 1200x685, and `isite-2025/behind-the-scenes.webp` at 1200x713.
- The files named `school-congratulations.webp` come from Pamantasan ng Cabuyao, not from the event organizer. They include Charles S. Carreon or the team. Their captions read `From Pamantasan ng Cabuyao`, and their alt text starts with `Post from Pamantasan ng Cabuyao`. Nothing attributes them to SIKAPTala or iSITE organizers.
- Each school congratulatory image is the card lead and is repeated inside the matching More dialog. The announcement and team images sit inside the SIKAPTala dialog in the order announcement, Result, team, My contribution, lead image, About Lunas. The lead image for iSITE comes before Participation, then the two behind-the-scenes images, then Focus. Only optimized WebP files are kept in the repo, and the originals stay outside the final committed set.
- Static checks, `git diff --check`, and browser checks pass for desktop, tablet, mobile, reduced motion, and no-JS. Browser checks also cover dialog open and close, hash landing on the Lunas card, hash-to-dialog links on both pages, dialog photo loading, mobile dialog sizing, card style comparison against the projects page, local links, dates, roles, and computed card styles.

### Phase 5: homepage rework and Experience page (`feature/homepage-rework`)

IMPLEMENTED 2026-11-18 on `feature/homepage-rework`, verified and uncommitted. Charles will stage and commit this round. The plan is preserved above as the record of the decisions.

- `index.html` now has the section order `About Me`, `Featured Projects`, `Achievements`, `Skills and Certifications`, `Experience`. The homepage Education section is gone. The TOC follows the same order.
- The hero sentence is `I build games, developer tools, and web apps.` The About quick fact `Focus` is `Front-End and Game Development`. The meta descriptions describe projects, achievements, skills, and experience.
- The hero contacts are Email, Facebook, LinkedIn, and GitHub. The three social links use inline SVG logos with `aria-label` and no visible usernames. Instagram is removed from the homepage hero, all page footers, and the homepage JSON-LD `sameAs`.
- `Get in touch` remains a plain `mailto:` anchor without JavaScript. With JavaScript, `initContactDialog()` opens `#contact-dialog` with subject `Portfolio inquiry` and message body starting `Hi Charles,` followed by a blank line. The `Open email app` button builds the `mailto:` URL. The dialog supports close button, backdrop click, Escape through the native dialog, and a full-screen phone layout.
- The homepage Skills and Certifications section summarizes five categories and five certifications, then links to `/skills`. The Experience section stays compact and links to `/experience#experience-hero`.
- `experience.html` uses `class="no-js home experience"`, with `experience-hero`, heading `My Experience`, tagline `Roles, responsibilities, and education`, a back cue to `/#experience`, and a down cue to `#main`. It carries the three roles first, Education last, per-page metadata, the shared footer contact links without Instagram, and the theme switch.
- `styles.css` adds `.experience-head`, `.summary-grid`, `.hero .contact svg`, and `.contact-dialog` styles. The phone dialog rule is placed after the base dialog rule so it wins the cascade. Print styles hide the contact dialog.
- `sitemap.xml` has five page entries after adding `/experience` with `2026-11-18`. `README.md` and `vercel.json` were not changed for this round.
- `node --check`, a 22-assertion static check, `git diff --check`, a 35-assertion browser check, and the 104-assertion achievements regression browser check pass. The browser checks cover JS and no-JS states, desktop/tablet/mobile widths, dialog open and close, mail draft fields, hero contacts, section order, Experience page cues, Education placement, theme toggle, and no horizontal overflow.
- `settledTarget(target)` in `script.js` is unchanged. The deferred project issue about bottom-aligned buttons on image-less cards was left alone.

## Pending git action

Phase 5 is ready for Charles to stage and commit. Do not commit, push, merge, reset, or switch branches on his behalf.
