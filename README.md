# builder-nextjs-shopify

Headless **Builder.io + Shopify** sandbox storefront for `builder-jason.myshopify.com`, built on Next.js 16 (App Router) + React 19, running inside **Builder.io Fusion**.

> **AI agents / Fusion:** start at [`AGENTS.md`](./AGENTS.md) — project map, skill/rule index, and hard architectural rules.

## Stack

- **Next.js 16** (App Router) — `proxy.ts` replaces `middleware.ts`; `cookies()`/`headers()` are async
- **Builder.io** Gen-2 SDK (`@builder.io/sdk-react`)
- **Shopify** Storefront API + Customer Account API (PKCE OAuth)
- Tailwind 4 + shadcn/ui (new-york), design tokens in `styles/tokens.css`
- `zod` env validation · `jose` cookie encryption · `sanitize-html` for Builder HTML
- Vitest + Playwright + axe

## Repo layout

```
app/                  Routes + server Route Handlers (api/, preview/, products/, ...)
components/           ui/ · layout/ · marketing/ · shopify/ · builder/
lib/                  env · builder · auth · shopify · cart (server-only where applicable)
utils/                cn · sanitize-html · url · date
styles/tokens.css     design tokens
config.ts             { apiKey, models } — single source of truth for Builder
builder-registry.ts   central RegisteredComponent[] export
proxy.ts              security headers (Next 16 middleware replacement)
.builder/skills/      agent skills (load on demand)
.builder/rules/       scoped .mdc rules
design-system-docs/   component + token MDX docs
docs/                 runbook + next-steps
```

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start local dev server |
| `npm run build` | Production build |
| `npm run lint` / `npm run typecheck` | ESLint / tsc |
| `npm test` | Vitest unit tests |
| `npm run e2e` | Playwright + axe smoke tests |

## Environment

Validated by `lib/env.ts` (zod) — boot fails on missing/invalid values. See [`docs/runbook.md`](./docs/runbook.md) for required vars and how to obtain them.

Key rules (full list in [`.builder/rules/secrets.mdc`](./.builder/rules/secrets.mdc)):

- `SHOPIFY_*` and `SESSION_SECRET` are **server-only** — never in `components/**` or client-side code.
- Only `NEXT_PUBLIC_*` vars reach the browser.
- Tokens encrypted with `jose` before any cookie write.
- Webhooks HMAC-verified with `crypto.timingSafeEqual` on the raw body.

## Builder.io

- Model names live in `config.models.*` — never hardcode strings.
- Always render via `<RenderBuilderContent>`, never `<Content>` directly.
- Pass `userAttributes: { urlPath }` to `fetchOneEntry` for targeting and preview.
- Live preview served only from `app/preview/page.tsx`.

| Model | Wired in |
|---|---|
| `page` | `app/[...page]/page.tsx` (catch-all), `app/page.tsx` (root) |
| `product` | `app/products/[handle]/page.tsx` (optional section) |
| `collection` | `app/collections/[handle]/page.tsx` |
| `announcement-bar` | `builder-registry.ts` |
| `blog-post` | `app/blog/[slug]/page.tsx`, `app/blog/page.tsx` |
| `blog-author` | Resolved by `lib/builder/client.ts` |
| `blog-category` | `app/blog/category/[slug]/page.tsx` |
| `editorial-profile` | Fusion blog-publishing policy source |

## Governed blog publishing

The `blog-publishing` Fusion skill turns a structured brief and approved source material into Builder blog entries. Posts use reusable editorial components from `@jasonyangcis/core-ui`, while this app owns Builder reads, sanitization, styling, SEO, analytics, and public routes.

### Workflow

1. Provide a topic brief plus JSON, an attached PDF, or an API source.
2. Normalize the source into the structured input contract and retain source/page/URL provenance.
3. Load the draft `editorial-profile`, author, category, existing posts, and approved Media Library assets.
4. Draft original copy with citations and approved editorial blocks.
5. Run `scripts/blog/validate-blog.ts` for required fields, links, headings, taxonomy, SEO, dates, citations, and publication state.
6. Save to Builder as a draft first. Publish or schedule only when every required gate passes.

Copyright/originality checks reduce risk but are not legal clearance. Missing sources, unsupported claims, or unapproved assets fail closed and cannot be overridden.

### Structured JSON example

```json
{
  "version": "1.0",
  "project": {
    "name": "Orbital Snowboards",
    "numberOfArticles": 3
  },
  "audience": "Snowboard enthusiasts who enjoy science-fiction themes",
  "contentFraming": {
    "theme": "Space snowboards used on fictional off-world expeditions",
    "seriesName": "Xenosphere Field Transmissions",
    "requiredSections": [
      "Mission profile",
      "Deck visual analysis",
      "System status",
      "Source notes",
      "Call to action"
    ],
    "disclosure": "The orbital setting is fictional. Product details come from linked storefront records."
  },
  "topics": [
    {
      "title": "Hydrogen Deck: Molecular Lines",
      "primaryKeyword": "Hydrogen snowboard",
      "productHandle": "the-collection-snowboard-hydrogen",
      "angle": "Analyze the molecular graphics and H2 visual identity."
    }
  ],
  "sources": [
    {
      "id": "catalogue",
      "type": "api",
      "url": "https://builder-nextjs-shopify-sandbox.vercel.app/api/products?limit=50",
      "required": true
    }
  ],
  "assets": {
    "policy": "builder-media-library-only",
    "requireAltText": true
  },
  "publishing": {
    "mode": "draft",
    "category": "orbital-snowboards",
    "author": "builder-editorial-team",
    "autoPublish": false
  }
}
```

### PDF example

Attach a PDF to the Fusion request with a small manifest:

```json
{
  "type": "pdf",
  "file": "orbital-snowboard-brief.pdf",
  "extract": ["product facts", "audience", "story themes", "required terminology"],
  "citePages": true,
  "requireExtractionReview": true
}
```

Fusion records page-level provenance and keeps the entry in draft when extraction is ambiguous. Do not treat inferred table structure or unreadable text as verified data.

### API example

```json
{
  "type": "api",
  "url": "https://builder-nextjs-shopify-sandbox.vercel.app/api/products?limit=50",
  "method": "GET",
  "mapping": {
    "title": "products[].title",
    "handle": "products[].handle",
    "description": "products[].description",
    "image": "products[].featuredImage"
  },
  "freshness": "fetch-at-draft-time"
}
```

API credentials are never stored in content JSON. Authenticated sources must use an approved server-side integration, and the source URL, retrieval time, and mapped fields remain part of the provenance record.

Implementation details: [`.builder/skills/blog-publishing/SKILL.md`](./.builder/skills/blog-publishing/SKILL.md) and [`docs/skills/blog-publishing.md`](./docs/skills/blog-publishing.md).

## Shopify

- Browser never calls Shopify directly — all Storefront calls go through `lib/shopify/*` (server-only).
- New Shopify call → add to `lib/shopify/*`, expose via `app/api/*` Route Handler.
- Customer Account API uses PKCE — see the `shopify-customer-auth` skill.

## Docs

- [`AGENTS.md`](./AGENTS.md) — project map, skill/rule index, hard rules
- [`docs/runbook.md`](./docs/runbook.md) — env setup, dev store, tokens, webhooks
- [`docs/next-steps.md`](./docs/next-steps.md) — deployment + validation checklist
- [`design-system-docs/`](./design-system-docs) — component + token MDX reference
