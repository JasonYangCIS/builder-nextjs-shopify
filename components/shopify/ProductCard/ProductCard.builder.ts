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
    {
      name: "presentation",
      type: "string",
      enum: ["default", "hover-add-to-cart"],
      defaultValue: "default",
      helperText: "Choose whether a quick-add control appears on hover.",
    },
  ],
};
