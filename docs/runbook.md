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
2. Add `http://localhost:3000/api/auth/callback` to the redirect-URI allow-list.
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

## Smoke checklist

- [ ] Home page renders Builder content.
- [ ] PDP loads, JSON-LD present.
- [ ] Add to cart updates the cart drawer optimistically.
- [ ] Discount code validates and applies.
- [ ] Checkout button navigates to Shopify-hosted checkout.
- [ ] OAuth login round-trip completes; orders list shows historical orders.
