"use client";
import { useEffect, useMemo, useState } from "react";
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

  // Hide picker if only one option with value "Default Title"
  const isDefaultOnly =
    product.options.length === 1 &&
    product.options[0].name === "Title" &&
    product.options[0].values.length === 1 &&
    product.options[0].values[0] === "Default Title";

  if (isDefaultOnly) return null;

  return (
    <div className="flex flex-col gap-4">
      {product.options.map((option) => (
        <fieldset key={option.name} className="flex flex-col gap-2" style={{ border: "none", padding: 0, margin: 0 }}>
          <legend
            className="t-eyebrow"
            style={{ marginBottom: "8px" }}
          >
            {option.name}
          </legend>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const isSelected = selections[option.name] === value;
              return (
                <button
                  type="button"
                  key={value}
                  onClick={() => setSelections((s) => ({ ...s, [option.name]: value }))}
                  aria-pressed={isSelected}
                  className="t-mono"
                  style={{
                    padding: "6px 14px",
                    fontSize: "var(--t-xs)",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    border: isSelected ? "1px solid var(--cyan-line)" : "1px solid var(--border)",
                    background: isSelected ? "var(--cyan-soft)" : "transparent",
                    color: isSelected ? "var(--cyan-3)" : "var(--ink-1)",
                    cursor: "pointer",
                    transition: "all 0.14s",
                    clipPath: "var(--chamfer-sm)",
                    boxShadow: isSelected ? "var(--glow-cyan-sm)" : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--cyan-line)";
                      (e.currentTarget as HTMLElement).style.color = "var(--ink-0)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                      (e.currentTarget as HTMLElement).style.color = "var(--ink-1)";
                    }
                  }}
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
