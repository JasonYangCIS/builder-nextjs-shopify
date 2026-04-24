"use client";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/utils/cn";
import type { ProductVariant } from "@/lib/shopify/types";
import type { VariantPickerProps } from "./VariantPicker.types";

function findVariant(
  variants: ProductVariant[],
  selections: Record<string, string>,
): ProductVariant | null {
  return (
    variants.find((v) =>
      v.selectedOptions.every((o) => selections[o.name] === o.value),
    ) ?? null
  );
}

export default function VariantPicker({ product, onSelect }: VariantPickerProps) {
  const initial = useMemo(() => {
    const first = product.variants[0];
    return first ? Object.fromEntries(first.selectedOptions.map((o) => [o.name, o.value])) : {};
  }, [product]);

  const [selections, setSelections] = useState<Record<string, string>>(initial);
  const selected = useMemo(() => findVariant(product.variants, selections), [product, selections]);

  useEffect(() => {
    onSelect?.(selected);
  }, [selected, onSelect]);

  return (
    <div className="flex flex-col gap-4">
      {product.options.map((option) => (
        <fieldset key={option.name} className="flex flex-col gap-2">
          <legend className="text-sm font-medium">{option.name}</legend>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const isSelected = selections[option.name] === value;
              return (
                <button
                  type="button"
                  key={value}
                  onClick={() => setSelections((s) => ({ ...s, [option.name]: value }))}
                  className={cn(
                    "rounded-md border px-3 py-1.5 text-sm transition-colors focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-ring/50",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input bg-background hover:bg-accent",
                  )}
                  aria-pressed={isSelected}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}

export type { VariantPickerProps } from "./VariantPicker.types";
