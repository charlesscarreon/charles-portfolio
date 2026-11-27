# Portfolio Project — Development Notes

This document gives background on the portfolio project for human readers and AI assistants, enough to understand the project when starting from scratch with no chat history. It describes the site as it is now, the rules to follow, and the reasons behind the decisions that are not obvious from the code. The history of finished work is in git. This file is public (the repository is), so it holds no secrets, no admin details and no rate-limit numbers.

## Last Updated

November 27, 2026

## Project Summary

Personal portfolio website for Charles S. Carreon (full name Charles Serrano Carreon), a Computer Science student at Pamantasan ng Cabuyao, Philippines. Live at https://charlescarreon.dev/.

Six public pages:

- `/`, About Me, Featured Projects, Achievements, Skills and Certifications, Experience, and Recommendations
- `/projects`, 5 projects (the toolkit, OUTRUN, TRIGGR, MUTED, Lunas), newest first
- `/skills`, skills and tools in 5 categories, plus 5 certifications
- `/achievements`, competitions and recognition (SIKAPTala 2026, iSITE 2025)
- `/experience`, roles, responsibilities and education
- `/recommendations`, published recommendations and a write form

Plus `404.html`, a résumé PDF (`carreon-charles-cv.pdf`, linked from the footer as "Download CV", kept out of search results), and the private internal pages (`/admin`, the confirm and decision pages), which are not indexed.

It is static HTML, CSS and vanilla JavaScript, deployed on Vercel with `cleanUrls`. The only server code is the recommendations feature (functions in `api/`). The site works without JavaScript (progressive enhancement). JavaScript adds the theme toggle, image carousels, project, achievement and contact dialogs, the table-of-contents marker, the scroll-linked homepage cover, the animated hero background and the contact panel. `transitions.js` sets the direction of page-to-page view transitions, and `theme-init.js` applies the saved theme before first paint.

## Working Rules

- Plan first. No code changes until Charles says so in a message. Charles runs every git command that writes (add, commit, merge, push); Claude only gives the commands and may use read-only git (log, status, diff).
- One rework per branch off `main`. `main` auto-deploys on Vercel.
- Charles checks changes locally with `dev\tools\serve.bat` (http://localhost:8123).
- Do not add dependencies or a build step.

## Technical Constraints

- Pure static HTML5, CSS3 and vanilla JavaScript. No frameworks, no npm packages, no build step, no `package.json`.
- Scoped exception for the Recommendations feature only: server functions in `api/` (Node.js on Vercel, no packages, plain `fetch` to Upstash Redis and Resend). Static pages stay HTML, CSS and ES5 JavaScript.
- Any page that needs the server (the recommendations pages) must work with no JavaScript and no CSS: forms are real HTML forms with `action` and `method="post"`, every result page is server-rendered, JavaScript only enhances. `/recommendations` is rendered by a function, with a snapshot file in the repo as the fallback when the database is down. Test it with `?css=0`, `?js=0`, both, and neither.
- One global stylesheet `styles.css` with CSS custom properties. One `script.js`, an IIFE with `"use strict"`, ES5-compatible. The only other scripts are the two tiny ES5 files in every page `<head>`, `transitions.js` and `theme-init.js` (which exists so the Content-Security-Policy needs no inline script). `theme-init.js` applies the saved theme and adds the `hero-cover` class to pages with the full-screen cover, both before first paint.
- Content-Security-Policy (enforced, in `vercel.json`): scripts only from the site itself, styles from the site plus inline `<style>`, images from the site plus `data:`, no third-party hosts, no plugins, no framing, forms only to the site. Anything new that needs an inline script, an outside script, font, image or embed must update this header, or the browser blocks it. Vercel preview deployments show violations from Vercel's own toolbar; ignore them.
- `vercel.json` also sets `X-Frame-Options: DENY`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` and `X-Robots-Tag: noindex` for the résumé PDF. Vercel sends HSTS itself.
- `cleanUrls: true`; URLs must not end in `.html`. The `dev/` folder is excluded from deploys through `.vercelignore`.
- Keep accessibility: skip links, semantic HTML, `aria` attributes, `:focus-visible`, `prefers-reduced-motion`. Light-theme accent text passes WCAG AA; check contrast when changing colours.
- Dark theme is the default; the light theme is set with a `data-theme` attribute and stored in `localStorage` (`charles-portfolio-theme`). The theme switch is two-state; there is no system-default state.
- Source files use CRLF line endings; keep them when editing. `git status` lists many files as modified for line endings only (`core.autocrlf` is unset), so check with `git diff --stat --ignore-space-at-eol` and stage only files with real changes.
- Links have no underline, at rest or on hover; hover changes colour only.
- Each page ships a small colour-agnostic inline `<style>` fallback in its `<head>`, before the `styles.css` link, so the raw HTML stays readable if the stylesheet fails. Every fallback selector is also redefined by `styles.css`, so it never leaks into the styled page. Do not add rules there that the stylesheet does not also define.
- Keep the SEO setup: per-page metadata, canonical URLs, Open Graph, Twitter Card, JSON-LD, `sitemap.xml` and `robots.txt`. Update each page's `lastmod` in `sitemap.xml` by hand when its page file changes meaningfully.

## Content and Copy Conventions

- Display identity is "Charles S. Carreon" (brand, `h1`, titles, author). Structured data keeps the full name: `Person.name` is "Charles Serrano Carreon" with `alternateName` "Charles S. Carreon" and "Charles Carreon". The About intro and the meta descriptions use the full name on purpose. Page titles follow "Charles S. Carreon | <section>". The name variants are deliberate; do not unify them.
- The `Person` has the ID `https://charlescarreon.dev/#person` and the homepage also has `#website` and `#profilepage`; other pages and the project items point at these IDs. The IDs are only identifiers, not pages. `sameAs` includes the Google Developer profile (g.dev/CharlesCarreon) as a machine-readable link only, not a visible contact channel.
- Project and achievement copy is neutral third person and describes the work, not the process or the developer's feelings. Each panel ends with one plain first-person paragraph about what Charles did. Roles use Pascal case with `&` (for example "Game Designer & Lead Developer"); prose keeps "and". No em dashes; use the Oxford comma.
- Dates: visible dates use full month names (`2026 October`, `2026 May 13`); JSON-LD and `datetime` values stay ISO. Certificates run newest first.
- The projects page runs newest first, and the JSON-LD `itemListElement` order and positions match the visible order. The skills and achievements lists stay as plain `Thing` items in structured data by decision.
- Hero contact links are Email, Facebook, LinkedIn and GitHub (no Instagram anywhere), hidden below 360px, where the footer carries them. The "Get in touch" button opens a dialog with a draft: subject "Portfolio Inquiry", body starting "Hi Charles, ". The button uses a plus-address of Charles's Gmail so mail from it can be told apart and filtered. Every other email link on the site uses the plain address.
- The social image is `images/social-preview.png` (1200x630), the icons are `favicon.svg`, `favicon-32.png` and `apple-touch-icon.png`, and the profile photo is `images/charles-portrait.webp` (square, 500x500, shown at 250x250). The image files for icons and the social card were drawn by a script kept outside the repo.
- Keep images light: every photo and certificate image is WebP (the certificate scans keep their full pixel size, quality 82), sized to about twice its display size. PageSpeed flags oversized images, and PNG photos are the usual cause.
- Project and achievement photos are WebP (about 1200px wide), the technology logos are SVGs in `images/tech/`, and only optimized files are kept in the repo.

## Architecture Notes and Gotchas

- **Templates rendered by functions.** `homepage.template.html` and `recommendations.template.html` are filled by `api/home.js` and `api/recommendations.js`, rewritten from `/` and `/recommendations` in `vercel.json` and bundled with `includeFiles`. They were renamed from `index.html` and `recommendations.html` because a static file takes precedence over a rewrite. The function writes between the `<!-- recommendations:home -->` and `<!-- recommendations:list -->` markers; with no entries the template's empty state shows. On any error it serves the plain template uncached. Locally, `dev/tools/serve.js` and `dev/tools/test-fallback.js` serve the templates (empty state only). The `X-Recommendations-Home` debug header is sent only outside production.
- **Recommendations flow.** A writer submits and confirms by email; the owner approves from a link in a second email; nothing publishes without approval. Stack: Upstash Redis over REST (keys prefixed `recs:<environment>:` so previews never mix with real data), Resend for email, one daily Vercel cron job (reminder, weekly digest, cleanup of unconfirmed entries). Approved entries are copied to one public JSON value that the page reads with a read-only token. The owner has a private admin page, an owner-only JSON backup, and up to three featured entries for the homepage. Environment variable names are in `README.md`; values are only in Vercel.
- **Snapshot fallback.** `api/_lib/recommendations-snapshot.json` is a saved copy of the public recommendations, shown only when the database cannot be reached. `dev\tools\make-snapshot.bat` rewrites it from a backup downloaded on the admin page, keeping only public fields. It is empty until the first run after real recommendations are published.
- **Email.** `api/_lib/emailTemplate.js` is the one shared HTML layout (table layout, inline styles, light only), used by `writerMail.js` and `ownerMail.js`; `mail.js` sends the HTML part beside a plain-text part. Resend replaces any custom Message-ID, so threading reminders needs the real ID from Resend's retrieve-email call (the reminder subject is unthreaded for now). Email links point at the preview address on previews and at the production address (set in `api/_lib/config.js`) in production.
- **Domain.** `charlescarreon.dev` is free for the first year (GitHub Student Developer Pack), auto-renew is off, and it expires on 20 November 2027. Decide about renewing by early October 2027. Email sending depends on it. `charlescarreon.vercel.app` stays valid and redirects with a temporary 307. If not renewing, swap the hostname back in the HTML, `sitemap.xml`, `robots.txt` and the README, remove the Vercel redirect, and show "submissions closed" on the write form.
- **Homepage cover and anchors.** The hero is outside `<main>` and shrinks with scroll (`--hero-progress`, written by script, interpolated in CSS). `overflow-anchor: none` on `html.home` stops scroll anchoring from jumping the page (it also fixed a scroll jitter on `/recommendations`). `settledTarget(target)` and `settleHashTarget()` in `script.js` make anchor jumps land correctly while the cover changes height; leave them alone. Deep links such as `/projects#lunas-detail` open the matching dialog.
- **Dialogs.** Project, achievement and contact panels are native `<dialog>` elements, hidden only under `html.dialog-capable`, so without JavaScript the panels stay visible inline. `max-height` uses `dvh`; `margin: auto` on `.project-dialog[open]` is needed because `.card > :last-child` zeroes the bottom margin. Print reveals every panel.
- **CSS traps already hit.** `rootMargin` in `IntersectionObserver` accepts only `px` and `%` (a `rem` value throws and kills the script). `.site-footer p { margin: 0 }` beats a single-class margin, so footer elements need `.site-footer .class`. `.hero .contact svg` rules override icon sizing and can show hidden icons. `.card > :last-child` zeroes a last child's margin. `color-mix` tinted borders are decorative only.
- **Contact dialog.** The "To" line has a copy button (clipboard API with an `execCommand` fallback); the cursor starts at the end of the default text and is restored when the panel is reopened. The hero copy button was tried and removed.
- **ImageMagick and favicons.** ImageMagick's SVG renderer ignores `clip-path`, so the icons and social card were rendered with a PIL script. Browser favicon caches are sticky; a "wrong logo" is usually cache.

## Important Links

- Website: https://charlescarreon.dev/
- GitHub repository: https://github.com/charlesscarreon/charles-portfolio
- GitHub profile: https://github.com/charlesscarreon
- LinkedIn: https://www.linkedin.com/in/charlesscarreon
- Google Developer profile: https://g.dev/CharlesCarreon
- Old website (redirect stub only): https://charlesscarreon.github.io/ (repo `charlesscarreon/charlesscarreon.github.io`)
- Local servers: site http://localhost:8123, fallback test http://localhost:8124

## The Old Website

The old site is a minimal redirect stub (meta refresh plus script) with a visible manual link to the current site, so it works even with CSS and JavaScript off. It carries no personal data. Its certificate scans stay at `charlesscarreon.github.io/images/cert01-03.png`, and the "Road to Rich Farming" game stays live as a separate Pages project. The GitHub account was renamed from `CSselrahC` to `charlesscarreon` in November 2026; GitHub redirects repository URLs but not Pages URLs, so the old `csselrahc.github.io` host returns 404. `dev/tools/test-fallback-old.bat` previews the stub.

## The `/dev` Folder

Local tooling and documentation only; never deployed. Every `.bat` and `.js` finds the project root two levels up. Node.js built-ins only.

- `docs/`: `CONTEXT.md` (this file) and `seo-audit/` (the consolidated 2026-09-04 SEO audit and a 2026-11-22 ChatGPT review as a PDF; both were sources of the SEO tasks). The roadmap, the UI feature log and the three audit stage files were deleted on 2026-11-27; they are in the git history.
- `tools/`: `serve.js` and `serve.bat` (static server on port 8123 that mirrors `cleanUrls`, serves `404.html` with a 404 status and the templates at `/` and `/recommendations`); `test-fallback.js` with `test-fallback.bat` and `test-fallback-old.bat` (port 8124; add `?css=0`, `?js=0` or both to see the no-CSS and no-JS views; `?redirect=0` strips automatic redirects; JSON-LD is kept); `make-snapshot.js` and `.bat` (see Snapshot fallback).
- `previews/`: `preview-recommendations` (port 8125, the quote cards with invented entries), `preview-internal` (8126, admin, confirm and decision pages with invented data), `preview-email` (8127, the emails the site sends), `preview-light` (8128, the light-theme colour try-out), `preview-social.html` with `preview-social.bat` (the social image, served by `tools/serve.js` at `/dev/previews/preview-social`) and `logo-preview/` (throwaway logo candidates, opened by double-clicking `index.html`). Nothing in the previews is ever sent or stored.

## Current State and Open Items

- Built and in `main`: the homepage, projects, skills, achievements and experience pages, the recommendations feature (backend, cron, backup and snapshot fallback), the light-mode rebalance, the responsive pass, and the website logo.
- On `feature/seo-rework`, built and waiting to be merged: tasks 1 to 13 of the SEO and meta rework, the enforced Content-Security-Policy, the 404 page, structured-data IDs, the icon set and social image, the "Download CV" footer link, the copy button in the contact dialog, the removal of link underlines, spacing under bare project images, the new profile photo, and the `dev/` reorganization.
- Live-site checks (2026-11-27, after the merge to `main`): task 14 is finished. Done: the `curl -I` header checks (the homepage has the enforced Content-Security-Policy, `X-Frame-Options: DENY`, HSTS, `nosniff`, the referrer and permissions policies; `/carreon-charles-cv.pdf` is served inline as `application/pdf` with `X-Robots-Tag: noindex`), PageSpeed Insights, the Rich Results Test and Schema.org validator (below), Search Console (done earlier, before the recommendations backend) and the share preview.
- PageSpeed Insights, homepage, 2026-11-27. Mobile: Performance 96, Accessibility 97, Best Practices 100, SEO 100, Agentic Browsing 2/2; First Contentful Paint 1.1 s, Largest Contentful Paint 1.1 s, Total Blocking Time 0 ms, Cumulative Layout Shift 0, Speed Index 5.1 s (the only orange metric, caused by the throttled test). Desktop: Performance 77, Accessibility 97, Best Practices 100, SEO 100, Agentic Browsing 1/2; First Contentful Paint 0.3 s, Largest Contentful Paint 1.0 s, Total Blocking Time 0 ms, Speed Index 0.8 s, but Cumulative Layout Shift 0.546 (red). The Accessibility 97 item has not been looked at.
- Fix 1, layout shift on desktop (built 2026-11-28, not yet re-measured on the live site): the full-screen hero layout used to apply only under `html.home.js`, and `script.js` (deferred) adds the `js` class at the end of loading. On a fast connection the browser painted the compact hero first, then the hero grew to the full screen and pushed the page down; the throttled mobile test did not show it because the script ran before the first paint. Now `theme-init.js` adds `hero-cover` to `html` before the first paint and the 11 hero layout rules in `styles.css` use `html.home.hero-cover` instead of `html.home.js` (the collapse progress already defaults to 0 on `html.home`; the background decoration rules stay under `.js`). Measured in headless Chrome with the script delayed: layout shift 0.44 before, about 0.02 after, on the home page and `/projects`, desktop and phone width (the rest is the floating background icons, which `script.js` places). Without JavaScript the hero stays compact; if `script.js` fails to load, the hero stays a full-screen cover that does not collapse. Re-measured on the live site on 2026-11-28 (00:17, desktop): Performance 100, Accessibility 97, Best Practices 100, SEO 100, Agentic Browsing 2/2 (Performance was 77 before the fix).
- Fix 2, image weight (built 2026-11-28; PageSpeed "Improve image delivery" had estimated savings of 1,515 KiB): `images/charles-portrait.png` (992 KB) became `charles-portrait.webp` (500x500, 18 KB), and the five certificate PNGs (418, 432, 180, 127 and 111 KB) became WebP at the same pixel size (86, 92, 51, 46 and 40 KB). The references in `homepage.template.html` (including the `Person` image in the structured data) and `skills.html` were updated, the old PNGs were deleted, and the `lastmod` of `/` and `/skills` moved to 2026-11-28. `images/` went from about 4.4 MB to 1.6 MB. Smaller items, not done: render-blocking requests (about 140 ms, the 144 KB stylesheet) and the Accessibility flag.
- Structured-data checks (2026-11-27): the Rich Results Test passed on the homepage (smartphone and desktop crawls, one valid `ProfilePage`, no errors or warnings). The Schema.org validator reported 3 errors and 27 warnings, which are two issues counted once per copy of the `Person` (it expands the `#person` reference under `author`, `publisher` and `mainEntity`): `middleName` is not a schema.org property (`additionalName` is), and `employmentType`, `startDate` and `worksFor` are not properties of `Occupation` (the same roles are on `/experience`). Both pre-date the SEO rework and do not affect Google's results; by Charles's decision they are left as they are.
- Share preview (2026-11-28): Facebook's Sharing Debugger fetched `https://charlescarreon.dev/` with a 200 response and showed the dark 1200x630 card (logo, name, title) with the correct title, description and image. Its only warning is the missing `fb:app_id`, which is optional and left out on purpose. The debugger lists the `twitter:*` tags under an odd `og:temporal:` label; the tags themselves use the standard `name="twitter:..."` form, so nothing needs changing.
- Open: the full no-JS and no-CSS test pass for the recommendations pages, and a keyboard, zoom and screen-reader check of all six pages.
- Open: after the merge, confirm the production environment variables, and create the first snapshot with `make-snapshot.bat` once real recommendations are published.
- Left for later: the typography pass, short descriptions on the skills groups, further recommendation card refinements, and a fix for bottom-aligned buttons on image-less project cards. Dedicated pages for major projects, once they have enough content.
- A new export of the résumé from Google Docs brings back the ".docx" in the PDF's built-in title; the title was set to "Charles S. Carreon - CV" directly in the file.
