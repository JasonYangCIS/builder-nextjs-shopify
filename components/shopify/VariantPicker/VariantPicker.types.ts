import type { Product, ProductVariant } from "@/lib/shopify/types";

export interface VariantPickerProps {
  product: Product;
  onSelect?: (variant: ProductVariant | null) => void;
}
