import type { ProductVariant } from "./types";

export interface StockState {
  inStock: boolean;
  lowStock: boolean;
  outOfStock: boolean;
  quantityAvailable: number | null;
}

export function getStockState(variant: Pick<ProductVariant, "availableForSale" | "quantityAvailable">, lowThreshold = 5): StockState {
  const qty = variant.quantityAvailable;
  if (!variant.availableForSale) {
    return { inStock: false, lowStock: false, outOfStock: true, quantityAvailable: qty };
  }
  return {
    inStock: true,
    lowStock: qty !== null && qty > 0 && qty <= lowThreshold,
    outOfStock: false,
    quantityAvailable: qty,
  };
}
