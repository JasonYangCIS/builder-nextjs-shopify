import type { Money } from "@/lib/shopify/types";

export interface PriceDisplayProps {
  price: Money;
  compareAtPrice?: Money | null;
  className?: string;
}
