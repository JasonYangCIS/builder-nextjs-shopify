import { cn } from "@/utils/cn";
import { formatMoney } from "@/utils/date";
import type { PriceDisplayProps } from "./PriceDisplay.types";

export default function PriceDisplay({ price, compareAtPrice, className }: PriceDisplayProps) {
  const isOnSale = compareAtPrice && Number(compareAtPrice.amount) > Number(price.amount);
  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <span
        className="t-display"
        style={{ fontSize: "var(--t-sm)", letterSpacing: "0.06em", color: "var(--cyan-3)" }}
      >
        {formatMoney(price.amount, price.currencyCode)}
      </span>
      {isOnSale && (
        <span
          className="t-mono line-through"
          style={{ fontSize: "var(--t-xs)", color: "var(--ink-2)" }}
          aria-label="Original price"
        >
          {formatMoney(compareAtPrice.amount, compareAtPrice.currencyCode)}
        </span>
      )}
    </span>
  );
}

export type { PriceDisplayProps } from "./PriceDisplay.types";
