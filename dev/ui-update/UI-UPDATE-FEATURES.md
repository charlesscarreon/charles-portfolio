# UI Update: Feature Log

Copy of the Claude doc "UI Update: Feature Log", saved 2026-11-21. The doc is the live version; this file is a backup inside the repo and was last refreshed on 2026-11-21. Statuses below say what is built; features 5 and 7 are built (2026-11-22).

## Ground rules

- **Plan mode only.** No code or file changes until Charles says so in a message.
- **One UI feature per message.** Each message is a new feature unless it answers a question from the previous one.
- **Every discussed feature is recorded here** so none is forgotten.
- **Branch:** the UI work gets its own branch off `main` (suggested name `feature/ui-update`). Charles runs all git commands.
- **Preview:** Charles checks changes locally with `dev/serve.bat` (opens `http://localhost:8123`).
- **Standing constraints:** the site must still work with no JavaScript and no CSS, with no dependencies and ES5-only script. Dark theme stays the default, with the light theme kept. Reduced-motion users get no animation.

## Site-wide: every page

### Feature 1: Floating objects in the hero backgrounds

Status: **built** on 2026-11-21 (branch `feature/ui-update`), with changes after review (see "Built as changed" at the end). Charles finds the heroes boring and wants floating objects behind them, different on each page.

**Decisions (2026-11-21)**

- **Style:** thin outline icons in a faded teal, matching the site.
- **Placement:** random on every visit. A short ES5 script scatters the objects on page load. With no JavaScript, a fixed layout appears instead.
- **Intensity:** subtle. About 8 objects per page at roughly 12 to 20% opacity, with a slow drift. Text stays fully readable.

**Objects per page** (proposed; Charles can change any)

| Page | Objects |
| --- | --- |
| Home | Code brackets, `</>`, dots, a terminal prompt |
| Projects | Game controller, cube, gear, puzzle piece |
| Skills | Wrench, gear, chip, braces |
| Achievements | Trophy, star, medal, laurel |
| Experience | Briefcase, clock, calendar, ladder of steps |
| Recommendations | Quote marks, speech bubble, heart, star |

**How it works**

- Each hero gets one decorative layer behind its text. Objects are inline SVG in a hidden-from-screen-readers layer (`aria-hidden`), so they add nothing for assistive technology, and they never block clicks.
- Each object drifts and slowly rotates with a CSS animation, with its own speed and delay so they do not move in sync.
- Random positions avoid the center column where the text sits, so the name and tagline stay clear.
- **Home hero:** it shrinks as you scroll. The layer fades out and stays inside the hero with it.
- **Both themes:** teal on dark by default, and a deeper teal on light so it stays visible but quiet.
- **Reduced motion:** objects are shown still, with no drift. **Print:** the layer is hidden.
- **Fallback:** no CSS or JavaScript shows no objects at all, and the page reads exactly as before. With CSS and no JavaScript, the fixed layout appears.
- **Cost:** a few small inline SVGs per page and a small script. No library, no image files, and only `transform` and `opacity` animate, so it stays smooth.

**Photos in the floating objects (decided 2026-11-21):** not used. Charles considered adding dimmed project screenshots to Projects and Achievements and chose icons only, to keep the heroes clean. Revisit only if asked.

### Feature 2: Page slide-and-fade transitions

Status: **built** and confirmed working on 2026-11-21. It needs `transitions.js` (linked from the head of every page) and the "Page transitions" section of `styles.css`. The theme switch is not kept in place, because it sits in a different spot of the sidebar on each page.

**The idea**

- **Going forward** (View all, or any link from the homepage to a subpage): the current page slides left and fades out, then the new page slides in from the right and fades in.
- **Going back** (Back to Home): the current page slides right and fades out, and the homepage comes in from the left and fades in, so both pages move in the same direction.

**How:** the browser's cross-document View Transitions. One CSS rule opts each page in, the animations are written in CSS, and a few lines of ES5 script tell the browser whether the move is forward or back. No library, no framework and no build step.

**Support and fallback**

- Works in Chrome and Edge 126+ and Safari 18.2+. Firefox support is partial or off, so there pages simply load as they do today.
- With no JavaScript, the transition still runs but cannot tell forward from back, so it would use one default direction or a plain fade.
- Users who prefer reduced motion get no transition.

**Smoothness:** the old page stays on screen until the new one is ready to paint, so there is no blank flash. The animation starts after the new page has loaded, so the wait is the normal page load, with the slide on top. If a page takes longer than about 4 seconds, the browser skips the animation and just navigates.

**Planned defaults** (can be changed): about 350 ms, a slide of about 4 rem (not the full screen width) with the fade, the theme switch and page header staying put, and the browser's own back button also animating.

**Between subpages (decided 2026-11-21):** the motion is vertical and follows the order of the sections on the homepage: Projects, Achievements, Skills, Experience, Recommendations. Moving to a page lower in that order is a downward motion, and moving to one higher up is an upward motion.

| From → to | Motion |
| --- | --- |
| Projects → Achievements, Skills, Experience or Recommendations | Downward |
| Any of those → Projects | Upward |
| Skills → Experience | Downward |
| Experience → Achievements | Upward |

Homepage to a subpage (forward) and a subpage back to the homepage stay horizontal, as described above. "Downward" is read as the way scrolling down feels: the old page slides up and fades out while the new one rises in from below, and the reverse for upward. Charles can flip this reading at build time.

## Homepage layout

### Feature 3: Longer gap between homepage sections

Status: **built** on 2026-11-21. Homepage only.

- **Gap:** about 80 px between sections on desktop, up from 40 px, and about 56 px on phones. Space only, with no divider line.
- **Why:** each section (About, Projects, Achievements, Skills, Experience, Recommendations) reads as its own topic.
- **Unchanged:** other pages keep their current spacing, and the sticky table of contents and scroll offsets are not affected.

**Decisions (2026-11-21)**

- Gap size: about 80 px.
- Divider line: no.
- Button style: outlined pill with an arrow.

### Feature 4: Quieter "View all" buttons

Status: **built** on 2026-11-21. Homepage only.

- **Today:** each homepage section ends with a solid teal pill (View all projects, achievements, skills and certifications, experience, recommendations). Together with the "Write a recommendation" pill they are the loudest items on the page.
- **New look:** an outlined pill with teal text, a thin teal border and a small arrow (for example "View all projects →"). On hover or focus it fills lightly with teal. Slightly smaller padding than now.
- **Scope:** the five "View all" buttons and the "Write a recommendation" button next to the recommendations one, so the pair match. The hero "Get in touch" button and the contact dialog buttons stay solid.
- **Fallback:** they remain ordinary links, so they work and read fine with no CSS or JavaScript.

## Projects

### Feature 5: Projects hover effect

Status: **built** on 2026-11-22. Project cards show logo tiles that slide out on hover and expand to their name, a quiet More about button, a lift, glow and dimming of the other cards, and the Lunas award badge on the image corner. Inspired by the services cards on [axcelaph.com](https://axcelaph.com/), restyled to match this site (teal accent, dark default, light theme kept).

**What the reference does** (from Charles's screenshots; the page's CSS and script could not be read, so timing and easing are not known):

- At rest, the card is plain: a number, a category label, a title, a description, grey tag pills and a link.
- On hover, the card takes on an accent tint, the title takes the accent color, and the tag pills gain filled accent chips for the tools.
- A vertical stack of tech-logo tiles (Unity, Godot, C#, Blender) appears at the card's right edge, overlapping it, with a small animation.

**Plan for this site**

- **Where:** the five cards on `/projects` first. The three featured cards on the homepage can follow if wanted.
- **Hover and keyboard focus** do the same thing: the card tints with a low-opacity teal, the title turns teal, and the technology list becomes filled chips.
- **Tech tiles** slide out from the card's right edge one after another (short stagger, about 40 ms apart), then settle. They use the existing card colors for their tile background so they work in both themes.
- **Touch screens and small screens:** there is no hover, so the tiles are shown at rest as a small row inside the card instead of overlapping its edge.
- **No CSS, no JavaScript:** this is CSS only. The tiles are decorative images with empty `alt`, and the real tool names stay as text in the existing Technologies line.
- **Reduced motion:** the tiles appear with no movement.
- **Cards stay as they are** otherwise: the existing lift on hover, the details dialog and the GitHub links are unchanged.

**Tiles per project** (taken from each card's Technologies line)

| Project | Tiles |
| --- | --- |
| 964's C# Game Development Toolkit | C#, .NET, Unity |
| OUTRUN | Unity, C# |
| TRIGGR | Unity, C#, Photon |
| MUTED | Unity, C#, Python, ONNX Runtime |
| Lunas | Next.js, Tailwind CSS, TypeScript |

**Questions asked (answered below)**

- The repo has no tech logos. Do you want to download the official SVGs yourself into a new `images/tech/` folder, or should I draw simple neutral tiles (the tool's initials, such as C# or Py) so there are no logo files to manage?
- Should the effect also apply to the three featured cards on the homepage now, or only `/projects`?

**Decisions (2026-11-21)**

- **Logos:** Charles downloads the official SVG logos himself into a new `images/tech/` folder, named in lowercase: `csharp.svg`, `dotnet.svg`, `unity.svg`, `photon.svg`, `python.svg`, `onnx.svg`, `nextjs.svg`, `tailwindcss.svg`, `typescript.svg`. Each tile shows the logo on a plain tile background so dark logos (Unity, Next.js) stay visible in both themes.
- **Where:** `/projects` for sure. Charles is unsure about the homepage, so for now it is included there too (the three featured cards: OUTRUN, MUTED, Lunas). It can be switched off later by removing one class.
- **Still open:** none for this feature. The build waits for Charles's go-ahead and the logo files.

**Follow-up added 2026-11-21: "More about" only on hover**

- **Behavior:** the "More about" button is hidden at rest and fades in when the project card is hovered or has keyboard focus. Its space is reserved so the card does not jump. Clicking anywhere on the card still opens the more page or panel, whether or not the button is used.
- **On `/projects`:** the whole card already opens its panel when clicked (the script does this). Only the "More about" button is hidden. The "Source on GitHub" link stays visible and keeps working on its own. The button is hidden only when the script is running, so with no JavaScript it stays visible and works.
- **On the homepage featured cards:** the card is not clickable today. The existing link is stretched over the whole card using CSS, so a click anywhere goes to the project's panel on `/projects`, with no JavaScript needed.
- **Fallbacks:** with no CSS, the button is plain visible link text. On touch screens, where nothing can be hovered, the button stays visible in a quieter style, the same as the certificate buttons (Feature 8).
- **Accessibility:** each link gets a name that includes the project (for example "More about OUTRUN"), and reduced-motion users get no slide.

### Feature 6: "More about" lands on the right card

Status: **built** on 2026-11-21 (`script.js`). A fix to existing behavior, tied to the featured project cards on the homepage.

- **Problem:** the homepage "More about OUTRUN / MUTED / Lunas" links go to `/projects#outrun-detail` (and the matching MUTED and Lunas panels). The panel opens, but the page behind it stays at the top of `/projects`, in the hero, instead of at that project's card.
- **Cause:** the script that settles the page position for a deep link deliberately skips any target that is a project panel (`.project-dialog`), because the panel is hidden until opened and has no position of its own. So no scroll happens, and the panel opens over the hero.
- **Fix:** when the link points at a panel, scroll to the project card that contains it (`#outrun`, `#muted`, `#lunas`), using the same settling logic the other links use, and open the panel as now. Closing the panel leaves the page on that card.
- **Also fixes:** any shared link of the same kind, such as `/projects#triggr-detail`.
- **Without JavaScript:** nothing to change. The panels are shown inline inside the cards, so the browser already scrolls to the right place.
- **Files touched when built:** `script.js` only. The homepage links stay the same.

## Skills and certifications

### Feature 7: Skills section and proficiency levels

Status: **built** on 2026-11-22 (awaiting review): logo chips with three level dots and one legend, on `/skills` and the homepage. Direction chosen on 2026-11-21. Charles dislikes the look of the skills section and the proficiency levels but has no rework in mind.

**Today:** on `/skills` there are five category cards (Front-End, Back-End, Programming, Game Development, Tools) with 20 skills. Each skill is a row with the name on the left and a colored pill on the right: Familiar (blue), Proficient (yellow) or Advanced (green). The homepage shows a smaller version with two groups. The three colors compete with the teal accent, and repeating a word-pill on every row makes the list look busy.

**Options**

| Option | What it looks like | Trade-off |
| --- | --- | --- |
| A. Logo chips | Each skill is a chip with its tech logo and name, grouped by category. | Most visual and ties in with Feature 5's logos. Needs about 15 more logo files (none for the command line). |
| B. Level dots | Plain rows, with a 3-dot indicator instead of the colored word pill, and one legend at the top. | Smallest change and cleanest. Less visual than A. |
| C. Chips by confidence | No ratings per row. Two groups: "Use regularly" and "Learning" (or similar). | Fewer claims to defend. Loses the Advanced level. |
| D. No levels | Chips only, grouped by category. | Simplest and avoids self-rating. Gives recruiters less signal. |

**Recommendation:** A with B's level shown as a small dot indicator on each chip, and a single legend line instead of a word on every row. The level word stays in the markup, so a screen reader and the no-CSS view still say Familiar, Proficient or Advanced.

**Open questions**

- Which option, or which mix?
- Should the levels stay, be renamed, or go?

**Decisions (2026-11-21)**

- **Direction:** option A with level dots. Logo chips grouped by category, a small dot indicator on each chip and one legend line instead of a word on every row.
- **Levels:** keep Familiar, Proficient and Advanced, shown more subtly. The level word stays in the markup.
- **Applies to:** `/skills` and the two groups in the homepage Skills section.
- **Logos needed in `images/tech/`** (shared with Feature 5; named in lowercase): `html.svg`, `css.svg`, `javascript.svg`, `react.svg`, `bootstrap.svg`, `php.svg`, `laravel.svg`, `mysql.svg`, `java.svg`, `godot.svg`, `git.svg`, `github.svg`, `docker.svg`, `figma.svg`, `vercel.svg`. `csharp.svg`, `python.svg` and `unity.svg` are already on the Feature 5 list. Command Line Interface has no logo, so it gets a simple drawn terminal icon.
- **Still open:** the exact dot design (three dots versus three bars) and where the legend sits. To be settled when the build is approved.

### Feature 8: Certifications hover

Status: **built** on 2026-11-21, with changes after review (see "Built as changed" at the end). Applies to the five certificate cards on `/skills` and the three on the homepage.

**Behavior**

- **Hover or keyboard focus** highlights one certificate: the card lifts slightly, its border turns a stronger teal with a soft glow, and the thumbnail zooms a little.
- **The other certificates dim** to about 65% while one is hovered. This uses `:has()`; in a browser without it, only the hovered card is highlighted.
- **The whole card is one link.** Clicking anywhere on it opens the certificate in a new tab, as the button does today. This is done in CSS by stretching the existing link over the card, so no JavaScript is needed and tags and text stay as they are.
- **The "View certificate" button appears on hover** with a short fade and rise. Its space is reserved, so cards do not jump. It also appears on keyboard focus, so tabbing still reveals it.

**Button changes**

- Shorter: about 26 px tall instead of the current full-height pill, with smaller text.
- Quieter: an outlined button with teal text instead of the solid teal fill. It fills on hover or focus.
- **Fallback:** with CSS or JavaScript failing, or on touch screens where nothing can be hovered, the button simply stays visible and clickable, in the quieter style on touch screens.
- **Accessibility:** each link gets a clear name that includes the certificate title (for example "View certificate: Proficiency Certificate"), since the whole card now acts as the link. Reduced-motion users get no lift, zoom or slide.

**Decisions (2026-11-21)**

- Dim the other certificates while one is hovered: yes.
- Touch screens: the quiet button is always visible.

## On hold: earlier recommendations

Decided on 2026-11-22, after Features 1 to 8 were built.

- Hero shorter, with an "Open to work" badge and three key facts: **rejected.** The hero rework (Feature 1) already covers what Charles wants.
- Numbered section labels such as "01 — About": **rejected.** Too similar to other portfolios, adds nothing of note, and does not match the site's UI.
- Cards for achievements and experience (consistent borders, accent bars, date chips): **later**, after all the recorded features are done. Project cards are covered by Feature 5.
- Typography and spacing (tighter heading scale, monospace for dates and labels): **later.** The other UI work already changes the text, so it is revisited afterwards.
- Recommendation quote cards with an initials avatar and a relationship tag: **later**, for the same reason as the other cards.

## Built as changed

Changes that were agreed after review and are not in the original plans above.

- **Hero background (Feature 1):** each icon has no label. On top of the icons, faint circuit traces (straight lines, right angles, square pads) show only in a soft circle around the mouse, with a glow and small pulses; the light is full strength to the middle of the hero and gone by 85% of the way down, so the boundary with the content stays dark. A few traces run on past the bottom of the hero and also show only near the pointer. Every few seconds a random trace lights up and a bright segment runs along it, like data being sent. Reduced motion: no pulses and no data transfer. Touch screens: no cursor effect.
- **Certificates (Feature 8):** the image frame is a fixed 16:9 on every card with no background, padding or border. The image fills it without stretching, and on hover it grows out to the card's top and side edges. The two Wadhwani images were edited by Charles.
- **Get in touch button and panel:** the hero button keeps its text "Get in touch". Hovering lifts it and shows a second, panel-coloured button behind it, and the two act as one. Clicking grows the panel out of that second button; closing (Close button, outside click or Esc) shrinks it back, then the teal button slides down. The panel heading is "I'd love to hear from you", the subject is "Portfolio Inquiry", and the message box is smaller. The panel layout was redesigned (icon, intro line, labelled fields, divider above the action).
- **Project cards (Feature 5):** the logo tiles slide out of the card's right edge, slowly and one after another, and each widens on hover to show its name. The card lifts 0.25rem and gets a thin teal ring and a soft teal shadow; the other cards dim to 65% opacity, as on the certificates. The Lunas award badge rests on the image's top-left corner (its left edge just outside the image, the image's top edge through it) and, on hover, moves past the card's top-left corner, grows 20% and shines once. Same behaviour on the homepage featured cards and on `/projects`.
- **Skills (Feature 7):** instead of rows with level pills, every skill is a logo chip. On a pointer device only the logo shows; on hover a small label above it shows the name, three level dots (one for Familiar, two for Proficient, three for Advanced) and the level word. The label never covers the other logos in the row. On touch screens every chip shows in full. The level word stays in the markup, so it also shows with no CSS. There is no legend, since the level is written out on hover.
