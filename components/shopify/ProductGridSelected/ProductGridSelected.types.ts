import type { ProductCardVariant } from "@/components/shopify/ProductCard/ProductCard.types";

export interface SelectedHandle {
  shopifyProductHandle: string | null;
}

export interface ProductGridSelectedProps {
  handles?: SelectedHandle[] | null;
  heading?: string | null;
  /** Passed through to each ProductCard: "static" shows price up front, "flip" reveals it on hover. */
  cardVariant?: ProductCardVariant | null;
}
