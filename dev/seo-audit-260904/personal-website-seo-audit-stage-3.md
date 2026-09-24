# Personal Website SEO Audit

## Stage 3 — Identity and SEO Implementation Audit

**Website:** https://charlescarreon.vercel.app/  
**Scope:** Implementation strategy based on the findings from Stages 1 and 2  
**Out of scope:** Search-engine ranking guarantees and future performance predictions

---

# Executive Summary

Stage 3 converts the technical findings from Stage 1 and the discoverability findings from Stage 2 into an implementation strategy.

The website already has a strong technical SEO foundation and is publicly discoverable. The primary long-term goal is therefore not basic indexing or crawlability.

The main objective is:

> **Create one clear, current, authoritative professional identity centered on the current personal website.**

The current website should act as the central identity source. Professional profiles, projects, public references, and older websites should either reinforce or clearly direct visitors toward that identity.

---

# 1. Name Identity Strategy

## Finding

The public identity currently uses multiple valid name forms:

- **Charles Serrano Carreon**
- **Charles Carreon**
- **Charles S. Carreon**

The full name provides the strongest differentiation, while the shorter name is more ambiguous because multiple people share it.

## Recommended Actions

Establish a deliberate name hierarchy:

### Canonical Full Name

**Charles Serrano Carreon**

Use for formal, structured, and identity-focused information.

### Primary Short/Searchable Name

**Charles Carreon**

Use naturally where the shorter name is appropriate and where discoverability under this name matters.

### Recognized Abbreviated Variation

**Charles S. Carreon**

Treat as a legitimate variation connected to the same person.

Avoid randomly switching between these names without establishing their relationship.

---

# 2. Structured Identity

## Finding

The website already contains strong `Person` structured data.

The primary remaining improvement is to explicitly connect the known name variations.

## Recommended Actions

Add `alternateName` to the `Person` structured data.

Recommended concept:

```json
{
  "name": "Charles Serrano Carreon",
  "alternateName": [
    "Charles Carreon",
    "Charles S. Carreon"
  ]
}
```

Keep the full name as the primary `name`.

## Priority

**High**

---

# 3. Homepage Identity Connection

## Finding

The homepage clearly identifies its owner as a Computer Science student and aspiring software developer.

However, the relationship between the full name and shorter name could be made more explicit in natural visible content.

## Recommended Actions

Consider adding one natural identity statement that connects the name variations.

The wording should:

- Clearly identify the website owner
- Connect the full and shorter names where appropriate
- Include relevant professional context
- Avoid excessive repetition

Do not repeat the name unnaturally for SEO purposes.

## Priority

**Medium**

---

# 4. Professional Identity Consistency

## Finding

The personal website is a strong central source for the professional identity.

However, identity discoverability also depends on whether external profiles consistently represent the same person.

## Recommended Actions

Review major public professional platforms and ensure they use:

- A consistent preferred name
- Compatible professional descriptions
- Accurate current information
- A link to the personal website where appropriate

Relevant platforms may include:

- GitHub
- LinkedIn
- Project repositories
- Competition or event profiles
- Other intentionally public professional profiles

## Priority

**High**

---

# 5. GitHub as an Identity Signal

## Finding

The GitHub username is distinctive but does not immediately communicate the real name to someone unfamiliar with the account.

## Recommended Actions

Ensure the GitHub profile prominently displays:

- Charles Serrano Carreon
- A concise professional description
- A link to the personal website
- Other relevant professional information that is intentionally public

There is **no requirement to change the existing GitHub username**.

The goal is to connect the username with the real professional identity.

## Priority

**High**

---

# 6. External Profile Consolidation

## Finding

Connected public profiles can help people and search systems understand that multiple accounts belong to the same person.

## Recommended Actions

Create a consistent identity network.

```text
Personal Website
       ↕
     GitHub
       ↕
    LinkedIn
       ↕
Projects / Events
```

Where appropriate:

- Profiles should link back to the personal website.
- The website should link to selected professional profiles.
- Name and professional information should remain compatible across platforms.

Only include accounts that are intentionally part of the desired public professional identity.

## Priority

**High**

---

# 7. Dedicated Project Pages

## Finding

The general Projects page provides a useful overview.

Substantial projects may become stronger identity and discoverability signals when they receive dedicated pages containing meaningful information.

## Recommended Actions

Consider dedicated pages for major projects with sufficient material.

A project page could include:

- Project name
- Description
- Personal role
- Technologies used
- Development process
- Screenshots or demonstrations
- Relevant repositories
- Related external links

The **MUTED** thesis project is a strong candidate for a future dedicated page.

Create dedicated pages because the project has meaningful content, not merely to generate more URLs for SEO.

## Priority

**Medium to High**

---

# 8. Old Website Consolidation

## Finding

The previous GitHub Pages portfolio remains publicly available.

An older website can continue representing an outdated version of the same person and may divide the public identity between multiple portfolio sites.

## Recommended Actions

Review the old website and choose an appropriate approach.

### Option 1 — Keep as an Archive

Retain the historical website but add a clear and prominent link to the current website.

### Option 2 — Replace with a Moved Page

Replace the old portfolio content with a simple page informing visitors that the current portfolio has moved.

### Option 3 — Update or Remove Outdated Information

Remove unnecessary personal information and update information that no longer accurately represents the current professional identity.

The primary objective is to make it clear that the current personal website is the authoritative and current source.

## Priority

**Very High**

---

# 9. Content Freshness

## Finding

Professional and academic information naturally changes over time.

Outdated information can weaken the accuracy of the public professional identity.

## Recommended Actions

Periodically review:

- Education status
- Projects
- Skills
- Experience
- Achievements
- Professional goals

Update information when it meaningfully changes.

Do not make unnecessary edits merely to appear frequently updated to search engines.

## Priority

**Medium**

---

# 10. Custom Domain

## Finding

The current `charlescarreon.vercel.app` address is descriptive and suitable for a personal portfolio.

A custom domain is not currently required for basic discoverability.

## Recommended Actions

**No immediate action is required.**

A custom domain may be considered in the future as part of long-term personal branding.

It should not currently take priority over identity consolidation, profile consistency, or project development.

## Priority

**Low / Optional**

---

# Stage 3 Priority Summary

## Very High Priority

### Old Website Consolidation

- Review the previous GitHub Pages portfolio.
- Remove or update unnecessary outdated information.
- Clearly direct visitors toward the current website.
- Establish the current website as the authoritative public portfolio.

---

## High Priority

### Structured and External Identity

- Add name variations to `Person` structured data.
- Standardize the professional identity across major platforms.
- Strengthen the GitHub profile as an identity signal.
- Connect relevant professional profiles to the personal website.

---

## Medium Priority

### Website and Content Development

- Strengthen the visible relationship between name variations.
- Create dedicated pages for substantial projects.
- Keep professional information current.

---

## Low Priority

### Optional Branding Improvements

- Consider a custom domain in the future.
- Improve page-specific social sharing assets when convenient.

---

# Recommended Identity Architecture

The intended long-term relationship between public identity sources can be represented as:

```text
Old Website ──────────┐
GitHub ───────────────┤
LinkedIn ─────────────┼──→ Current Personal Website
Projects / Events ────┤
Other Profiles ───────┘
```

The current personal website should increasingly become the central reference point.

Other public professional sources should reinforce that identity rather than creating separate or conflicting versions.

---

# Final Conclusion

The website does not need a complete SEO rebuild.

The primary implementation goal is:

> **Create one clear, current, authoritative professional identity centered on the current personal website.**

The most important immediate action is to review and consolidate the older GitHub Pages website.

After that, the strongest long-term strategy is:

1. Consistent use of name variations.
2. Explicit structured-data connections between those variations.
3. Connected professional profiles.
4. Accurate and current public information.
5. Distinctive content about genuine projects and work.

---

# Relationship to Previous Stages

## Stage 1 — Technical SEO Audit

Stage 1 established that the website already has a strong technical SEO foundation, including crawlability, metadata, canonical URLs, structured data, and semantic HTML.

## Stage 2 — Name Search and Discoverability Audit

Stage 2 established that the website owner is already discoverable online, but the shorter name **Charles Carreon** is ambiguous without additional context.

## Stage 3 — Implementation Strategy

Stage 3 translates these findings into a practical strategy focused on:

- Identity consolidation
- Profile consistency
- Name variation connections
- Old website consolidation
- Project-based discoverability

---

# Suggested Next Step

After implementing the highest-priority actions, the website can be reviewed again to verify:

1. Whether the old website clearly points to the current identity.
2. Whether name variations are consistently represented.
3. Whether structured data accurately reflects the intended identity.
4. Whether professional profiles form a coherent identity network.
5. Whether the current personal website is becoming the central public reference point.
