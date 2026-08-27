# Wishlist feature

## Summary
Add a client-side (localStorage-backed) wishlist: a heart-toggle button on the product page hero, a matching header link with a saved-count badge, and a `/wishlist` page listing saved products. No Shopify/customer account changes — the current integration has no metafield or saved-items support, so this stays a per-browser feature (guests and logged-in users both get it; it does not sync across devices).

## New files

### `lib/wishlist/useWishlist.ts`
Client hook mirroring the `useCart` SWR pattern (`lib/cart/useCart.ts`), but backed by `localStorage` instead of an API route.
- Storage key: `wishlist:handles` → JSON array of product handles.
- SWR key: constant `"wishlist"` string; fetcher reads and parses `localStorage`, guarded for SSR (`typeof window === "undefined"` → `[]`).
- Listens for the `storage` event to revalidate when another tab changes the list.
- Exposes: `handles: string[]`, `isSaved(handle): boolean`, `toggle(handle): void` (also usable for `add`/`remove` since toggle covers both), `isLoading`.
- `toggle` writes the new array to `localStorage` then calls SWR's `mutate` with the new value (no revalidation needed, it's the source of truth).

### `components/shopify/WishlistButton/WishlistButton.tsx` + `WishlistButton.types.ts`
Two-file component (matches `InventoryBadge`/`AddToCartButton` pattern — no CSS module needed, Tailwind only).
- Props: `handle: string`, `className?: string`.
- `"use client"`. Uses `useWishlist()` for `isSaved`/`toggle`.
- Renders a `Button` (`@jasonyangcis/core-ui`) `size="icon"` with a `Heart` icon from `lucide-react`, filled (`fill="currentColor"`) and a saved-state text token when saved, outline/muted when not.
- `aria-pressed={isSaved(handle)}` and `aria-label` toggling between `"Add to wishlist"` / `"Remove from wishlist"`.
- `onClick` calls `e.preventDefault(); e.stopPropagation();` before `toggle(handle)` so it can be safely nested inside a `ProductCard` `<Link>` on the wishlist page without triggering navigation.

### `components/layout/WishlistLink/WishlistLink.tsx`
Client component for the header, styled after `CartDrawer`'s trigger button (icon + count badge) but as a plain link (no drawer).
- `Link href="/wishlist"` with a `Heart` icon, `aria-label` including the saved count, and a small count badge (reuses the `t-mono` count-badge treatment from `CartDrawer.module.scss`) shown only when `handles.length > 0`.
- Uses `useWishlist()` for the count.

### `app/wishlist/page.tsx`
Client page (`"use client"`), since wishlist state only exists in the browser.
- Reads `handles` from `useWishlist()`.
- When `handles.length > 0`, fetches `/api/products?handles=<comma-joined>` via SWR (this route and `resolveProductsByHandles` already exist in `lib/shopify/product.ts` / `app/api/products/route.ts` — no backend changes needed) to get `{ results: SelectedProductResult[] }`.
- Filters out entries with `fetchError` or `product: null` (e.g. a saved handle that was deleted from the store).
- Renders a heading consistent with the site's theme, an empty state when there are no saved products, and otherwise a grid: for each resolved product, wrap `ProductCard` in a `relative` div and overlay `WishlistButton` (absolute, top-right) so users can remove items directly from the list.

## Edits to existing files

### `components/shopify/ProductDetail/ProductDetail.tsx`
Wrap the existing `AddToCartButton` block in a `flex items-center gap-3` row and add `<WishlistButton handle={product.handle} />` beside it, so the hero shows Add to Cart + a heart toggle together.

### `components/layout/Header/Header.tsx`
Add `<WishlistLink />` next to `<AccountMenu />` / `<CartDrawer />` in the existing icon-controls row.

## Out of scope
- No server-side/Shopify persistence (no metafields, no customer-account wishlist sync).
- No changes to `ProductCard` itself — the overlay button is added via a wrapper on the wishlist page only.
- No changes to Builder models/components.
