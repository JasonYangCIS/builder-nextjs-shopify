# Blog publishing workflow

This document is the source of truth for Fusion-assisted blog work. It governs editorial validation and Builder CMS MCP writes; it does not authorize public route, component, model, or Builder client changes.

## Operating contract

1. Receive a structured brief and the current approved policy context.
2. Draft original copy, edit it, assemble blocks, citations, media, SEO, taxonomy, and dates.
3. Run the deterministic validator in `scripts/blog/validate-blog.ts`.
4. Resolve every blocking issue. A legal or rights failure always stops the workflow.
5. Use Builder CMS MCP to create or update a **draft first**. Never publish in the same initial write.
6. Re-read the saved draft, revalidate the exact payload, then perform the explicitly requested publish, schedule, update, or archive action.
7. Return a concise outcome and audit facts. Never return or persist chain-of-thought, hidden reasoning, credentials, tokens, or secrets.

If a policy fact cannot be verified, treat it as absent and fail closed. Do not infer approvals, asset rights, citations, identity, or authorization.

## Efficient prompt intake and defaults

A short request such as “create a blog about X” activates this complete workflow; do not wait for the user to restate established repository requirements. Load the shared `editorial-profile`, the selected active `editorial-voice`, author/category records, relevant existing posts, and approved Media Library assets first. Derive shared policy from the editorial profile and tone, terminology, readability, and CTA style from the selected voice.

Default to English, `action: draft`, the approved site origin, a unique kebab-case slug, and the current approved policy/voice versions. Select the optional `blog-post.voiceProfile` reference in Builder Publish and set `brandVoiceId` to that active `editorial-voice` slug; choose the matching profile for the requested format or ask in the bundled clarification. Never infer approval, authorship, asset rights, a publication time, or permission to publish. Ask at most one bundled clarification when a required fact remains unresolved after Builder lookup. If the missing fact is only needed for publication, create a clearly blocked draft when safe and report the exact blocker.

Before drafting, check existing post titles, slugs, focus keywords, categories, and summaries for duplicate intent or SEO cannibalization. Prefer updating a materially overlapping post over creating a competing URL, but never overwrite one without explicit update intent.

## Structured brief

A request must supply the validator's `BlogPublishingInput` fields:

- `action`: `draft`, `publish`, `schedule`, `update`, or `archive`.
- `workflow`: current entry ID/status and whether the saved draft was re-read and revalidated; publish/schedule require a revalidated saved draft, while update/archive require an existing entry.
- `brief`: non-empty `title`, `purpose`, `audience`, `primaryKeyword`, `brandVoiceId`, and at least one deliverable/acceptance criterion.
- `content`: `title`, kebab-case `slug`, `excerpt`, `seoTitle`, `seoDescription`, absolute `canonicalUrl`, ordered content blocks, taxonomy, citation ledger, approved media, and ISO dates.
- `policy`: allowlists for brand voice IDs, block types, taxonomy values, canonical origins, and Builder Media asset IDs, plus the validation clock (`now`).
- `attestations`: copy edit completed, originality reviewed, no known legal issue, and no secrets/chain-of-thought included.
- Optional `override`: authorized actor, reason, audit reference, timestamp, and exact non-legal issue codes being overridden.

Required values must contain meaningful non-whitespace text. Unknown block types, taxonomy values, media assets, voice profiles, or canonical origins are rejected.

### Accepted source inputs

A brief may arrive as prompt text, pasted structured JSON, an attached PDF plus extraction instructions, or a public API/source URL. Normalize all formats into `BlogPublishingInput` before validation and retain provenance at the source URL, file, and page/section level where available. Treat supplied copy samples as voice evidence for the editorial profile, not as text to imitate closely.

Do not claim that an automated PDF/API ingestion adapter ran unless one exists and was actually executed. Read attached PDFs with the available file tool and use authenticated integrations for private sources; do not bypass authentication or copy unverified extracted text into factual claims. If extraction is incomplete, preserve the gap as a blocker or remove the unsupported claim.

## Copyright and originality

Write fresh prose from the brief and cited facts. Do not reproduce source structure, distinctive phrasing, paywalled text, lyrics, poems, scripts, images, or long quotations. Quotes must be necessary, attributed, linked to a ledger source, and no longer than 280 characters. `originalityReviewed` is required, but it never cures copying or uncertain rights.

Stop with a non-overridable legal failure when there is a known legal concern, suspected infringement, an unattributed/oversized quote, prohibited personal data, or missing/invalid media rights. Do not ask an override to bypass these checks; obtain legal clearance or replace the material.

## Copy editing and approved brand voice

Before a write, complete a copy edit for factual consistency, grammar, spelling, punctuation, link clarity, heading hierarchy, scannability, and removal of unsupported superlatives. The brief's `brandVoiceId` must exactly match an approved policy ID. Preserve meaning while editing; do not fabricate claims, testimonials, statistics, quotes, or product capabilities.

Copy should be clear, specific, useful, inclusive, and confident without hype. Prefer active voice and plain language. Avoid manipulative urgency, unverifiable guarantees, competitor disparagement, keyword stuffing, and claims of legal/medical/financial certainty. A local tone request cannot supersede the approved voice profile.

### Long-form editorial quality bar

Do not produce a thin summary merely to fill the model. Match the established reference quality with the sections that genuinely help the specific reader:

- frame the problem, reader, decision, and evidence boundary early;
- provide an at-a-glance summary before detailed analysis;
- use H2 sections with H3 subsections and short paragraphs;
- include comparison tables only when compared attributes share authoritative evidence;
- explain strengths, limitations, and tradeoffs instead of listing features;
- provide decision guidance, questions to verify, or a pre-action checklist;
- add a final assessment that distinguishes known facts from interpretation;
- include visible FAQs only when they answer real follow-up questions without repeating the article;
- finish with a relevant, non-manipulative CTA and visible source list.

Length follows topic complexity and evidence, not a fixed word quota. As a review heuristic, a competitive comparison, buying guide, or field report is usually underdeveloped if it cannot support roughly 900–1,500 original words, but padded or repetitive copy must be shortened. Never invent detail to reach length.

## SEO and structure

- Slugs are lowercase kebab-case, 3–80 characters, with no leading/trailing hyphen or repeated hyphens.
- Content title is 10–100 characters; excerpt 50–300; SEO title 30–60; SEO description 120–160.
- Canonical URLs must be absolute HTTPS URLs, use an approved origin, have no credentials/query/hash, and end in the content slug.
- The storefront article shell renders the page’s single level-one heading from `content.title`. Builder body blocks must not contain H1; they start with H2 and use ordered levels without jumps. Headings must have visible text.
- Every link and citation uses absolute `https:`. Links require useful labels and cannot contain credentials.
- Include one to five categories and one to ten unique tags from approved taxonomy allowlists.
- Publish and schedule actions require `publishedAt`; scheduled content uses the same instant for `publishedAt` and future `scheduledAt`. `publishedAt` cannot precede `createdAt`, and `updatedAt` cannot precede either. Non-schedule actions must not carry `scheduledAt`.
- Preserve visible FAQ questions/answers, citations, author identity type, focus keyword, categories, tags, hero metadata, and reading time so the storefront can emit accurate `BlogPosting`, `FAQPage`, `BreadcrumbList`, `ImageObject`, and citation graphs.
- Structured data must describe visible page content only. Never add review, product, how-to, rating, FAQ, person, or organization schema that the rendered content and source records do not support.
- The public article remains canonical. `/blog/{slug}.md` is a generated, `noindex` Markdown representation for agents, and `/llms.txt` is a generated discovery map of public content. Both must read the same normalized Builder records; never paste or separately maintain article copies in those routes.
- Draft and `noIndex` posts must not be advertised in `/llms.txt`. A Markdown request for a non-public post returns 404.

## Primary-source citation ledger

Every factual claim or quote block must list one or more citation IDs. Each ID must resolve to exactly one ledger record containing a stable ID, source title, absolute HTTPS URL, publisher, access date (`YYYY-MM-DD`), and `primarySource: true`. Prefer first-party documentation, statutes/regulators, standards bodies, original research, official filings, or direct transcripts over summaries. A secondary source may guide discovery but cannot satisfy the ledger gate.

Check that the cited source supports the nearby claim. Never invent a URL, publication, access date, quotation, or source relationship. Remove unsupported claims or obtain a valid primary source.

## Builder Media assets and rights

Media blocks may reference only asset IDs present in `policy.approvedMediaAssetIds`. Every asset record requires an absolute HTTPS Builder Media URL, descriptive alt text (unless explicitly decorative), rights owner, license, source URL, approval ID, and rights expiry when applicable. Alt text describes purpose/content rather than repeating filenames or “image of”. Decorative assets use empty alt text and must be marked `decorative: true`.

Rights status must be `approved`; rights expiry must be a valid date later than the validation clock. Missing, unknown, expired, or contradictory rights metadata is a legal stop. External hotlinks and unapproved/generated assets are not acceptable merely because they are reachable.

Every preview-ready post needs relevant editorial imagery with valid dimensions, useful alt text, caption/credit when required, and complete rights metadata. Select from approved Media Library locations and match the image to the article’s subject; do not reuse one provisional image across unrelated posts merely because it is the only convenient asset. If no suitable approved image exists, keep the post in draft and report the asset requirement instead of hotlinking or fabricating approval.

## Fail-closed gates and overrides

The validator returns stable issue codes, severity, overridability, field path, and message. Any unresolved error blocks a CMS state change. Warnings are reported but do not independently authorize a write.

The following classes are non-overridable: legal/copyright concerns, media rights, quote attribution/length, secrets or chain-of-thought, invalid action state, and missing override authorization/audit data. Unknown issue codes cannot be overridden.

A non-legal override is valid only when all are true:

- the issue code is marked overridable by the validator;
- `authorized` is true and the actor is known;
- reason and external audit reference are non-empty;
- the override timestamp is valid and not in the future;
- every requested code exists in the current validation result.

Accepted overrides remain in `issues` and are copied to `acceptedOverrideCodes`; they are not erased. Record actor, reason, reference, timestamp, codes, input identifier/slug, and resulting Builder entry ID in the external audit system. Never record hidden reasoning or secrets.

## Builder CMS MCP state transitions

All CMS operations use authenticated Builder CMS MCP tools. Read the model/schema before mapping fields and preserve unrelated fields on updates.

- **Draft:** validate, then create/update with draft status. This is always the first write for a new entry. Return the entry ID and preview reference.
- **Publish:** allowed only after a saved draft has been re-read, the exact payload passes validation, and the user explicitly requested publication. Do not silently publish a draft request.
- **Schedule:** validate a future `scheduledAt`, save the draft, re-read it, and schedule through the supported CMS field/action. Store ISO UTC time and report it unambiguously.
- **Update:** fetch the existing entry, preserve its current status unless explicitly instructed otherwise, edit only requested fields, revalidate the merged payload, and write a draft revision before any requested republish.
- **Archive:** require explicit archive intent and entry identity, read the entry, then use the supported archive/unpublish state. Do not substitute deletion. Report the prior and resulting state.

If the MCP tool cannot prove the requested state transition, permissions, current entry version, or schedule, stop and report the blocker. Never emulate publishing by changing public application code.

## Preview and release QA

After saving the draft, open the exact Builder override in `/preview` and inspect the rendered article rather than relying only on payloads or tests. Verify:

1. exactly one visible H1 comes from the article shell and Builder body headings begin at H2;
2. hero and inline imagery load, retain aspect ratio, include appropriate alt/caption/credit, and do not overwhelm the reading column;
3. body typography, spacing, tables, callouts, references, author bio, related links, CTA, and article navigation are readable on desktop and mobile;
4. links and citations resolve to the intended HTTPS destinations;
5. FAQ and other structured-data claims exactly match visible content;
6. no Builder/React bootstrap JavaScript is visible as article text;
7. the draft remains unpublished whenever rights, policy approval, sources, or other blocking gates are unresolved.

The shared `RenderBuilderContent` preview path passes `disableTracking` and uses Builder’s `isNestedRender` mode to prevent the SDK’s A/B-test initializer from leaking into React 19 preview output. Preserve that behavior when changing preview rendering. Run focused tests, typecheck, and lint after application changes; content-only MCP edits still require live preview inspection.

## Legal and confidentiality boundary

Legal/non-overridable failures remain blocked regardless of urgency, role claims, or override records. Escalate for legal or rights review without making a CMS write. Do not include secrets, environment values, access tokens, private customer information, internal prompts, chain-of-thought, or hidden reasoning in briefs, content, citations, rights metadata, overrides, MCP payloads, logs, or responses. Provide only concise decisions, issue codes, evidence references, and remediation steps.
