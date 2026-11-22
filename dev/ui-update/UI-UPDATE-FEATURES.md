# UI Update: Feature Log

Copy of the Claude doc "UI Update: Feature Log", trimmed on 2026-11-22 to make room for new UI tasks. The doc is the live version; this file is a backup inside the repo. The long per-feature notes are in the git history of this file.

## Ground rules

- **Plan mode only.** No code or file changes until Charles says so in a message.
- **One UI feature per message.** Each message is a new feature unless it answers a question from the previous one.
- **Every discussed feature is recorded here** so none is forgotten.
- **Branch:** the UI work is on `feature/ui-update`. Charles runs all git commands.
- **Preview:** Charles checks changes locally with `dev/serve.bat` (opens `http://localhost:8123`).
- **Claude doc:** the live copy of this log is "UI Update: Feature Log" at https://claude.ai/artifact/99PBaWayDQ4AQe9uNExNHh. Text with inline code needs a whole-block replace with `ifHash` and `ifRev`. Keep this file, `dev/CONTEXT.md` and the doc in sync.
- **Standing constraints:** the site must still work with no JavaScript and no CSS, with no dependencies and ES5-only script. Dark theme stays the default, with the light theme kept. Reduced-motion users get no animation.
- **Line endings and replies:** files use CRLF line endings, which stay. Replies are short and unpadded; a question is asked only when a decision is really needed.

## Built so far

All eight features and the ten tasks below are built and committed on `feature/ui-update` (2026-11-21 to 2026-11-22).

- **Feature 1, hero backgrounds:** a different set of floating icons on each hero, circuit lines that light up near the pointer, random data-transfer pulses, and a redesigned contact button and panel.
- **Feature 2, page transitions:** slide-and-fade between pages, with the direction following the page order.
- **Feature 3, homepage gaps:** a longer gap between homepage sections.
- **Feature 4, View all buttons:** quieter "View all" buttons.
- **Feature 5, project cards:** logo tiles slide out on hover and show the tool name; the card lifts and glows, the other cards dim, and the Lunas award badge sits on the image corner.
- **Feature 6, More about scroll:** a fix so "More about" lands on the right card.
- **Feature 7, skills:** a logo-only list; hovering a logo shows its name and level in a small label above it.
- **Feature 8, certificates:** a fixed 16:9 frame that grows to the card edges on hover, with a glow and dimming of the other cards.

**Earlier homepage and footer work (built 2026-11-22 on `feature/ui-update`).** Short summaries; the long versions are in the git history of this file.

- **hero availability:** "Open to internships and junior developer roles" moved from the hero into the About Me quick facts; the hero tagline now says "Software Developer" (metadata and JSON-LD too); no underline on hero contact links on hover; the "Open email app" button matches the panel's fields.
- **About Me stat badges:** hovering a badge shows a small label above it with the details (competitions and certifications as lists; on touch the details sit under it), and each badge links to its evidence.
- **achievements card:** one card, whole card links to `/achievements`; each entry has a small facts list (Role, Team or Category) and its tech tiles slide out on hover (Next.js, Tailwind CSS, TypeScript; C#); "Top 8 National" in the SIKAPTala heading; certificates-style teal border and glow.
- **skills card:** certificates-style hover with a slow diagonal shine and the logos bobbing in turn; project cards use the same hover; hovering any homepage card dims the others; the certificate issuer and date sit on two lines in the card footer and the button fades in over them.
- **experience:** the two DEVCON Laguna roles are grouped under one heading with a dot-and-line timeline (first dot filled, last a dashed ring); Victowin uses the same template without the timeline; hover lights the whole organization; descriptions are bullet lists.
- **recommendations empty state:** a ghost quote card with an invite and a "Write a recommendation" button, on the homepage and `/recommendations`; "View all recommendations" sits below the card.
- **back to top in the menu:** dropped (it moved into the footer).
- **"View all" links:** bare text on the left; on hover a line grows from the first letter and the arrow extends to the content edge; on touch a short static line and arrow.
- **footer (all six pages):** name and tagline, "Latest projects" (linking to each project's panel), a "Social links" column whose names slide to handles on hover, a location strip with a Google Maps pin link and the availability line, and "Back to top"; on narrow screens the projects column is hidden and the rest is centred; buttons no longer have a gap under the label.
- **homepage background:** a dot grid, line grid, accent glow, circuit echo and section bands were all tried and dropped; the page stays flat.

## Decided against or later

- **Rejected:** a shorter hero with an "Open to work" badge (the hero rework covers it) and numbered section labels (too common, does not match the site's UI).
- **Later:** further recommendation card refinements, the reminder and weekly digest emails (backend), the typography pass, and short descriptions on the skills groups ("Front-End Development", "Game Development") with the no-extra-height rule.
- **Ideas for the achievements page, not chosen:** the project-card hover on `/achievements`; an award badge on the image corner; photo peek on the thumbnail; a timeline with year markers; meta chips with small icons.
- **Open check:** `.project:focus-within` may leave a project card highlighted after a click and going back.

## New UI tasks

**Earlier UI tasks (built 2026-11-22 on `feature/ui-update`; 1 to 4 committed, 5 to 8 reviewed).** Short summaries; the long versions are in the git history of this file.

- **Task 1, project cards:** the teal highlight on the technologies row (and the hidden commas) on hover and keyboard focus is removed; the technologies stay plain text.
- **Task 2, achievements page:** tech logo tiles on both cards (SIKAPTala: Next.js, Tailwind CSS, TypeScript; iSITE: C#); the project-card lift, teal glow and dimming of the other card (project rules widened to `:is(html.projects, html.achievements)`); "More about this achievement" sits above the View links on its own row, hidden until hover or focus on pointer devices (always visible on touch), with both rows pinned to the card bottom.
- **Task 3, skills page:** each of the five skill cards gets the homepage skills hover (certificates-style border and glow, one slow diagonal shine, logos bobbing in turn); skill and certificate cards dim each other.
- **Task 4, experience page:** the work card uses the homepage Experience markup and look (DEVCON Laguna grouped with a timeline, Victowin without); education is a timeline card (only the college is a filled dot, the others dashed rings, the programme under each name); hovering it outlines the card in teal and turns the college name teal.
- **Task 5, recommendation cards:** `renderEntry` in `api/_lib/render.js` outputs a quote card (faint teal quote mark, initials avatar, name, role and organization, relationship line, date, links) with the shared teal hover glow and dimming; the preview is `dev\preview-recommendations.bat` (port 8125) with invented entries that never reach the site.
- **Task 6, internal pages:** all markup in `api/_lib/pages.js`, shell in `api/_lib/html.js` (slim top bar, narrow card, saved theme), an "Internal pages" block at the end of `styles.css` (status icons, teal, outlined and red buttons, banners, collapsible admin cards with status chips); the decision page shows the public quote card; admin changes: a "Featured #n" chip and teal edge on featured entries, Public or Private tags on profile links, banner notes, and an eye button on the login secret field; the preview is `dev\preview-internal.bat` (port 8126).
- **Task 7, emails:** one shared HTML template, `api/_lib/emailTemplate.js` (clean light look close to the website; teal bar, bold sans name, soft grey quote panel, teal pill button, full link under it, footer; table layout with inline styles, no dark-mode code, for the widest mail-app support), used by `api/_lib/writerMail.js` and `api/_lib/ownerMail.js`; `sendMail` sends the html part beside the unchanged plain-text part; the preview is `dev\preview-email.bat` (port 8127). A formal serif and navy version was rejected as looking like a law firm. Still to do (backend): the 24-hour reminder and the weekly digest emails.
- **Task 8, write form:** the form on `/recommendations` is grouped (About you, How do you know Charles, Your recommendation, Profile links) with paired fields on wide screens; "How do you know Charles?" is a compact list of single-choice rows with a round radio mark (same values, so the back end is unchanged) and a small ES5 `initChoiceToggle` in `script.js` lets a picked row be clicked again to clear it; teal focus ring and checkboxes, the consent line in a bordered box, a smaller note above the form and a one-line note under the submit button.

Add further tasks below, one per message.
