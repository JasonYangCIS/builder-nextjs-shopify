import type { RegisteredComponent } from "@builder.io/sdk-react";
import ProductGridClient from "./ProductGridClient";

export const productGridConfig: RegisteredComponent = {
  component: ProductGridClient,
  name: "ProductGrid",
  inputs: [
    { name: "heading", type: "string" },
    { name: "collectionHandle", type: "ShopifyCollectionHandle", helperText: "Pick a Shopify collection (optional)" },
    { name: "query", type: "string", helperText: "Storefront search query (optional)" },
    { name: "limit", type: "number", defaultValue: 12 },
    {
      name: "enableControls",
      type: "boolean",
      defaultValue: false,
      helperText: "Show search, sort, and filter controls above the grid",
    },
    {
      name: "cardVariant",
      type: "string",
      enum: ["static", "flip"],
      defaultValue: "flip",
      helperText:
        "static=image, title, price, and stock badge shown up front. flip=image and title up front; hover flips the card to reveal price and an Add to Cart button.",
    },
  ],
};
