import type { RegisteredComponent } from "@builder.io/sdk-react";
import InventoryBadge from "./InventoryBadge";

export const inventoryBadgeConfig: RegisteredComponent = {
  component: InventoryBadge,
  name: "InventoryBadge",
  inputs: [
    { name: "availableForSale", type: "boolean", defaultValue: true },
    { name: "quantityAvailable", type: "number" },
    { name: "lowStockThreshold", type: "number", defaultValue: 5 },
  ],
};
