<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version (16.x) has breaking changes — APIs, conventions, and file structure may differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

Notable Next 16 changes used in this repo:
- `middleware.ts` is **renamed to `proxy.ts`** (file at the project root).
- `cookies()` and `headers()` from `next/headers` are **async** — always `await`.
- `revalidateTag(tag, "max")` is the recommended call signature.
<!-- END:nextjs-agent-rules -->

# Fusion AI orientation (read first)

This repo is consumed by Builder.io Fusion. Before writing code:

1. Read this file end-to-end. Skill/rule tables below tell you which `.builder/skills/<name>/SKILL.md` and `.builder/rules/<name>.mdc` to load for the task.
2. Any UI work — read `design-system-docs/AGENTS.md` and the matching component MDX in `design-system-docs/<Name>.mdx` BEFORE writing JSX.
3. The dev server runs automatically. Do not instruct the user to run `npm run dev`, open `localhost`, or touch the terminal — they have no terminal access. Use `DevServerLogs` / `DevServerRestart` instead.
4. Secrets are governed by `.builder/rules/secrets.mdc` (`alwaysApply: true`). Re-read it before editing any file under `app/`, `components/`, `lib/auth/**`, `lib/shopify/**`, or `proxy.ts`.
5. Builder model names live in `config.ts`. Never hardcode model strings. Never use `<Content>` directly — always `RenderBuilderContent`.
6. New Shopify call → `lib/shopify/*`. New auth call → `lib/auth/*`. Both start with `import "server-only"`.
7. New API route → load the `route-handlers` skill. New Builder-rendered route → load the `builder-page-wiring` skill.

# Project map + skill/rule index

This is a headless **Builder.io + Shopify** sandbox storefront for `builder-jason.myshopify.com`. Pick the right skill before writing code.

## Where things live

```
app/                      — Next.js 16 App Router (routes, route handlers)
  api/                    — server-only Route Handlers (cart, auth, customer, webhooks, og)
  preview/                — Builder live-preview ONLY here
components/
  ui/                     — shadcn/ui primitives (Button, Input, Label, Card, Badge, Dialog)
  layout/                 — Header, Footer, NavItems, MiniCart, AccountMenu
  shopify/                — ProductGrid, ProductCard, PriceDisplay, VariantPicker,
                            QuantityStepper, InventoryBadge, AddToCartButton, CartDrawer,
                            CartLineItem, DiscountCodeInput, CheckoutButton, LoginButton,
                            OrderHistoryList, ProductDetail
  marketing/              — HeroSplit, HeroCentered, AnnouncementBar, FaqList
  builder/                — RenderBuilderContent, BuilderDesignTokens
lib/
  env.ts                  — zod-parsed envs (server-only)
  shopify/                — Storefront API client + queries + types
  auth/                   — PKCE, session, customer-token, csrf
  builder/client.ts       — fetchOneEntry / fetchEntries wrappers
  cart/useCart.ts         — client SWR hook
utils/                    — cn, sanitize-html, register-insert-menu, url, date
styles/tokens.css         — design tokens
proxy.ts                  — security headers + (future) token refresh
config.ts                 — { apiKey, models }
builder-registry.ts       — central RegisteredComponent[] export
.builder/skills/          — agent skills
.builder/rules/           — agent rules (mdc)
docs/skills/              — long-form skill docs
docs/runbook.md           — dev-store, tokens, webhook setup
```

## Skills (read the matching one before coding)

| Skill | When |
|---|---|
| `builder-io` | Anything touching Builder fetch / render / register / preview. |
| `design-system` | New UI primitive, tokens, focus rings, insert-menu groups. |
| `engineering-standards` | TS / folder pattern / boundaries / no-console. |
| `shopify-commerce` | Cart, inventory, discounts, checkout, Storefront queries. |
| `shopify-customer-auth` | OAuth (PKCE), session cookie, customer profile/orders. |
| `security` | New Route Handler, secrets, webhooks, CSP, HTML sanitization. |
| `testing` | Vitest unit + Playwright + axe smoke. |
| `skill-creator` | Authoring a new skill. |
| `route-handlers` | Adding or editing any file under `app/api/**/route.ts`. |
| `builder-page-wiring` | Adding a new Builder model or a new Builder-rendered route. |
| `core-ui-migration` | Moving a component from this app into the headless `@jasonyangcis/core-ui` library. |

## Rules (mdc, scoped via globs)

| Rule | Globs |
|---|---|
| `secrets.mdc` (alwaysApply) | `**` |
| `builder-sdk.mdc` | `app/**/*.{ts,tsx}, components/builder/**, builder-registry.ts, config.ts` |
| `component-structure.mdc` | `components/**` |
| `design-system.mdc` | `components/**, styles/**, app/globals.css` |
| `routing.mdc` | `app/**/*.{ts,tsx}` |
| `typescript.mdc` | `types/**, components/**/*.types.ts, app/**/*.tsx` |
| `shopify-commerce.mdc` | `lib/shopify/**, app/api/cart/**, components/shopify/**` |
| `shopify-customer-auth.mdc` | `lib/auth/**, app/api/auth/**, proxy.ts` |
| `security.mdc` | `app/api/**, lib/auth/**, lib/shopify/**, proxy.ts` |
| `route-handlers.mdc` | `app/api/**/*.ts` |
| `accessibility.mdc` | `components/**, app/**` |
| `seo.mdc` | `app/**/page.tsx, app/sitemap.ts, app/robots.ts` |

## Builder model wiring

| Model | Kind | Where it's fetched | Notes |
|---|---|---|---|
| `page` | page | `app/[...page]/page.tsx` via `getBuilderPage(urlPath)` | Catch-all; root handled separately. |
| `product` | page | `app/products/[handle]/page.tsx` via `getBuilderProduct(handle)` | Optional Builder section rendered **below** `<ProductDetail />`. Filters by `data.handle`; `urlPath` user attribute set for targeting. Renders nothing if no entry exists. |
| `collection` | page | _not yet wired_ | Reserved for `app/collections/[handle]/page.tsx` per-handle Builder layout. |
| `announcement-bar` | section | _not yet wired_ | Reserved for header announcement region. |

When wiring a new model, always:
1. Add a typed helper to `lib/builder/client.ts` (server-only).
2. Pass `userAttributes: { urlPath }` so Builder targeting / preview works.
3. Render with `<RenderBuilderContent content={...} model={config.models.X} />` — never `<Content>` directly.
4. Reference the model name via `config.models.X`, never a string literal.

## Hard rules (always-on)

- Browser NEVER calls Shopify directly. All Shopify GraphQL is server-only via `lib/shopify/*`.
- `import "server-only"` at the top of every file in `lib/{shopify,auth,env}`.
- Mutating Route Handlers verify `Origin` (`verifySameOrigin`) and validate body with zod.
- Webhooks HMAC-verify with `crypto.timingSafeEqual` on the **raw** body.
- Cookies are `HttpOnly` + `Secure` (prod) + `SameSite=Lax` + signed/encrypted with `SESSION_SECRET`.
- All Builder HTML through `utils/sanitize-html.ts`. No raw `dangerouslySetInnerHTML`.
- Use `RenderBuilderContent` and `config.models.*` — never `<Content>` and never string literals for model names.
