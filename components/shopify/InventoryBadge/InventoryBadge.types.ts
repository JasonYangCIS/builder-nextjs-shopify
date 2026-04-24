export interface InventoryBadgeProps {
  availableForSale: boolean;
  quantityAvailable: number | null;
  lowStockThreshold?: number;
}
