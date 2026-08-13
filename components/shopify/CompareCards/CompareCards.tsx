import CompareCardsClient from "./CompareCardsClient";
import type { CompareCardsProps } from "./CompareCards.types";

export default function CompareCards({ items }: CompareCardsProps) {
  return <CompareCardsClient items={items ?? []} />;
}

export type { CompareCardsProps, CompareCardItem } from "./CompareCards.types";
