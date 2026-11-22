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

All eight features are built, reviewed and committed on `feature/ui-update` (2026-11-21 to 2026-11-22).

- **Feature 1, hero backgrounds:** a different set of floating icons on each hero, circuit lines that light up near the pointer, random data-transfer pulses, and a redesigned contact button and panel.
- **Feature 2, page transitions:** slide-and-fade between pages, with the direction following the page order.
- **Feature 3, homepage gaps:** a longer gap between homepage sections.
- **Feature 4, View all buttons:** quieter "View all" buttons.
- **Feature 5, project cards:** logo tiles slide out on hover and show the tool name; the card lifts and glows, the other cards dim, and the Lunas award badge sits on the image corner.
- **Feature 6, More about scroll:** a fix so "More about" lands on the right card.
- **Feature 7, skills:** a logo-only list; hovering a logo shows its name and level in a small label above it.
- **Feature 8, certificates:** a fixed 16:9 frame that grows to the card edges on hover, with a glow and dimming of the other cards.

## Decided against or later

- **Rejected:** a shorter hero with an "Open to work" badge (the hero rework covers it) and numbered section labels (too common, does not match the site's UI).
- **Later, after the recorded features:** achievements and experience cards, recommendation quote cards, and the typography pass.

## New UI tasks

**Task 1: Hero availability moves to About Me** (planned 2026-11-22, homepage only, built 2026-11-22, awaiting review in the browser).

- Remove "Open to internship and junior developer roles" from the hero.
- Add it to the About Me quick facts as a fourth row, "Open to: Internships and junior developer roles", placed last, and tighten the closing About Me paragraph so it does not repeat it.
- Decided: change "Aspiring Software Developer" in the hero tagline to "Software Developer", together with the metadata and JSON-LD descriptions that use "aspiring". Both changes are one cleanup task.

- **Bundled:** no underline on the hero contact links when hovered (underlines currently appear on them).
- **Bundled (2026-11-22): "Open email app" button look.** In the Get in touch panel the button becomes a rounded rectangle that matches the panel's input fields, with a small envelope icon in an accent-contrast tile on the left. The label stays "Open email app". On hover the diagonal shine from the Top 8 National badge passes once and the arrow still nudges right; reduced-motion users get neither. It stays right-aligned and fills the panel width on phones. Plain CSS and an inline SVG icon, so it works with no JavaScript or CSS.

**Task 2: About Me stat badges** (planned 2026-11-22, homepage only, not started). The three badges (Top 8, 2 national competitions, 5 certifications) are static.

- **Chosen:** (1) hover reveals what is behind the number: the competitions by name, the certificates, the SIKAPTala result and project; (2) each badge links to its evidence: Top 8 to the Lunas card, competitions to `/achievements`, certifications to the certifications section, with the same lift and glow as the other cards.
- **Kept in reserve, in case the two chosen are not satisfying:** (3) count-up of the numbers when the row scrolls into view (final numbers with no JS or reduced motion); (4) a small icon per badge in a teal tile, like the Lunas award badge; (5) the diagonal shine from the Lunas badge on hover.
- **Decided (2026-11-22):** the hover reveal is a small label above the badge, like the skills labels: no layout shift, plain CSS, and the same pattern as the skills logos. How the details show on touch screens is settled when it is built. The flip and the expanding card are not used.
- **Watch:** the revealed details must stay accurate when the counts change.

**Task 3: Achievements logo tiles** (planned 2026-11-22, homepage Achievements card, not started). The homepage Achievements section is one card holding two entries (SIKAPTala 2026 and iSITE 2025).

- **Chosen:** logo tiles that appear on hover, like the project cards. Hovering shows the tiles for both entries, and clicking leads to the actual achievements page.
- **Decided tiles (tech stacks only):** SIKAPTala: Next.js, Tailwind CSS, TypeScript (the Lunas stack); iSITE: C#.
- **Decided:** hovering the card shows both sets at once, and the whole card is one link to the achievements page (not to each entry). The "View all achievements" button stays where it is, below the card.

**Features to visit later** (ideas for the achievements page and card, not chosen yet):

- Same hover treatment as the project cards on `/achievements` (lift, glow, dimming of the other card, More about fade-in).
- An award badge on the image corner, like the Lunas one ("Top 8 National", "National Contestant").
- Photo peek: hovering the thumbnail cycles through the event photos.
- A timeline layout with year markers.
- Meta (date, role, result, team size) as chips with small icons.

**Task 4: Skills card hover** (planned 2026-11-22, homepage skills card, not started). Replaces the earlier idea of group descriptions, which is set aside for now.

- **Wanted:** hovering the skills card highlights it, then a shine sweeps across it like the Top 8 National badge, then the tool logos move up and down one by one in the same direction as the shine.
- **Proposed:** a teal ring and tint like the project cards; the shine is a left-to-right diagonal band; the logos bob in order from left to right, one pass per hover. No layout change, so nothing below the card moves.
- **Decided:** the skills card and the certificate cards dim each other: hovering the skills card dims the certificates, and hovering a certificate dims the skills card. The shine and the bob play once per hover.
- **Set aside:** short descriptions on "Front-End Development" and "Game Development" (for example "The tools I use to build websites"), with the no-extra-height rule.
- **Tidy when touched:** `homepage.template.html` has two tags on one line near line 382 (`<div class="card summary-card">` and `<div class="skills-summary">`), left over from an earlier edit.

**Task 5: Experience grouping** (planned 2026-11-22, homepage Experience card, not started).

- **Group** the two DEVCON Laguna roles (Operations and Procurement Lead, Student Volunteer) under one DEVCON Laguna entry.
- **Vertical timeline only on the DEVCON roles:** a thin line and a dot per role inside that group. The Victowin entry has no timeline.
- **Hover glow per organization**, not per role: hovering DEVCON Laguna lights up the whole group, hovering Victowin lights up its entry.
- **Kept in reserve:** hover dimming of the other organizations, an organization logo or initials tile, date chips in monospace, a short detail line on hover (needs the no-layout-shift rule).

**Task 6: Recommendations empty state** (planned 2026-11-22, homepage Recommendations section, not started). Today it is one card with a single line of text and two buttons.

- **Ghost quote card:** a dashed-border card with a large faint teal quote mark and two or three pale skeleton lines where the quote and name will go. On hover the dashed border turns solid teal with a soft glow.
- **Invite-led content:** a speech-bubble icon, the heading "Be the first to recommend me", and a one-line three-step hint: write it, I confirm it, it appears. "Write a recommendation" is the main teal button; "View all recommendations" moves out of the card (see the bundled change below).
- **Shown only while the list is empty.** It disappears automatically once real recommendations exist. The `/recommendations` page has its own empty state; reuse the same look there.
- **Kept in reserve:** three ghost skeleton cards fading down the section as a layout preview.
- **Bundled change (from Task 8):** "View all recommendations" leaves the card and sits outside it, below the card, in the same style as the other "View all" links. "Write a recommendation" stays in the card as the main button.

**Task 7: Back to top in the "On this page" menu** (planned 2026-11-22, homepage, not started).

- A "Back to top" row as the last item of the menu, under Recommendations, set apart by a thin divider and quieter text.
- It goes to the hero, the true top of the page (not About Me, which is already the first menu row).
- It fades in only after the visitor scrolls past the hero; smooth scroll, instant with reduced motion; without JavaScript it is a plain link to the top.
- Wide screens only, where the menu exists. No button on narrow screens.

**Task 8: "View all" links as bare text** (planned 2026-11-22, all "View all" buttons, not started).

- Remove the outer button rectangle so each "View all" is bare text.
- On hover, a horizontal line grows from the first letter and another from the last letter, outward, until they fill the width of the content area.
- Bundled with Task 6: "View all recommendations" moves out of the recommendations card and becomes one of these links.
- Decided: on desktop no arrow, only the hover lines. On narrow and touch screens (no hover) the link stays bare teal text, with a small arrow and a short static line on each side so it still reads as a link, and a comfortable tap height. The outer buttons do not come back.

**Task 9: Footer redesign** (planned 2026-11-22, all pages, not started). Reference: the footer of ctiancrndng.dev (a classmate's portfolio; WebFetch cannot read it because it needs JavaScript and a keypress, so use the browser pane). Ours today is one centered row of four contact links and a copyright line.

- **Name block:** the name "Charles S. Carreon" as a small wordmark with a one-line tagline under it, so the footer has an identity.
- **Latest projects column:** Lunas, TRIGGR, MUTED and OUTRUN, linking to their project cards. (Added on the edge of a decision.)
- **Info strip:** location (Cabuyao, Laguna) and email, on a divider line at the top of the footer.
- **Availability line:** a small teal status dot with "Open to internships and junior developer roles" (it leaves the hero in Task 1).
- **Social links as icon buttons**, labelled with the website name (GitHub, LinkedIn, Facebook, Email). On hover the website name slides left and fades out, then the handle or username slides in from the right and fades in.
- **Not doing:** a navigation column (the "On this page" menu stays visible at the footer, so it would be redundant); a back-to-top arrow in the footer (Task 7 stays menu-only, wide screens).
- **Review:** once the footer is built it gets an extensive review before it is considered done.
- **Bundled:** no underline on the footer links when hovered (underlines currently appear on the contacts).

**Task 10: Homepage background grid** (planned 2026-11-22, homepage, not started). Reference: the square grid background on ctiancrndng.dev. Ours is a flat dark surface below the hero, so the look changes abruptly at the hero's edge.

- **Try first:** a dot grid. Small dots at the grid crossings, on the same 28px step as the hero's circuit lines, page-wide at very low opacity, with a lower-contrast variant for the light theme. Plain CSS background (no JavaScript, works with no JS), scrolling with the page (not fixed, which is heavier on phones). It stays behind everything; the opaque cards keep text clear.
- **Other options, to decide later:** a faint line grid (1px lines at about 3 to 4% opacity, closest to the reference but the busiest); a grid that fades out below the top of the page (keeps reading areas clean but brings back an edge); leaving the background flat.

Add further tasks below, one per message.
