---
name: testing
description: Vitest unit + Playwright smoke + axe a11y.
---

- Vitest for pure functions in `lib/` and `utils/` (cart math, PKCE, zod parsers, token refresh helpers).
- Playwright for the critical happy path: browse → add to cart → apply discount → checkout redirect.
- Run `@axe-core/playwright` accessibility scan on each visited route.
- Tests run against the live `builder-jason.myshopify.com` dev store with a test cart.
