# Charles S. Carreon · Portfolio

[![Live](https://img.shields.io/badge/live-charlescarreon.dev-2dd4a7)](https://charlescarreon.dev/)
![HTML](https://img.shields.io/badge/HTML-CSS-orange)
![JavaScript](https://img.shields.io/badge/JavaScript-yellow)

My personal portfolio as a Computer Science student and software developer. It showcases my projects, skills, experience, and recommendations.

The pages are plain **HTML, CSS, and JavaScript**, with no frameworks, build step, or npm packages. A few small Vercel functions (Node.js, built-ins only) run the recommendations feature.

## Pages

- [`/`](https://charlescarreon.dev/) · About, featured projects, achievements, skills and certifications, experience, recommendations
- [`/projects`](https://charlescarreon.dev/projects) · 5 software, web, and game projects
- [`/skills`](https://charlescarreon.dev/skills) · skills and tools across 5 categories, plus certifications
- [`/achievements`](https://charlescarreon.dev/achievements) · competitions and recognition
- [`/experience`](https://charlescarreon.dev/experience) · roles and education
- [`/recommendations`](https://charlescarreon.dev/recommendations) · recommendations and a write form
- `404.html` · the page shown for addresses that do not exist

## How it works

- **Pages:** Vercel serves the static files with clean URLs. The homepage and `/recommendations` are rendered by functions in `api/` from `homepage.template.html` and `recommendations.template.html`, so published recommendations can be inserted. If the database is unavailable, they fall back to a saved copy of the recommendations kept in the repo.
- **Recommendations:** a visitor submits the form and confirms by email, then the owner approves or rejects it from an email link or an owner-only admin page. Approved ones appear on the site. Data is kept in Upstash Redis and email is sent with Resend.
- **Daily job:** a Vercel cron job sends the owner reminders and a weekly digest.
- **Backup:** the admin page can download a JSON backup. `dev\tools\make-snapshot.bat` turns it into the saved copy in the repo.

## Configuration

Set in the Vercel project settings, never committed: `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_REST_API_READ_ONLY_TOKEN`, `RESEND_API_KEY`, `OWNER_EMAIL`, `ADMIN_SECRET`, and `CRON_SECRET`.

## Local Development

Requires only [Node.js](https://nodejs.org/) (no npm).

```bash
node dev/tools/serve.js
```

Or double-click `dev/tools/serve.bat`. Open `http://localhost:8123`.

The server mirrors production's clean URLs: `/` and `/projects` resolve directly, `.html` paths redirect to their clean equivalents, and unknown paths show `404.html`. The recommendations parts show their empty state locally.

Other tools in `dev/tools/` and `dev/previews/` (each has a `.bat` launcher on Windows):

- `preview-recommendations` · the recommendation cards
- `preview-internal` · the admin and confirmation pages, with invented data
- `preview-email` · the emails the site sends
- `preview-social` · the social share image
- `test-fallback` · the site without CSS or JavaScript
- `make-snapshot` · builds the saved copy from a backup

## Deployment

Hosted on Vercel, auto-deploying on push to `main`. `vercel.json` sets the clean URLs, the security headers, and the cron schedule. The `dev/` folder is excluded from production deployments through `.vercelignore`.

## More

- [`dev/docs/CONTEXT.md`](dev/docs/CONTEXT.md) · project notes: constraints, conventions, gotchas and open items
