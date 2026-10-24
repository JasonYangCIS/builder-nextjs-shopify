import type { Product } from "@/lib/shopify/types";

export type ProductCardVariant = "static" | "flip";

export interface ProductCardProps {
  product: Product;
  /** "flip" reveals price/add-to-cart on hover via a 3D flip; "static" shows everything up front. */
  cardVariant?: ProductCardVariant | null;
}

export interface ProductCardClientProps {
  productHandle: string;
  cardVariant?: ProductCardVariant | null;
}
