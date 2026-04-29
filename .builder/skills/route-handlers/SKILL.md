---
name: route-handlers
description: Pattern for adding a server Route Handler under app/api/** — origin check, zod body, server-only deps, safe responses.
---

Every new file under `app/api/**/route.ts` follows the same shape:

1. `import "server-only"` is implicit (Route Handlers run on the server), but any helper they import from `lib/{shopify,auth,env}` MUST start with `import "server-only"`.
2. Mutating verbs (`POST`, `PUT`, `PATCH`, `DELETE`) MUST call `verifySameOrigin(req)` from `lib/auth/csrf` before doing anything else. Return `403` on failure.
3. Parse the body with a `zod` schema. On `safeParse` failure return `400` with a generic message — never echo the raw error to the client.
4. Read cookies/headers with `await cookies()` / `await headers()` (Next 16 — they are async).
5. Webhooks (`app/api/webhooks/**`): read the raw body as text, `crypto.timingSafeEqual` the HMAC against `SHOPIFY_WEBHOOK_SECRET`, THEN `JSON.parse`.
6. Never log `Authorization`, `Set-Cookie`, tokens, or anything matching `/token|secret|password|cookie/i`. Never return tokens in JSON responses.
7. Set cookies with `HttpOnly`, `SameSite=Lax`, `Secure` in production, and encrypt sensitive payloads with `jose` using `SESSION_SECRET`.
8. Use `revalidateTag(tag, "max")` after Shopify mutations that affect cached reads (cart, customer, product).

See `app/api/cart/route.ts` and `app/api/webhooks/shopify/route.ts` for canonical examples.
