import Badge from "@/components/ui/Badge/Badge";
import { getStockState } from "@/lib/shopify/inventory";
import type { InventoryBadgeProps } from "./InventoryBadge.types";

export default function InventoryBadge({
  availableForSale,
  quantityAvailable,
  lowStockThreshold = 5,
}: InventoryBadgeProps) {
  const state = getStockState({ availableForSale, quantityAvailable }, lowStockThreshold);
  if (state.outOfStock) return <Badge variant="destructive">Sold out</Badge>;
  if (state.lowStock)
    return <Badge variant="secondary">Only {state.quantityAvailable} left</Badge>;
  return <Badge variant="outline">In stock</Badge>;
}

export type { InventoryBadgeProps } from "./InventoryBadge.types";
