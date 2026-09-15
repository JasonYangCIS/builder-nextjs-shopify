import type { HTMLAttributes, Ref } from "react";
import type { ListIconName } from "./icon-map";

export interface ListIconInputItem {
  icon: ListIconName | null;
  label: string | null;
}

export interface ListIconProps extends HTMLAttributes<HTMLElement> {
  items?: ListIconInputItem[] | null;
  ref?: Ref<HTMLElement>;
}
