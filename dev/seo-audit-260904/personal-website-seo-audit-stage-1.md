# Personal Website SEO Audit

## Stage 1 — Technical SEO Audit

**Website:** https://charlescarreon.vercel.app/  
**Scope:** Technical SEO and machine-readable website structure only  
**Out of scope:** Name-search testing, ranking comparisons, and broader discoverability research

---

## Executive Summary

The website already has a strong technical SEO foundation. Its main pages are crawlable, use readable HTML content, provide descriptive metadata, use clean URLs, define canonical URLs, and include structured data.

The primary opportunity identified during this audit is **identity consolidation**: explicitly connecting the name variations **Charles Serrano Carreon**, **Charles Carreon**, and **Charles S. Carreon**.

### Overall Status

| Area | Status |
|---|---|
| Crawlability | Good |
| `robots.txt` | Good |
| Sitemap | Good; requires maintenance |
| Clean URLs | Good |
| Canonical URLs | Good |
| Page titles | Good |
| Meta descriptions | Good |
| Social metadata | Good |
| `Person` structured data | Strong; identity improvement recommended |
| `sameAs` links | Good; review recommended |
| Project structured data | Good |
| Skills structured data | Good |
| Semantic HTML | Good |

---

# 1. Crawlability and Visible Content

## Finding

Important website content is available as readable HTML text. Search engines and other crawlers can access information about the website owner, education, skills, projects, and experience.

The website does not appear to depend entirely on images or inaccessible JavaScript for important content.

## Recommended Action

**No immediate action needed.**

Continue using:

- Meaningful visible text
- Semantic HTML
- Proper headings
- Text alternatives for important non-text content

---

# 2. `robots.txt`

## Finding

The current `robots.txt` allows crawlers to access the website and references the sitemap.

## Recommended Action

**No immediate changes needed.**

Keep the file simple. Review it only when:

- The sitemap URL changes
- New sections should intentionally be excluded from crawling
- The website structure changes significantly

Do not add unnecessary crawler-specific rules without a clear purpose.

---

# 3. `sitemap.xml`

## Finding

The sitemap contains the website's main public pages using clean URLs.

The current sitemap is manually maintained.

## Recommended Action

Update the sitemap when:

- A significant new public page is added
- A major page is permanently removed
- A page's canonical URL changes
- A page receives a substantial update and the `lastmod` value is being maintained

For the current small website, a manually maintained sitemap is acceptable.

---

# 4. Clean URLs

## Finding

The website uses clean public URLs such as:

- `/`
- `/projects`
- `/skills`

This is preferable to exposing internal `.html` filenames as the primary public URLs.

## Recommended Action

**No immediate action needed.**

Continue using clean, descriptive URLs for future pages.

Examples:

- `/projects/muted`
- `/about`
- `/achievements`

Only create additional pages when they provide meaningful value to visitors and are not created solely for SEO.

---

# 5. Canonical URLs

## Finding

The existing pages define canonical URLs, helping search engines understand which version of each page should be treated as the primary version.

## Recommended Action

**No immediate changes needed.**

For every future public page:

1. Define the intended canonical URL.
2. Ensure the canonical URL matches the public page URL.
3. Avoid pointing multiple unrelated pages to the same canonical URL.

---

# 6. Page Titles

## Finding

Page titles are descriptive and distinguish the homepage from other pages.

The homepage title strongly connects:

- Full name
- Academic or professional identity
- Geographic context

## Recommended Action

Maintain unique, descriptive titles for every significant page.

Because the primary discoverability goal includes searches for **Charles Carreon**, future identity-focused content may naturally include that name variation where appropriate.

Avoid unnatural keyword repetition.

---

# 7. Meta Descriptions

## Finding

The main pages have page-specific meta descriptions that describe their contents and connect them to the website owner's identity.

## Recommended Action

**No immediate changes needed.**

For future pages:

- Write a unique description
- Accurately summarize the page
- Use natural language
- Avoid repeating the same description across multiple pages

---

# 8. Open Graph and Social Metadata

## Finding

The website includes metadata for social sharing, including Open Graph and Twitter/X card information.

## Recommended Action

**No urgent action needed.**

Optional future improvement:

- Homepage: personal or professional portrait
- Project pages: project-specific image
- Other major pages: context-appropriate branded image

This is a low-priority improvement and should not take priority over content or identity work.

---

# 9. Homepage `Person` Structured Data

## Finding

The homepage contains comprehensive `Person` JSON-LD structured data describing the website owner and connecting the website to relevant personal and professional information.

This is one of the strongest parts of the current SEO implementation.

## Recommended Action — High Priority

Explicitly connect the known public name variations using `alternateName`.

Recommended concept:

```json
"alternateName": [
  "Charles Carreon",
  "Charles S. Carreon"
]
```

The primary name should remain the canonical full name:

```json
"name": "Charles Serrano Carreon"
```

### Intended Identity Relationship

```text
Charles Serrano Carreon
        ├── Charles Carreon
        └── Charles S. Carreon
```

This helps establish that the name variations represent the same person.

---

# 10. `sameAs` Identity Links

## Finding

The structured data links the website to public social and professional profiles.

This can help establish a consistent public identity across multiple platforms.

## Recommended Action

Review every profile included in `sameAs`.

Only include profiles that:

- Actually belong to the same person
- Are intentionally public
- Represent an identity intended to be associated with the personal website
- Are reasonably maintained or useful

Professional profiles such as GitHub and LinkedIn are particularly relevant.

---

# 11. Project Structured Data

## Finding

The Projects page uses structured data to describe individual projects and associate them with their creator.

## Recommended Action

**No immediate action needed.**

For future projects:

- Use accurate structured data
- Clearly identify the project's creator or author
- Avoid adding unnecessary Schema.org properties
- Ensure visible page content supports the structured information

Consider dedicated project pages for major projects that have enough material to justify their own pages.

Potential examples:

- `/projects/muted`
- `/projects/<future-project>`

---

# 12. Skills Structured Data

## Finding

The Skills page provides machine-readable information about technical skills.

## Recommended Action

**No immediate action needed.**

Update the information when skills meaningfully change.

Avoid keeping outdated technologies or skill levels solely because they were previously listed.

---

# 13. Semantic HTML and Heading Structure

## Finding

The website uses readable HTML and meaningful headings.

This improves accessibility, human readability, and crawler understanding.

## Recommended Action

**No immediate action needed.**

Maintain the existing approach when adding content.

Recommended general hierarchy:

```text
H1 — Main subject of the page
├── H2 — Major section
│   ├── H3 — Subsection
│   └── H3 — Subsection
└── H2 — Another major section
```

Each page should normally have one clear primary subject represented by its main heading.

---

# Stage 1 Priorities

## High Priority

### 1. Add name aliases to `Person` structured data

Explicitly connect:

- Charles Serrano Carreon
- Charles Carreon
- Charles S. Carreon

This is the most relevant Stage 1 improvement for the long-term goal of reducing ambiguity with other people sharing the same name.

---

## Medium Priority

### 2. Maintain the sitemap

Update the sitemap as important public pages are added, removed, or substantially changed.

### 3. Review `sameAs` links

Ensure all linked public profiles are intentionally part of the desired professional identity.

### 4. Maintain the existing metadata pattern

New significant pages should continue to have:

- Unique title
- Unique meta description
- Canonical URL
- Appropriate social metadata
- Accurate structured data when useful

---

## Low Priority

### 5. Create page-specific social sharing images

Useful for presentation and link previews, but not a priority compared with identity and content improvements.

---

# Final Stage 1 Conclusion

The website does **not** need a complete technical SEO rebuild.

The existing foundation already includes:

- Crawlable content
- A working `robots.txt`
- A sitemap
- Clean URLs
- Canonical URLs
- Descriptive titles
- Page-specific meta descriptions
- Open Graph metadata
- Social sharing metadata
- `Person` structured data
- Project and skills structured data
- Semantic HTML

The primary improvement identified during Stage 1 is **identity consolidation**.

The website already strongly represents **Charles Serrano Carreon**. The next improvement is to explicitly establish that **Charles Carreon** and **Charles S. Carreon** are alternate forms of the same identity.

---

# Next Stage

## Stage 2 — Name Search and Discoverability Audit

Stage 2 should test the website's discoverability from the perspective of someone who knows little or nothing about the person.

Potential searches include:

- `"Charles Carreon"`
- `"Charles Serrano Carreon"`
- `"Charles S. Carreon"`
- `"Charles Carreon" developer`
- `"Charles Carreon" Computer Science`

The goal is not simply to determine whether the website appears in search results.

The main question is:

> When someone searches for **Charles Carreon**, can search engines confidently connect that name to this specific website and professional identity?
