---
name: design-system
description: Tokens, cn(), focus rings, shadcn/ui (new-york), insert-menu groups.
---

- Always use semantic tokens (`bg-card`, `text-muted-foreground`, …). No hardcoded hex.
- Compose classes with `cn()` from `@/utils/cn`.
- Focus rings: `focus-visible:ring-[3px] focus-visible:ring-ring/50`.
- Add new tokens to `[data-theme]` in `styles/tokens.css` and expose via `@theme inline` in `app/globals.css`.
- Group registered components in the Builder editor via `utils/register-insert-menu.ts`.

Long-form: see `docs/skills/design-system.md`.
