---
name: builder-page-wiring
description: How to wire a new Builder.io-rendered route or model — fetch helper, route, registry, config.
---

Wiring a new Builder model into an App Router route is a 4-file change. Follow this order so you don't forget a step:

1. **`config.ts`** — add the model name under `config.models.<key>`. Never reference the raw string elsewhere.
2. **`lib/builder/client.ts`** — add a typed `getBuilderX(...)` helper that calls `fetchOneEntry({ model: config.models.X, apiKey: config.apiKey, userAttributes: { urlPath, ...targeting } })`. This file is `server-only`.
3. **`app/<route>/page.tsx`** — async server component with:
   - `export const revalidate = 5;`
   - `params` is a `Promise` in Next 16 — `const { handle } = await params;`
   - call the helper, then `if (!content) notFound();` (only on Builder-only pages — for hybrid pages like the PDP, just skip rendering when null).
   - render with `<RenderBuilderContent content={content} model={config.models.X} />` — never `<Content>` directly.
   - generate `metadata` via `generateMetadata` from Builder `data.title` / `data.description` when applicable.
4. **`builder-registry.ts`** — register any new custom components used inside this model with full input schemas. Use `registerInsertMenu` from `utils/register-insert-menu.ts` to group them in the Builder editor.

For preview support, do NOT add per-route preview logic — `app/preview/page.tsx` already handles every model via `getBuilderSearchParams`. Just make sure the model name resolves through `config.models`.

For HTML-typed Builder fields, route through `utils/sanitize-html.ts` before rendering. Never `dangerouslySetInnerHTML` directly.

Canonical examples: `app/[...page]/page.tsx` (pure Builder) and `app/products/[handle]/page.tsx` (hybrid Shopify + Builder section).
