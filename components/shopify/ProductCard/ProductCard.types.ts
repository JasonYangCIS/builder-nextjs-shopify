import type { Product } from "@/lib/shopify/types";

export type ProductCardPresentation = "default" | "hover-add-to-cart";

export interface ProductCardProps {
  product: Product;
  presentation?: ProductCardPresentation;
}

export interface ProductCardClientProps {
  productHandle: string;
  presentation?: ProductCardPresentation;
}
