# Charles S. Carreon · Portfolio

[![Live](https://img.shields.io/badge/live-charlescarreon.dev-2dd4a7)](https://charlescarreon.dev/)
![HTML](https://img.shields.io/badge/HTML-CSS-orange)
![JavaScript](https://img.shields.io/badge/JavaScript-yellow)

My personal portfolio as a Computer Science student and aspiring software developer. It showcases my projects, skills, and experience.

Built with **pure static HTML, CSS, and JavaScript**, with no frameworks, build steps, or external dependencies.

## Pages

- [`/`](https://charlescarreon.dev/) · About, experience, achievements, education
- [`/projects`](https://charlescarreon.dev/projects) · 8 software, web, and game projects
- [`/skills`](https://charlescarreon.dev/skills) · skills and tools across 5 categories

## Local Development

Requires only [Node.js](https://nodejs.org/) (no npm).

```bash
node dev/serve.js
```

Or double-click `dev/serve.bat`. Open `http://localhost:8123`.

The server mirrors production's clean URLs: `/` and `/projects` resolve directly, and `.html` paths redirect to their clean equivalents.

## Deployment

Hosted on Vercel, auto-deploying on push to `main`. Clean URLs are enabled via `vercel.json` (`cleanUrls: true`). The `dev/` folder is excluded from production deployments through `.vercelignore`.
