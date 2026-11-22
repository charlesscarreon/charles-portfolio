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
- **Later:** recommendation quote cards, the typography pass, and short descriptions on the skills groups ("Front-End Development", "Game Development") with the no-extra-height rule.
- **Ideas for the achievements page, not chosen:** the project-card hover on `/achievements`; an award badge on the image corner; photo peek on the thumbnail; a timeline with year markers; meta chips with small icons.
- **Open check:** `.project:focus-within` may leave a project card highlighted after a click and going back.

## New UI tasks

**Task 1: Remove the tech stack highlight on project cards** (planned 2026-11-22, projects page only, built 2026-11-22, awaiting review in the browser).

- **Problem:** on `/projects`, hovering a project card turns each technology in its Technologies row into a teal pill (teal background, halo, brighter text) and hides the commas between them.
- **Wanted:** remove that highlight. The technologies stay as plain text with commas on hover, as at rest.
- **In `styles.css`:** the two rules `html.projects .project:hover .tech-list li` and its `::after`, plus the now-unused fade transitions on `.tech-list li` and its comma.
- **Left alone:** the logo tiles, the card border and glow, the teal title, the dimming of other cards, the "More about" fade-in. The homepage featured cards have no such highlight.
- **Decided:** the same highlight also shows for keyboard focus (`html.projects .project:has(a:focus-visible) .tech-list li` and its `::after`). Remove it there too, so mouse and keyboard match.

**Task 2: Achievements page, tech logos, hover and button rows** (planned 2026-11-22, `/achievements` only, built 2026-11-22, awaiting review in the browser).

- **Tech logos:** add the logo tiles to the two achievement cards, the same as on the project cards: SIKAPTala 2026 gets Next.js, Tailwind CSS, TypeScript; iSITE 2025 gets C#. They slide out at the card's right edge on hover; on touch and narrow screens they sit as a row under the card text.
- **Glow and dim on hover:** hovering an achievement card gives it the shared teal border and glow, and the other achievement card dims, the same as the project cards.
- **"More about this achievement" on its own line:** in each card the button sits on a new line below the other links ("View Event Post", "View Lunas Project"), never in the same row as them.
- **Aligned across cards:** the "More about this achievement" buttons of the cards line up with each other (same height on the page when the cards sit side by side), and only with each other, not with the other links, which differ in number from card to card (SIKAPTala has two, iSITE has one).
- **Watch:** an earlier attempt to line up rows across the certificate cards with subgrid looked worse and was reverted; the plan here is to pin the button row to the bottom of each card instead, so the cards need no shared grid rows.
- **Built:** the two cards get the logo tiles after the thumbnail (SIKAPTala: Next.js, Tailwind CSS, TypeScript; iSITE: C#), which slide out at the card's right edge on hover or keyboard focus and sit as a row on touch and narrow screens. The existing project-card hover rules were widened from `html.projects` to `:is(html.projects, html.achievements)` for the lift, the teal border and glow, the dimming of the other card and the tiles; the teal title and the fade-in of the "More about" button stay projects-page only, so on `/achievements` the button is always visible. In the markup "More about this achievement" is its own `<p class="links links--more">` under the other links; CSS pins both rows together to the bottom of the card (the links row keeps its `margin-top: auto`, the More row follows it with a small gap), so the empty space of a shorter card sits above the buttons and both rows line up from card to card (no subgrid). A first version pinned only the More row and left the other links floating mid-card; it was corrected after review. Only `achievements.html` and `styles.css` changed.
- **Changed after review (2026-11-22):** "More about this achievement" now sits above "View Event Post" and "View Lunas Project" and is hidden at rest: on a pointer device it fades in (with a small rise) when the card is hovered or a link inside it is focused, and its space is reserved so the card does not jump, as on the projects page. On touch and narrow screens it is always visible. The two rows stay pinned to the bottom of the card together. In the markup the `links--more` row now comes first. The projects page fade-in rules were widened to `:is(html.projects, html.achievements)`.

**Task 3: Skills page, homepage skills hover** (planned 2026-11-22, `/skills` only, built 2026-11-22, awaiting review in the browser).

- **Wanted:** the skills on `/skills` get the same hover behaviour as the skills card on the homepage: the certificates-style teal border and soft glow, a slow diagonal shine that sweeps across the card once, and the logos bobbing up and down in turn as the shine reaches them. Mouse devices only; with reduced motion only the highlight and dimming remain.
- **Difference to handle:** the homepage has one skills card; `/skills` has five (Front-End Development, Back-End / Server-Side, Programming, Game Development, Tools), each its own card. The effect plays per card, on the card being hovered, using that card's own logos.
- **Dimming:** as on the homepage, hovering or focusing one card dims the others. Assumed here: the other skill cards and the certificate cards on the same page dim together, as on the homepage where all cards dim each other.
- **Reuse:** the homepage rules (`.skills-card`, its shine and bob, the shared dimming rule) are scoped to the homepage, so they need widening to `html.skills` rather than copying.
- **Built:** each of the five skill cards on `/skills` also carries the `skills-card` class, so the homepage hover applies unchanged: the teal border and glow, one slow diagonal shine, then the logos bobbing in turn (the bob delay rule now covers a sixth logo, for Tools). The shared dimming rule was widened from `html.home` to `:is(html.home, html.skills)`, so hovering or focusing a skill card or a certificate card dims the others on `/skills`, as assumed. Mouse devices only; reduced motion keeps only the highlight and dimming. Only `skills.html` and `styles.css` changed.

**Task 4: Experience page, work experience look and education timeline** (planned 2026-11-22, `/experience` only, built 2026-11-22, awaiting review in the browser).

- **Work experience:** use the same look as the homepage Experience card. The two DEVCON Laguna roles (Operations and Procurement Lead, Student Volunteer) are grouped under one DEVCON Laguna heading with "Laguna" on the right, as a dot-and-line timeline (first dot filled, last a dashed ring, neutral grey line, year on the right). Victowin Engineering Services And Trading (QA/QC Staff, 2023, Cabuyao City) uses the same template without the dot and line. Hovering an organization lights up the whole group with the soft teal tint and glow. Each job description is a bullet list with teal bullets. Today the page lists the three roles as three separate rows, each repeating its organization and location.
- **Education:** a timeline look. The four schools (Pamantasan ng Cabuyao, 2023 – Present; Pamantasan ng Cabuyao Senior High School Department, Graduated 2023; Pulo National High School, Graduated 2021; Pulo Elementary School, Graduated 2017) each get a dot on a thin vertical line, in the same dot-and-line style as the work experience timeline, with the year on the right. The current school is the filled dot. Today they are four plain rows.
- **Assumed:** the education entries do not get the hover glow per entry unless Charles asks for it, and the education timeline joins all four schools (one line for the whole list, unlike work experience where only DEVCON has a line).
- **Built:** work experience on `/experience` now uses the homepage Experience card markup and the same `experience-card` class, so the grouped DEVCON Laguna roles with the dot-and-line timeline, the Victowin entry without a timeline, the teal-bulleted descriptions and the per-organisation hover glow all come from the existing rules, with no copied CSS. Education is a new card (`education-card`) using the same dot-and-line timeline (`roles roles--timeline`): one line joins the four schools, only the first (Pamantasan ng Cabuyao, 2023 – Present) is a filled dot and the other three are dashed rings (changed after review), the year is on the right and the programme or level sits under each name in muted text (`role__sub`). No hover glow on the education entries, as assumed. The `role__head` heading style now also covers `h3`. Only `experience.html` and `styles.css` changed.
- **Added after review (2026-11-22):** hovering the Education card outlines the whole card in teal (border plus a thin ring, no big glow), and the current school (the college) turns its name teal. A glow on the college (tint, ring, outer glow and a glowing dot) was tried first and removed. Mouse devices only. The gap between schools is now a margin (not padding); the timeline line still runs to the next dot.

**Task 5: Recommendations page, front end for published recommendations** (planned 2026-11-22, `/recommendations` and the homepage Recommendations section, plan only, not started). The back end works (submit, confirm, approve, publish); the front end is still the plain placeholder: each published recommendation is a plain card with the text, then the author, role, organization, date and links as unstyled lines (`renderEntry` in `api/_lib/render.js`, `.recommendation` rules in `styles.css`).

- **Wanted:** a made-up design for now; Charles will decide how to adjust it once the page is reworked, so it should be easy to change (one place for the markup, one block of CSS).
- **Proposed design (made up):** a quote card like the ghost card's look: a large faint teal opening quote mark, the recommendation text, then an author row with a round initials avatar, the name in strong text, the role and organization muted underneath, the date and the links (LinkedIn, Facebook, and so on) on the right or below on narrow screens. The same card hover as the other cards: teal border and soft glow, the other recommendations dim. Long ones are shortened on the homepage with "Read the full recommendation", as now.
- **Sample content:** to look at the design before real recommendations exist, a dev-only preview with a few invented entries, never published. Invented testimonials must not appear on the live site, so the samples live only in a preview file under `dev/`, not in the template, the API or the stored entries.
- **Unchanged:** the ghost empty state while the list is empty, the write form, and the back end.

**Task 6: Internal pages look** (planned 2026-11-22, the server-rendered pages behind the recommendations, plan only, not started). These are the pages only Charles and the people who write recommendations see: the admin page (`api/admin.js`: login, the lists of pending, approved and rejected recommendations with Approve, Reject and Delete), the approve or reject page from the owner's email (`api/decide.js`), and the "confirm it is you" page the writer opens from their email (`api/confirm.js`, the "Yes, I wrote this" button).

- **Today:** all of them share one bare shell in `api/_lib/html.js`: a plain card with default headings and plain buttons, no site header or footer, and a "Back to recommendations · Home" line under it.
- **Wanted:** a proper look for them, in one place (the shared shell plus a small block of CSS), so every internal page matches the site: the same dark and light themes, a slim top bar with the name wordmark, a narrow centred card per page, and clearly different primary, secondary and destructive buttons (Approve, Reject, Delete, "Yes, I wrote this").
- **Proposed (made up, to adjust):** the recommendation being decided on is shown as the same quote card as Task 5, so Charles sees it as it will be published; each page opens with a small status icon (a check for confirmed or approved, a cross for rejected, a warning for a link that is not valid); the admin lists become compact cards with a status chip (awaiting, approved, rejected) and the action buttons on the right, stacked under the text on phones.
- **Constraints:** they stay readable with no JavaScript and no stylesheet, keep `noindex`, and are mostly opened from an email on a phone, so they are designed phone first. No logic changes: tokens, confirmation steps and the two-step approve and reject stay as they are.
- **Depends on:** Task 5 (the quote card), so Task 5 is better done first.

**Task 7: Email look** (planned 2026-11-22, the emails the site sends, plan only, not started). To be done last, after Task 6.

- **Today:** the two emails are plain text only. `sendMail` in `api/_lib/mail.js` sends just a `text` body through Resend: the confirmation email to the writer ("Please confirm your recommendation for Charles Carreon", built in `api/submit.js`) and the decision email to Charles ("Recommendation: <name>", built in `api/_lib/ownerMail.js`).
- **Wanted:** a designed look for both, in one shared email template: the name wordmark at the top, a short heading, the message, and a clear button for the link ("Confirm my recommendation"; "Review this recommendation"), the recommendation quoted in a styled block in the owner's email, and a quiet footer. The look follows the internal pages from Task 6 so email and page match.
- **Constraints (email, not the site):** table-based layout with inline styles, because email apps ignore most stylesheets; works in light and dark mode; the plain-text body stays as the fallback (a `text` part is sent beside the `html` part), with the link shown in full in it; no images needed, so nothing is blocked; the links, tokens and expiry wording stay exactly as they are.
- **Needs:** a way to see it before it is sent, such as a dev-only preview page that renders each email with made-up details (never sent).

Add further tasks below, one per message.
