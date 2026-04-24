---
name: security
description: Secret hygiene, CSP, CSRF, webhook HMAC, session encryption.
---

- All Shopify + session secrets are server-only env vars. Only `NEXT_PUBLIC_*` reaches the browser.
- Validate envs in `lib/env.ts` (zod). Boot fails on invalid envs.
- Mutating Route Handlers MUST verify `Origin` matches `APP_ORIGIN` via `verifySameOrigin`.
- Shopify webhooks: HMAC-verify with `crypto.timingSafeEqual` on the raw body.
- Cookies: `HttpOnly`, `Secure` (prod), `SameSite=Lax`, signed/encrypted with `SESSION_SECRET`.
- Strict CSP in production, relaxed only on `/preview`. Headers set in `proxy.ts`.
- All Builder HTML through `utils/sanitize-html.ts`. No `dangerouslySetInnerHTML` outside that helper.
- All Route Handler bodies validated with zod.
