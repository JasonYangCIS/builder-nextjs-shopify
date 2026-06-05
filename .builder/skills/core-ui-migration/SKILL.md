---
name: core-ui-migration
description: How to move an app component into the headless @jasonyangcis/core-ui library — headless conversion, cross-repo file checklist, treeshake sentinel, changeset, consumer wiring.
---

Moving a component from this app (`components/**`) into the sibling `@jasonyangcis/core-ui` repo (`../core-ui`) is a two-repo change. core-ui is **headless** — it ships structure, behavior, ARIA, and `data-*` attributes, but **no CSS, no Tailwind, no tokens**. The visuals stay in this app. Read `core-ui/CLAUDE.md` first; this skill is the migration recipe on top of it.

## Step 1 — Headless conversion (the part that's easy to get wrong)

The source component almost certainly carries visuals (Tailwind classes, a `.module.scss`, inline styles). Those CANNOT come along. Transform them:

- Strip every visual class/style from the component. Keep only structure + behavior.
- Surface variant/size choices as `data-*` attributes on the rendered element (`data-variant`, `data-size`, `data-slot="<name>"`), never internal class strings. The consumer's CSS targets those attributes.
- Absorb defaults at the boundary: Builder serializes unset fields as `null`, so type optional props `T | null` and resolve with `prop ?? default` so the data attribute always carries a meaningful value.
- Pass `className` and `ref` straight through so call sites can still style one-offs.

The visuals you stripped get **recreated in this app** (Step 4), keyed off the same `data-*` attributes. Preserve the original values verbatim — same tokens (`var(--border)`, `var(--r-xs)`), same radii/colors. The migration is a relocation, not a restyle.

## Step 2 — Create the component in core-ui

Under `core-ui/src/components/<Name>/`, mirror the existing `Badge`/`Button` folders:

- `<Name>.types.ts` — interfaces + prop unions only, no runtime code. `ref?: Ref<HTMLElement>`.
- `<Name>.tsx` — implementation; `import type` the props and **re-export them at the bottom**. Relative imports use the emitted `.js` extension (`from './X.types.js'`).
- `index.ts` — barrel: `export { X }` + `export type { XProps }`.
- `<Name>.test.tsx` — Vitest + Testing Library (renders, `data-*` emitted, className passthrough, ref forwarding).
- `<Name>.builder.ts` — ONLY if Builder-registered (like Button). Omit otherwise (like Badge). It is NOT re-exported from `src/index.ts`; it's reached via deep import.

Then export from `core-ui/src/index.ts` — **named exports only** (never `export default { ... }`, which defeats treeshaking).

## Step 3 — Treeshake sentinel + changeset (don't skip)

- **Sentinel:** `core-ui/examples/consumer/scripts/check-bundle.mjs` proves unused components are treeshaken from a Button-only consumer bundle. Add a unique runtime string from the new component to `EXPECTED_ABSENT`. Note: every `data-slot` component is already covered by the existing `'data-slot'` sentinel — pick a value that won't collide with React/react-dom internals (avoid bare common words).
- **Changeset:** add `core-ui/.changeset/<slug>.md` with a `minor` bump describing the new primitive. Release happens later via `changeset version` → `changeset publish`.

## Step 4 — Wire the consumer (this app)

- Recreate the visuals in `styles/components/<name>.css`, keyed off the `data-*` attributes (e.g. `[data-slot="card"] { ... }`). Use the values you stripped in Step 1.
- `@import "../styles/components/<name>.css";` in `app/globals.css`, with the other component imports right after Tailwind + tokens (`@import` rules must stay at the very top).
- Swap call-site imports to the named import: `import { X } from "@jasonyangcis/core-ui";`.
- Delete the old `components/ui/<Name>/` (or wherever it lived).

## Step 5 — Build, sync, verify

The dev loop only live-rebuilds core-ui if `../core-ui/node_modules` exists. If it doesn't (fresh checkout), the app silently falls back to the **published** registry version, the new export is missing, and `tsc` fails against stale `node_modules`. To verify locally:

1. `cd ../core-ui && npm install` (once), then `npm test && npm run typecheck && npm run lint && npm run build`.
2. The running dev server's watcher syncs `dist/` into `node_modules/@jasonyangcis/core-ui` automatically; if you bypassed it, copy `core-ui/dist` + `package.json` into the app's `node_modules/@jasonyangcis/core-ui/` manually.
3. `cd code && npx tsc --noEmit` should be clean. Load the page that uses the component and confirm visuals are unchanged.

## Gotchas

- **Don't bump the `@jasonyangcis/core-ui` version pin** in `package.json` until the new version is actually published — a clean `npm install` re-resolves from the registry and fails with `ETARGET`. The dev loop overlays the local build, so the new component works in dev without a publish.
- **`design-system-docs/*.mdx` are read-only virtual files** — you can't edit their import examples even though they reference the old path.
- The `data-*` attribute names are the silent contract between core-ui and `styles/components/*.css`. A rename breaks styling with no type error — keep both sides in sync.

Canonical reference migration: `Card` (headless `data-slot="card"` in core-ui, visuals in `styles/components/card.css`). Sibling primitives: `Badge` (no builder config) and `Button` (with `Button.builder.ts`).
