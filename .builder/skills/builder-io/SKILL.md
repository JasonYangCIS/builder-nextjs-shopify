---
name: builder-io
description: Builder.io Gen-2 SDK patterns — fetch, render, register, model guard, preview.
---

Use the Gen-2 SDK from `@builder.io/sdk-react`.

- Fetch with `fetchOneEntry({ model, apiKey, userAttributes: { urlPath } })`.
- Render via `RenderBuilderContent` (NEVER `<Content>`).
- Use `config.models.*`, never string literals for model names.
- `notFound()` when `fetchOneEntry` returns null on a Builder-only route.
- Guard `subscribeToEditor` with the model-name check to avoid mismatch errors.
- HTML fields → `utils/sanitize-html.ts`.
- In `app/preview/page.tsx`, pass `disableTracking` to `RenderBuilderContent` for the entry being edited; `disableTracking` sets `canTrack={false}`, which on `@builder.io/sdk-react@5.2.4+` already suppresses the A/B initializer script (no visible-text leak under React 19 SSR). Do NOT also pass `isNestedRender` on the root content being edited in `/preview` — it is an internal-only prop that also disables the `postMessage` listener the Builder visual editor needs for drag/drop, breaking in-editor editing.
- 4-step new model: edit `config.ts` → add `types/*.types.ts` → wire route → register components in `builder-registry.ts`.
