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
- HTML fields → `utils/sanitize-html.ts` (DOMPurify).
- 4-step new model: edit `config.ts` → add `types/*.types.ts` → wire route → register components in `builder-registry.ts`.

Long-form: see `docs/skills/builder-io.md`.
