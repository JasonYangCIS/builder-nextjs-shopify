import type { ProductCardPresentation } from "@/components/shopify/ProductCard/ProductCard.types";

export interface ProductGridProps {
  collectionHandle?: string | null;
  query?: string | null;
  limit?: number;
  heading?: string | null;
  presentation?: ProductCardPresentation;
}
