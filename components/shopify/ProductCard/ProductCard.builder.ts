import type { RegisteredComponent } from "@builder.io/sdk-react";
import ProductCardClient from "./ProductCardClient";

export const productCardConfig: RegisteredComponent = {
  component: ProductCardClient,
  name: "ProductCard",
  inputs: [
    {
      name: "productHandle",
      type: "string",
      required: true,
      helperText: "Shopify product handle, e.g. obsidian-amulet",
    },
  ],
};
