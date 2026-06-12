"use client";
import useSWR from "swr";
import ProductCard from "@/components/shopify/ProductCard/ProductCard";
import type { Product } from "@/lib/shopify/types";
import type { ProductGridSelectedProps } from "./ProductGridSelected.types";
import styles from "./ProductGridSelected.module.scss";

interface HandleResult {
  handle: string;
  product: Product | null;
  fetchError: boolean;
}

const fetcher = async (url: string): Promise<{ results: HandleResult[] }> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load products");
  return (await res.json()) as { results: HandleResult[] };
};

export default function ProductGridSelectedClient({
  handles,
  heading,
}: ProductGridSelectedProps) {
  const rawHandles = (handles ?? [])
    .map((h) => h.shopifyProductHandle)
    .filter((h): h is string => !!h);

  const key =
    rawHandles.length > 0
      ? `/api/products?handles=${rawHandles.map(encodeURIComponent).join(",")}`
      : null;

  const { data, isLoading, error } = useSWR(key, fetcher);

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
