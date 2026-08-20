import type { ProductSortOption } from "./types";

/**
 * Sort choices surfaced in the ProductGrid toolbar. `sortKey` values match
 * Shopify's `ProductCollectionSortKeys` enum; `resolveProductGrid` remaps
 * `CREATED` to `CREATED_AT` when querying the root `products` field, which
 * uses `ProductSortKeys` instead.
 */
export const PRODUCT_SORT_OPTIONS: ProductSortOption[] = [
  { id: "relevance", label: "Relevance", sortKey: "RELEVANCE", reverse: false },
  { id: "best-selling", label: "Best selling", sortKey: "BEST_SELLING", reverse: false },
  { id: "title-asc", label: "Title (A–Z)", sortKey: "TITLE", reverse: false },
  { id: "title-desc", label: "Title (Z–A)", sortKey: "TITLE", reverse: true },
  { id: "price-asc", label: "Price (low to high)", sortKey: "PRICE", reverse: false },
  { id: "price-desc", label: "Price (high to low)", sortKey: "PRICE", reverse: true },
  { id: "newest", label: "Newest", sortKey: "CREATED", reverse: true },
];
