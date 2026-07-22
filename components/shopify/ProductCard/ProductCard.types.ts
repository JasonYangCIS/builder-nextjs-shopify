import type { Product } from "@/lib/shopify/types";

export type ProductCardVariant = "default" | "hover-add-to-cart";

export interface ProductCardProps {
  product: Product;
  variant?: ProductCardVariant;
}

export interface ProductCardClientProps {
  productHandle: string;
  variant?: ProductCardVariant;
}
