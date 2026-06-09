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
| `collection` | _not yet wired_ |
| `announcement-bar` | _not yet wired_ |

## Shopify

- Browser never calls Shopify directly — all Storefront calls go through `lib/shopify/*` (server-only).
- New Shopify call → add to `lib/shopify/*`, expose via `app/api/*` Route Handler.
- Customer Account API uses PKCE — see the `shopify-customer-auth` skill.

## Docs

- [`AGENTS.md`](./AGENTS.md) — project map, skill/rule index, hard rules
- [`docs/runbook.md`](./docs/runbook.md) — env setup, dev store, tokens, webhooks
- [`docs/next-steps.md`](./docs/next-steps.md) — deployment + validation checklist
- [`design-system-docs/`](./design-system-docs) — component + token MDX reference
