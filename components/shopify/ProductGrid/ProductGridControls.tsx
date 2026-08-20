"use client";
import { Input, Label } from "@jasonyangcis/core-ui";
import type { ProductFacet, ProductSortOption } from "@/lib/shopify/types";
import styles from "./ProductGrid.module.scss";

export interface ProductGridControlsProps {
  search: string;
  onSearchChange: (value: string) => void;
  sortOptions: ProductSortOption[];
  sortValue: string;
  onSortChange: (value: string) => void;
  facets: ProductFacet[];
  activeFilters: Record<string, string[]>;
  onToggleFilter: (facetId: string, valueInput: string) => void;
}

export default function ProductGridControls({
  search,
  onSearchChange,
  sortOptions,
  sortValue,
  onSortChange,
  facets,
  activeFilters,
  onToggleFilter,
}: ProductGridControlsProps) {
  return (
    <div className={`flex flex-col gap-4 ${styles.controls}`}>
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="product-grid-search">Search</Label>
          <Input
            id="product-grid-search"
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="product-grid-sort">Sort by</Label>
          <select
            id="product-grid-sort"
            value={sortValue}
            onChange={(e) => onSortChange(e.target.value)}
            className={`t-mono ${styles.sortSelect}`}
          >
            {sortOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {facets.length > 0 && (
        <div className={`flex flex-wrap gap-6 ${styles.filterGroups}`}>
          {facets.map((facet) => (
            <fieldset key={facet.id} className={`flex flex-col gap-2 ${styles.fieldset}`}>
              <legend className={`t-eyebrow ${styles.legend}`}>{facet.label}</legend>
              <div className="flex flex-col gap-1">
                {facet.values.map((value) => {
                  const checked = activeFilters[facet.id]?.includes(value.input) ?? false;
                  return (
                    <label key={value.id} className={`flex items-center gap-2 t-mono ${styles.filterOption}`}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => onToggleFilter(facet.id, value.input)}
                      />
                      <span>
                        {value.label} ({value.count})
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>
      )}
    </div>
  );
}
