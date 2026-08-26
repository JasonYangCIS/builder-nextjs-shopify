import type { RegisteredComponent } from "@builder.io/sdk-react";
import ListIcon from "./ListIcon";
import { LIST_ICON_NAMES } from "./icon-map";

export const listIconConfig: RegisteredComponent = {
  component: ListIcon,
  name: "ListIcon",
  image: "https://unpkg.com/css.gg@2.0.0/icons/svg/list.svg",
  inputs: [
    {
      name: "items",
      type: "list",
      subFields: [
        {
          name: "icon",
          type: "string",
          enum: LIST_ICON_NAMES,
          defaultValue: LIST_ICON_NAMES[0],
          helperText: "Lucide icon shown above the label.",
        },
        { name: "label", type: "string" },
      ],
      defaultValue: [
        { icon: "waves", label: "From the islands of Fiji" },
        { icon: "zap", label: "100% Natural Electrolytes" },
        { icon: "droplet", label: "Soft, Smooth taste" },
        { icon: "scale", label: "Perfectly balanced 7.7pH" },
      ],
    },
  ],
};
