---
name: engineering-standards
description: TS strict, four-file folder pattern, import boundaries, no console.
---

- TypeScript strict; no `any`; no non-null assertions.
- Components live in folders: `Name.tsx`, `Name.types.ts`, `Name.module.scss?`, `Name.builder.ts?`. No `index.ts` barrels.
- Builder-bound fields: `string | null`. `slug: string` always required.
- `import type` for type-only imports. Always `@/` alias.
- Boundary: `app/` → `components/` → `lib/`. `lib/` is leaf-only.
- `import "server-only"` at the top of any file holding secrets or Shopify API logic.
- No `console.*` in committed code.
