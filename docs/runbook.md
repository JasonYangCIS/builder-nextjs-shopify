# Runbook

Sandbox-only operational notes for the Builder.io + Shopify integration.

## Required env vars

See `lib/env.ts` for the authoritative schema. All envs are validated at boot.

| Name | Where set | Notes |
|---|---|---|
| `SHOPIFY_STORE_DOMAIN` | Project env | `builder-jason.myshopify.com` |
| `SHOPIFY_STOREFRONT_API_TOKEN` | Project env | Storefront public access token. Server-only by convention. |
| `SHOPIFY_STOREFRONT_API_VERSION` | Project env | e.g. `2024-10` |
| `SHOPIFY_CUSTOMER_ACCOUNT_API_URL` | Project env | From the Shopify Headless channel config. |
| `SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID` | Project env | Customer Account API public client id. |
| `SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI` | Project env | Must be allow-listed in Shopify admin. |
| `SHOPIFY_WEBHOOK_SECRET` | Project env | HMAC secret from the Headless channel. |
| `NEXT_PUBLIC_BUILDER_API_KEY` | Project env | Public Builder.io API key. |
| `SESSION_SECRET` | Project env | 32+ random bytes. Used to derive the JWE key. |
| `APP_ORIGIN` | Project env | Used for CSRF + redirect-allow-list. |

Generate `SESSION_SECRET` locally:

```sh
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

## Customer Account API setup (one-time)

1. Shopify admin → Headless channel → enable Customer Account API.
2. Add `http://localhost:3000/api/auth/callback` and `https://builder-nextjs-shopify-sandbox.vercel.app/api/auth/callback` to the redirect-URI allow-list.
3. Copy the API URL and client id into env vars above.

## Webhooks

Subscribe to (any of):

- `products/update`
- `products/delete`
- `inventory_levels/update`
- `collections/update`

Endpoint: `POST {APP_ORIGIN}/api/webhooks/shopify`. The handler verifies HMAC and calls `revalidateTag` to flush the corresponding Next.js cache tags.

## Reset the dev cart

Cart id is stored in the `cart_id` cookie. Clear it to start a fresh cart:

```js
document.cookie = "cart_id=; Path=/; Max-Age=0";
```

## Local multi-repo development (core-ui)

UI primitives like `Button` and `Badge` live in the sibling repo
`@jasonyangcis/core-ui` (checked out next to this one at `../core-ui`). The app
consumes it as a published package, but during local/sandbox development you can
edit the library and see changes live.

### How the live loop works

The dev command runs `node scripts/dev.mjs` instead of `next dev` directly. For
each library in that script's `LIBS` list it:

1. copies the library's built `dist/` into `node_modules/<pkg>/dist` on startup
   (a copy lands **inside** this project so Turbopack resolves it natively — a
   symlink to the sibling repo is outside the project root and Turbopack rejects
   it);
2. runs the library's watch build (`npm run dev` → `rolldown -c -w`) so its
   `dist/` regenerates on every source change;
3. re-copies `dist/` into `node_modules` whenever it changes;

then starts `next dev`. Net effect: edit `../core-ui/src` → rebuild → re-sync →
Next HMR. Each library is best-effort; a failed/missing library never takes down
`next dev`.

Requirements for the loop: `../core-ui` must have its own `node_modules`
(run `npm install` there once) so the watch build can run.

**Add another library:** append one entry to `LIBS` in `scripts/dev.mjs`
(a stub for `core-ui-2` is already commented in).

**Coexists with a real workspace:** if `node_modules/<pkg>` is already a symlink
(e.g. a pnpm/npm workspace on your own machine), the copy-sync is skipped for
that package automatically.

### Dependency version rule (important)

Keep `@jasonyangcis/core-ui` in `package.json` pinned to a **published** version
(currently `^0.2.0`). Do **not** bump it to a version that isn't on the registry
yet: a clean `npm install` re-resolves from the registry and fails with
`ETARGET / No matching version found`, which breaks container setup.

- The local dev loop does **not** need the new version published — it overlays
  the freshly-built local `dist`, so `Badge` (added after `0.2.0`) is available
  in dev even though the installed registry baseline is `0.2.0`.
- Only bump to `^0.3.0` **after** `core-ui@0.3.0` is actually published via the
  changeset release flow (`changeset version` → `changeset publish`).

## Smoke checklist

- [ ] Home page renders Builder content.
- [ ] PDP loads, JSON-LD present.
- [ ] Add to cart updates the cart drawer optimistically.
- [ ] Discount code validates and applies.
- [ ] Checkout button navigates to Shopify-hosted checkout.
- [ ] OAuth login round-trip completes; orders list shows historical orders.
