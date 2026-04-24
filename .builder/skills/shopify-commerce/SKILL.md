---
name: shopify-commerce
description: Cart, inventory, discounts, checkout against Shopify Storefront API.
---

- All Shopify GraphQL goes through `lib/shopify/storefront-client.ts` (server-only).
- Cart created lazily on first add; cart id stored in HttpOnly cookie `cart_id`.
- Mutations (`add` / `update` / `remove`) via `POST /api/cart`. Client uses `useCart()` (SWR).
- Out-of-stock: query `availableForSale` + `quantityAvailable`; disable AddToCartButton.
- Discount codes: `POST /api/cart/discount` → `cartDiscountCodesUpdate`. Surface `userErrors`.
- Checkout: top-level navigation to `cart.checkoutUrl`. Attach `buyerIdentity.customerAccessToken` when logged in.
- Cache via `next: { tags: ["product:<handle>"], revalidate: 60 }`. Webhooks call `revalidateTag`.
