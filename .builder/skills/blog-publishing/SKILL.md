---
name: blog-publishing
description: Govern drafting, validating, scheduling, publishing, updating, and archiving Builder CMS blog entries.
---

Start from the structured brief and validate every artifact with `scripts/blog/validate-blog.ts`.
Treat `docs/skills/blog-publishing.md` as the single source of truth for workflow, prompt defaults, editorial quality, and policy.
For an ordinary “create/write a blog” request, derive safe values from the approved editorial profile and existing taxonomy, default to English and **draft**, and ask one bundled clarification only for unresolved required facts that cannot be loaded from Builder.
Use only approved brand voice profiles, taxonomy values, and Builder Media assets with complete rights metadata. Every post needs relevant imagery before it is considered preview-ready; unresolved rights keep it in draft.
Match the long-form editorial quality bar: useful framing, source-backed analysis, scannable H2/H3 structure, comparison or decision support when relevant, explicit tradeoffs, practical next steps, visible sources, and FAQs only when genuinely useful.
Keep a primary-source citation ledger and resolve copyright, originality, SEO, accessibility, and schedule gates. The app shell owns the single H1; Builder article blocks start at H2 and supply visible FAQ/source content for JSON-LD.
Preview the exact saved draft through `/preview` and verify the H1, imagery, responsive reading layout, blocks, links, citations, CTA, and absence of leaked script text before any publish/schedule action.
Write to Builder CMS through MCP as a draft first; publish, schedule, update, or archive only after re-reading and validation.
Fail closed on missing evidence, invalid rights, legal risk, or authorization; legal failures are never overridable.
Record authorized non-legal overrides without secrets, hidden reasoning, or chain-of-thought.
Do not hand-maintain agent copies: published HTML is canonical, while `/blog/{slug}.md` and `/llms.txt` are generated from the same public Builder data.
