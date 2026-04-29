"use client";
import { useEffect, useMemo, useState } from "react";
import type { ProductVariant } from "@/lib/shopify/types";
import type { VariantPickerProps } from "./VariantPicker.types";
import styles from "./VariantPicker.module.scss";

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

  const isDefaultOnly =
    product.options.length === 1 &&
    product.options[0].name === "Title" &&
    product.options[0].values.length === 1 &&
    product.options[0].values[0] === "Default Title";

  if (isDefaultOnly) return null;

  return (
    <div className="flex flex-col gap-4">
      {product.options.map((option) => (
        <fieldset key={option.name} className={`flex flex-col gap-2 ${styles.fieldset}`}>
          <legend className={`t-eyebrow ${styles.legend}`}>{option.name}</legend>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const isSelected = selections[option.name] === value;
              return (
                <button
                  type="button"
                  key={value}
                  onClick={() => setSelections((s) => ({ ...s, [option.name]: value }))}
                  aria-pressed={isSelected}
                  data-selected={isSelected ? "true" : "false"}
                  className={`t-mono ${styles.option}`}
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
