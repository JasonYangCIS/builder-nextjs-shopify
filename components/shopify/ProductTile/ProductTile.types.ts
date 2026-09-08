import type { Product } from "@/lib/shopify/types";

export interface ProductTileProps {
  product: Product;
}

export interface ProductTileClientProps {
  productHandle: string;
}
