"use client";
import useSWR from "swr";
import { isPreviewing } from "@builder.io/sdk-react";
import ProductCard from "@/components/shopify/ProductCard/ProductCard";
import type { SelectedProductResult } from "@/lib/shopify/types";
import type { ProductGridSelectedProps } from "./ProductGridSelected.types";
import { extractSelectedHandles, selectedProductsKey } from "./ProductGridSelected.shared";
import styles from "./ProductGridSelected.module.scss";

const fetcher = async (url: string): Promise<{ results: SelectedProductResult[] }> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load products");
  return (await res.json()) as { results: SelectedProductResult[] };
};

export default function ProductGridSelectedClient({
  handles,
  heading,
}: ProductGridSelectedProps) {
  const rawHandles = extractSelectedHandles(handles);
  const key = selectedProductsKey(rawHandles);

  // In the Builder editor we revalidate freely so admins see real-time product
  // changes. In production an SWR fallback is hydrated from the server, so we
  // pin it (no client refetch) — the grid is already in the server HTML.
  const previewing = isPreviewing();
  const { data, isLoading, error } = useSWR(
    key,
    fetcher,
    previewing
      ? undefined
      : { revalidateIfStale: false, revalidateOnFocus: false, revalidateOnReconnect: false },
  );

  const results = data?.results ?? [];
  const found = results.filter((r) => r.product !== null);

  return (
    <section className="flex flex-col gap-6">
      {heading && (
        <div className="flex items-center gap-4">
          <h2 className={`t-display ${styles.heading}`}>{heading}</h2>
          <div className={styles.headingRule} />
          {!isLoading && !error && (
            <span className="t-eyebrow">
              {found.length} artifact{found.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      )}

      {isLoading && (
        <p className={`t-mono ${styles.scanText}`}>Scanning sector...</p>
      )}

      {!isLoading && error && (
        <p className={`t-mono ${styles.scanText}`}>⌁ Failed to load artifacts</p>
      )}

      {!isLoading && !error && rawHandles.length === 0 && (
        <p className={`t-mono ${styles.scanText}`}>⌁ No artifacts selected</p>
      )}

      {!isLoading && !error && rawHandles.length > 0 && results.length > 0 && (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {results.map(({ handle, product, fetchError }, i) =>
            product ? (
              <li key={`${handle}-${i}`}>
                <ProductCard product={product} />
              </li>
            ) : (
              <li key={`${handle}-${i}`} className={styles.notFoundSlot}>
                <span className={`t-mono ${styles.notFoundLabel}`}>
                  {fetchError ? `⌁ ${handle} unavailable` : `⌁ ${handle} not found`}
                </span>
              </li>
            )
          )}
        </ul>
      )}
    </section>
  );
}
