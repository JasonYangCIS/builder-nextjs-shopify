import CompareCardsClient from "./CompareCardsClient";
import type { CompareCardItem, CompareCardsProps } from "./CompareCards.types";

/**
 * Builder can hand this component partially-filled or malformed list items
 * while it's being dragged/edited in the visual editor, before required
 * fields are set. Normalize everything to safe defaults up front so the
 * client component never has to special-case missing data.
 */
function normalizeItem(item: unknown): CompareCardItem | null {
  if (!item || typeof item !== "object") return null;
  const raw = item as Partial<Record<keyof CompareCardItem, unknown>>;
  return {
    image: typeof raw.image === "string" ? raw.image : "",
    imageAlt: typeof raw.imageAlt === "string" && raw.imageAlt ? raw.imageAlt : null,
    label: typeof raw.label === "string" && raw.label ? raw.label : "Untitled",
    productHandle:
      typeof raw.productHandle === "string" && raw.productHandle ? raw.productHandle : null,
    sidebarContent:
      typeof raw.sidebarContent === "string" && raw.sidebarContent ? raw.sidebarContent : null,
  };
}

export default function CompareCards({ items }: CompareCardsProps) {
  const safeItems = (Array.isArray(items) ? items : [])
    .map(normalizeItem)
    .filter((item): item is CompareCardItem => item !== null);

  return <CompareCardsClient items={safeItems} />;
}

export type { CompareCardsProps, CompareCardItem } from "./CompareCards.types";
