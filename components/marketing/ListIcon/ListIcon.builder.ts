import type { RegisteredComponent } from "@builder.io/sdk-react";
import ListIcon from "./ListIcon";
import { LIST_ICON_NAMES } from "./list-icon-icons";

export const listIconConfig: RegisteredComponent = {
  component: ListIcon,
  name: "ListIcon",
  inputs: [
    {
      name: "items",
      type: "list",
      subFields: [
        {
          name: "iconName",
          type: "string",
          enum: LIST_ICON_NAMES,
          defaultValue: "Star",
          helperText: "Lucide icon shown above the label",
        },
        { name: "label", type: "string" },
      ],
      defaultValue: [
        { iconName: "Palmtree", label: "From the Islands of Fiji" },
        { iconName: "Zap", label: "100% Natural Electrolytes" },
        { iconName: "Droplet", label: "Soft, Smooth Taste" },
        { iconName: "Scale", label: "Perfectly Balanced 7.7pH" },
      ],
    },
  ],
};
