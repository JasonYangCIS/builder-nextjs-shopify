import { ListIcon as CoreListIcon } from "@jasonyangcis/core-ui";
import type { ListIconProps as CoreListIconProps } from "@jasonyangcis/core-ui";
import { LIST_ICON_MAP } from "./list-icon-icons";

export interface ListIconItemInput {
  iconName?: string | null;
  label: string | null;
}

export interface ListIconProps extends Omit<CoreListIconProps, "items"> {
  items?: ListIconItemInput[] | null;
}

export default function ListIcon({ items, ...rest }: ListIconProps) {
  const resolved =
    items?.map(({ iconName, label }) => {
      const Icon = iconName ? LIST_ICON_MAP[iconName] : undefined;
      return { label, icon: Icon ? <Icon aria-hidden="true" /> : undefined };
    }) ?? null;

  return <CoreListIcon {...rest} items={resolved} />;
}
