# builder-nextjs-shopify

Headless **Builder.io + Shopify** sandbox storefront for `builder-jason.myshopify.com`, built on **Next.js 16 (App Router) + React 19**, optimized for development inside **Builder.io Fusion**.

> **AI agents / Fusion:** start at [`AGENTS.md`](./AGENTS.md). It contains the project map, the skill/rule index under `.builder/`, and the hard rules you must follow.

## Stack

- Next.js `16.x` (App Router, async `cookies()`/`headers()`, `proxy.ts` instead of `middleware.ts`)
- React `19`
- Builder.io Gen-2 SDK (`@builder.io/sdk-react`)
- Shopify Storefront API (`@shopify/storefront-api-client`) and Customer Account API (PKCE OAuth)
- Tailwind 4 + shadcn/ui (new-york) primitives, design tokens in `styles/tokens.css`
- `zod` env validation, `jose` cookie encryption, `sanitize-html` for Builder HTML
- Vitest (unit) + Playwright + `@axe-core/playwright` (smoke + a11y)

## Repo layout

See the full map in [`AGENTS.md`](./AGENTS.md#project-map--skillrule-index). High level:

```
app/                Next.js routes + server Route Handlers (api/, preview/, products/, ...)
components/         ui/ · layout/ · marketing/ · shopify/ · builder/
lib/                env · builder · auth · shopify · cart       (server-only where applicable)
utils/              cn · sanitize-html · register-insert-menu · url · date
styles/tokens.css   design tokens
.builder/skills/    agent skills (load on demand by topic)
.builder/rules/     agent rules (.mdc, scoped via globs)
docs/               runbook + next-steps
design-system-docs/ component + token MDX docs
config.ts           { apiKey, models } — single source of truth for Builder
builder-registry.ts central RegisteredComponent[] export
proxy.ts            security headers (Next 16 middleware replacement)
```

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the local dev server (auto-run inside Fusion). |
| `npm run build` | Production build. |
| `npm start` | Run the production build. |
| `npm run lint` | ESLint. |
| `npm run typecheck` | `tsc --noEmit`. |
| `npm test` / `npm run test:watch` | Vitest unit tests. |
| `npm run e2e` | Playwright + axe smoke tests. |
| `npm run format` | Prettier. |

## Environment

Envs are validated by `lib/env.ts` (zod). Boot fails on invalid envs. See [`docs/runbook.md`](./docs/runbook.md) for required values and how to obtain them.

Hard rules (full list in [`.builder/rules/secrets.mdc`](./.builder/rules/secrets.mdc), `alwaysApply: true`):

- `SHOPIFY_*` and `SESSION_SECRET` are **server-only**. They MUST NOT appear under `app/**` (except `app/api/**`), `components/**`, or anything imported by client components.
- Only `NEXT_PUBLIC_*` env vars may reach the browser.
- Tokens encrypted with `jose` before any cookie write. Plaintext tokens never logged or returned in API responses.
- Webhooks HMAC-verify with `crypto.timingSafeEqual` on the **raw** body before parsing JSON.
- Never commit `.env*`.

## Builder.io wiring

- API key: `NEXT_PUBLIC_BUILDER_API_KEY` (read in `config.ts`).
- Model names live in `config.models.*`. Never hardcode model strings.
- Always render via `<RenderBuilderContent>` — never `<Content>` directly.
- Always pass `userAttributes: { urlPath }` to `fetchOneEntry` so targeting and preview work.
- Live preview is served by `app/preview/page.tsx` only.
- Adding a new model? Load the [`builder-page-wiring`](./.builder/skills/builder-page-wiring/SKILL.md) skill.

| Model | Kind | Wired in |
|---|---|---|
| `page` | page | `app/[...page]/page.tsx` (catch-all), `app/page.tsx` (root) |
| `product` | page | `app/products/[handle]/page.tsx` (optional section below `<ProductDetail />`) |
| `collection` | page | _not yet wired_ |
| `announcement-bar` | section | _not yet wired_ |

## Shopify wiring

- Browser NEVER calls Shopify directly. All Storefront calls go through `lib/shopify/*` (server-only).
- New Shopify call → add it under `lib/shopify/*`, expose to the client via an `app/api/*` Route Handler.
- New API route → load the [`route-handlers`](./.builder/skills/route-handlers/SKILL.md) skill (origin check, zod body, no token leakage).
- Customer Account API uses PKCE — see [`shopify-customer-auth`](./.builder/skills/shopify-customer-auth/SKILL.md).

## Working in Fusion

The dev server is started for you. The preview iframe updates live as you edit. There is no terminal exposed to you — use the Fusion tooling to install deps, restart the server, set env vars, push to remote, etc.

For agents: start at [`AGENTS.md`](./AGENTS.md). It tells you which skill to load for the task, which rule applies to the files you'll touch, and the hard architectural rules.

## Documentation

- [`AGENTS.md`](./AGENTS.md) — project map + skill/rule index + hard rules
- [`docs/runbook.md`](./docs/runbook.md) — env, dev store, tokens, webhooks, smoke checklist
- [`docs/next-steps.md`](./docs/next-steps.md) — deployment + validation checklist
- [`design-system-docs/`](./design-system-docs) — component + token MDX reference
- [`.builder/skills/`](./.builder/skills) — on-demand skills for agents
- [`.builder/rules/`](./.builder/rules) — scoped `.mdc` rules
