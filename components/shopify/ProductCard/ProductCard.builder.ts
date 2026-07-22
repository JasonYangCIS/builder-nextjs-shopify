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
      name: "variant",
      type: "text",
      enum: [
        { label: "Default", value: "default" },
        { label: "Hover add to cart", value: "hover-add-to-cart" },
      ],
      defaultValue: "default",
      helperText: "Default shows price and stock only; Hover add to cart reveals an add-to-cart button on hover.",
    },
  ],
};
