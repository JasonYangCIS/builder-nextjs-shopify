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
      name: "cardVariant",
      type: "string",
      enum: ["static", "flip"],
      defaultValue: "static",
      helperText:
        "static=image, title, price, and stock badge shown up front (whole card links to the product). flip=image and title up front only; hover flips the card to reveal price, stock badge, and an Add to Cart button.",
    },
  ],
};
