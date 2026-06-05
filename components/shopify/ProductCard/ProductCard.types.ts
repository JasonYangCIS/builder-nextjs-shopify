import type { Product } from "@/lib/shopify/types";

export interface ProductCardProps {
  product: Product;
}

export interface ProductCardClientProps {
  productHandle: string;
}
