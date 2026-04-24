---
name: shopify-customer-auth
description: Customer Account API — PKCE OAuth, encrypted-cookie session, token refresh.
---

- `GET /api/auth/login` generates PKCE verifier+challenge, stores verifier+state+nonce in a short-lived encrypted cookie, redirects to Shopify authorize endpoint.
- `GET /api/auth/callback` validates state, exchanges code for tokens, encrypts tokens with `jose` JWE (AES-256-GCM), writes `__session` HttpOnly cookie.
- `/api/customer` reads session, refreshes access token when within 60s of expiry, calls Customer Account API.
- `/api/auth/logout` revokes via Shopify logout URL and clears all auth cookies.
- Open-redirect protection: `safeInternalPath` validates `redirect_to` is same-origin path.
- NEVER expose tokens to the browser. Never log `Authorization` headers.
