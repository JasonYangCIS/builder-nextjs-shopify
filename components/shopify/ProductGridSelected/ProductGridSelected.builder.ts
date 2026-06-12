import type { RegisteredComponent } from "@builder.io/sdk-react";
import ProductGridSelectedClient from "./ProductGridSelectedClient";

export const productGridSelectedConfig: RegisteredComponent = {
  component: ProductGridSelectedClient,
  name: "ProductGridSelected",
  inputs: [
    { name: "heading", type: "string" },
    {
      name: "handles",
      type: "list",
      subFields: [
        {
          name: "shopifyProductHandle",
          type: "ShopifyProductHandle",
          helperText: "Shopify product handle, e.g. the-inventory-not-tracked-snowboard",
        },
      ],
    },
  ],
};
