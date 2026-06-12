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
  ],
};
