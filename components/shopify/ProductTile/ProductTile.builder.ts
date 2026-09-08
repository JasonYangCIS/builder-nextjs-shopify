import type { RegisteredComponent } from "@builder.io/sdk-react";
import ProductTileClient from "./ProductTileClient";

export const productTileConfig: RegisteredComponent = {
  component: ProductTileClient,
  name: "ProductTile",
  inputs: [
    {
      name: "productHandle",
      type: "string",
      required: true,
      helperText: "Shopify product handle, e.g. obsidian-amulet",
    },
  ],
};
