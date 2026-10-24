import { ListIcon as CoreListIcon } from "@jasonyangcis/core-ui";
import { LIST_ICON_MAP } from "./icon-map";
import type { ListIconProps } from "./ListIcon.types";

export type { ListIconProps, ListIconInputItem } from "./ListIcon.types";

export default function ListIcon({ items, ...rest }: ListIconProps) {
  const resolved = items?.map(({ icon, label }) => {
    const Icon = icon ? LIST_ICON_MAP[icon] : null;
    return {
      label,
      icon: Icon ? <Icon data-slot="list-icon-glyph" aria-hidden="true" /> : undefined,
    };
  });

  return <CoreListIcon {...rest} items={resolved} />;
}
