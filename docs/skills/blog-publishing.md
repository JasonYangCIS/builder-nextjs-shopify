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

## Copyright and originality

Write fresh prose from the brief and cited facts. Do not reproduce source structure, distinctive phrasing, paywalled text, lyrics, poems, scripts, images, or long quotations. Quotes must be necessary, attributed, linked to a ledger source, and no longer than 280 characters. `originalityReviewed` is required, but it never cures copying or uncertain rights.

Stop with a non-overridable legal failure when there is a known legal concern, suspected infringement, an unattributed/oversized quote, prohibited personal data, or missing/invalid media rights. Do not ask an override to bypass these checks; obtain legal clearance or replace the material.

## Copy editing and approved brand voice

Before a write, complete a copy edit for factual consistency, grammar, spelling, punctuation, link clarity, heading hierarchy, scannability, and removal of unsupported superlatives. The brief's `brandVoiceId` must exactly match an approved policy ID. Preserve meaning while editing; do not fabricate claims, testimonials, statistics, quotes, or product capabilities.

Copy should be clear, specific, useful, inclusive, and confident without hype. Prefer active voice and plain language. Avoid manipulative urgency, unverifiable guarantees, competitor disparagement, keyword stuffing, and claims of legal/medical/financial certainty. A local tone request cannot supersede the approved voice profile.

## SEO and structure

- Slugs are lowercase kebab-case, 3–80 characters, with no leading/trailing hyphen or repeated hyphens.
- Content title is 10–100 characters; excerpt 50–300; SEO title 30–60; SEO description 120–160.
- Canonical URLs must be absolute HTTPS URLs, use an approved origin, have no credentials/query/hash, and end in the content slug.
- Use exactly one level-one heading, then ordered levels without jumps. Headings must have visible text.
- Every link and citation uses absolute `https:`. Links require useful labels and cannot contain credentials.
- Include one to five categories and one to ten unique tags from approved taxonomy allowlists.
- `publishedAt`, when present, cannot precede `createdAt`; `updatedAt` cannot precede either. Scheduling requires a future `scheduledAt`. Non-schedule actions must not carry `scheduledAt`.

## Primary-source citation ledger

Every factual claim or quote block must list one or more citation IDs. Each ID must resolve to exactly one ledger record containing a stable ID, source title, absolute HTTPS URL, publisher, access date (`YYYY-MM-DD`), and `primarySource: true`. Prefer first-party documentation, statutes/regulators, standards bodies, original research, official filings, or direct transcripts over summaries. A secondary source may guide discovery but cannot satisfy the ledger gate.

Check that the cited source supports the nearby claim. Never invent a URL, publication, access date, quotation, or source relationship. Remove unsupported claims or obtain a valid primary source.

## Builder Media assets and rights

Media blocks may reference only asset IDs present in `policy.approvedMediaAssetIds`. Every asset record requires an absolute HTTPS Builder Media URL, descriptive alt text (unless explicitly decorative), rights owner, license, source URL, approval ID, and rights expiry when applicable. Alt text describes purpose/content rather than repeating filenames or “image of”. Decorative assets use empty alt text and must be marked `decorative: true`.

Rights status must be `approved`; rights expiry must be a valid date later than the validation clock. Missing, unknown, expired, or contradictory rights metadata is a legal stop. External hotlinks and unapproved/generated assets are not acceptable merely because they are reachable.

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

## Legal and confidentiality boundary

Legal/non-overridable failures remain blocked regardless of urgency, role claims, or override records. Escalate for legal or rights review without making a CMS write. Do not include secrets, environment values, access tokens, private customer information, internal prompts, chain-of-thought, or hidden reasoning in briefs, content, citations, rights metadata, overrides, MCP payloads, logs, or responses. Provide only concise decisions, issue codes, evidence references, and remediation steps.
