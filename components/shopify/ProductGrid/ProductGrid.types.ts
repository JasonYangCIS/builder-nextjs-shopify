import type { ProductCardVariant } from "@/components/shopify/ProductCard/ProductCard.types";

export interface ProductGridProps {
  collectionHandle?: string | null;
  query?: string | null;
  limit?: number;
  heading?: string | null;
  /** Show a search / sort / filter toolbar above the grid, driven by facets Shopify returns for the current query. */
  enableControls?: boolean | null;
  /** Passed through to each ProductCard: "static" shows price up front, "flip" reveals it on hover. */
  cardVariant?: ProductCardVariant | null;
}
