"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";
import { useIsPreviewing } from "@/lib/builder/useIsPreviewing";
import ProductCard from "@/components/shopify/ProductCard/ProductCard";
import type { Product, ProductFacet } from "@/lib/shopify/types";
import { PRODUCT_SORT_OPTIONS } from "@/lib/shopify/sort-options";
import type { ProductGridProps } from "./ProductGrid.types";
import { productGridKey } from "./ProductGrid.shared";
import ProductGridControls from "./ProductGridControls";
import styles from "./ProductGrid.module.scss";

const SEARCH_DEBOUNCE_MS = 300;

const fetcher = async (url: string): Promise<{ products: Product[]; facets: ProductFacet[] }> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load products");
  return (await res.json()) as { products: Product[]; facets: ProductFacet[] };
};

export default function ProductGridClient({
  collectionHandle,
  query,
  limit = 12,
  heading,
  enableControls,
}: ProductGridProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  // Empty until the shopper picks a sort, so the first-paint SWR key matches
  // the server-rendered fallback (no extra query params) and avoids a refetch.
  const [sort, setSort] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search]);

  const filters = useMemo(() => Object.values(activeFilters).flat(), [activeFilters]);

  const key = productGridKey({
    collectionHandle,
    query,
    limit,
    ...(enableControls ? { search: debouncedSearch, sort, filters } : {}),
  });

  // In the Builder editor we revalidate freely so admins see real-time product
  // changes. In production an SWR fallback is hydrated from the server, so we
  // pin it (no client refetch) — the grid is already in the server HTML.
  const listRef = useRef<HTMLUListElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  const previewing = useIsPreviewing();
  const { data, isLoading } = useSWR(
    key,
    fetcher,
    previewing
      ? undefined
      : { revalidateIfStale: false, revalidateOnFocus: false, revalidateOnReconnect: false },
  );

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          list.classList.add(styles.visible);
          headingRef.current?.classList.add(styles.visible);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(list);
    return () => observer.disconnect();
  }, [data]);

  function toggleFilter(facetId: string, valueInput: string) {
    setActiveFilters((prev) => {
      const current = prev[facetId] ?? [];
      const next = current.includes(valueInput)
        ? current.filter((v) => v !== valueInput)
        : [...current, valueInput];
      return { ...prev, [facetId]: next };
    });
  }

  return (
    <section className="flex flex-col gap-6">
      {heading && (
        <div ref={headingRef} className={`flex items-center gap-4 ${styles.headingWrap}`}>
          <h2 className={`t-display ${styles.heading}`}>{heading}</h2>
          <div className={styles.headingRule} />
        </div>
      )}

      {enableControls && (
        <ProductGridControls
          search={search}
          onSearchChange={setSearch}
          sortOptions={PRODUCT_SORT_OPTIONS}
          sortValue={sort || PRODUCT_SORT_OPTIONS[0].id}
          onSortChange={setSort}
          facets={data?.facets ?? []}
          activeFilters={activeFilters}
          onToggleFilter={toggleFilter}
        />
      )}

      {isLoading && (
        <p className={`t-mono ${styles.scanText}`}>Scanning sector...</p>
      )}

      {data && data.products.length === 0 && !isLoading && (
        <p className={`t-mono ${styles.scanText}`}>⌁ No artifacts found</p>
      )}

      {data && data.products.length > 0 && (
        <ul
          ref={listRef}
          className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 ${styles.gridList}`}
        >
          {data.products.map((p, i) => (
            <li
              key={p.id}
              className={styles.gridItem}
              style={{ "--delay": `${i * 70}ms` } as React.CSSProperties}
            >
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
