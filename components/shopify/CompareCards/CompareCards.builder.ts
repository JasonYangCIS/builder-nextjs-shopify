import type { RegisteredComponent } from "@builder.io/sdk-react";
import CompareCards from "./CompareCards";

export const compareCardsConfig: RegisteredComponent = {
  component: CompareCards,
  name: "CompareCards",
  inputs: [
    {
      name: "items",
      type: "list",
      subFields: [
        {
          name: "image",
          type: "file",
          allowedFileTypes: ["jpeg", "jpg", "png", "webp"],
          required: true,
        },
        { name: "imageAlt", type: "string", helperText: "Alt text for the image" },
        { name: "label", type: "string", required: true, helperText: "e.g. Trail" },
        {
          name: "productHandle",
          type: "string",
          helperText: "Optional Shopify product handle; shows a live product summary in the sidebar",
        },
        {
          name: "sidebarContent",
          type: "richText",
          helperText: "Additional content shown in the sidebar below the product summary",
        },
      ],
    },
  ],
};
