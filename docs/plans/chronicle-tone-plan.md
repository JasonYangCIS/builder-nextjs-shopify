# 1-Click Checkout

## Goal
Add a "Buy now" style button next to the existing "Acquire artifact" add-to-cart button on the product detail page. Clicking it adds the current variant to the cart and immediately redirects to Shopify checkout — no drawer, no extra step.

## Current behavior (for reference)
- `AddToCartButton` (`components/shopify/AddToCartButton/AddToCartButton.tsx`) POSTs `{ action: "add", variantId, quantity }` to `/api/cart`, then calls `useCart().mutate()` and opens the cart drawer via `useCartDrawer().setOpen(true)`.
- `POST /api/cart` (`app/api/cart/route.ts`) already returns the full updated `Cart` object (including `checkoutUrl`) in its JSON response — this is currently ignored by the caller.
- `CheckoutButton` (`components/shopify/CheckoutButton/CheckoutButton.tsx`) redirects with `window.location.href = cart.checkoutUrl`, reading `cart` from `useCart()`.
- There is no internal `/checkout` route — checkout is always a top-level navigation to Shopify's hosted `checkoutUrl`.

## Approach
Create a new component, **`ExpressCheckoutButton`**, following the existing four-file component pattern, rather than overloading `AddToCartButton` with new modes/props. This keeps `AddToCartButton`'s behavior (open drawer) untouched and gives the new button a single responsibility.

### New files
`components/shopify/ExpressCheckoutButton/`
- `ExpressCheckoutButton.tsx` — client component (`"use client"`)
- `ExpressCheckoutButton.types.ts` — `ExpressCheckoutButtonProps`

### Props (mirrors `AddToCartButtonProps`)
```ts
export interface ExpressCheckoutButtonProps {
  variantId: string;
  availableForSale: boolean;
  quantity?: number;
  label?: string | null;
  className?: string;
}
```

### Behavior
1. On click, POST to `/api/cart` with `{ action: "add", variantId, quantity }` (same as `AddToCartButton`), guarded by a pending/transition state and `disabled = !availableForSale || pending || !variantId`.
2. Parse the JSON response directly (it already contains the updated `Cart`, including `checkoutUrl`) — no need to wait on the SWR cache.
3. Check for `userErrors` same as `AddToCartButton`; on error, show inline error text and stay on the page (do not redirect).
4. On success:
   - Fire-and-forget `mutate()` from `useCart()` so the cart badge/drawer state is consistent if the user navigates back.
   - Redirect immediately: `window.location.href = cart.checkoutUrl`.
5. Button label: default `"Buy now"` while idle, `"Processing..."` while pending, `"Artifact depleted"` when `!availableForSale` (same convention as `AddToCartButton`).
6. Use the existing `Button` design-system component with `data-variant="outline"` (secondary emphasis next to the primary "Acquire artifact" action), `size="lg"`.

### Wiring into `ProductDetail`
In `components/shopify/ProductDetail/ProductDetail.tsx`, add the new button inside the existing `flex items-center gap-3` row (lines ~79-88), after `AddToCartButton` and before `WishlistButton`:

```tsx
<div className="flex items-center gap-3">
  <AddToCartButton
    variantId={variant.id}
    availableForSale={variant.availableForSale}
    label="Acquire artifact"
    className="flex-1"
  />
  <ExpressCheckoutButton
    variantId={variant.id}
    availableForSale={variant.availableForSale}
    className="flex-1"
  />
  <WishlistButton handle={product.handle} />
</div>
```

No changes needed to `app/api/cart/route.ts`, `lib/shopify/cart.ts`, or `useCart.ts` — the existing add-cart endpoint already returns everything required.

## Files to change/add
- Add: `components/shopify/ExpressCheckoutButton/ExpressCheckoutButton.tsx`
- Add: `components/shopify/ExpressCheckoutButton/ExpressCheckoutButton.types.ts`
- Edit: `components/shopify/ProductDetail/ProductDetail.tsx` (add button + import)

## Testing
- Manually verify in preview: click the new button on `/products/the-inventory-not-tracked-snowboard`, confirm it adds the item then navigates to the Shopify checkout URL.
- Verify disabled state when variant is out of stock.
- Verify error case (e.g. simulate a failed add) does not redirect and shows an inline error.
