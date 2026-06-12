"use client";
import useSWR from "swr";
import { isPreviewing } from "@builder.io/sdk-react";
import ProductCard from "@/components/shopify/ProductCard/ProductCard";
import type { Product } from "@/lib/shopify/types";
import type { ProductGridProps } from "./ProductGrid.types";
import { productGridKey } from "./ProductGrid.shared";
import styles from "./ProductGrid.module.scss";

const fetcher = async (url: string): Promise<{ products: Product[] }> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load products");
  return (await res.json()) as { products: Product[] };
};

export default function ProductGridClient({
  collectionHandle,
  query,
  limit = 12,
  heading,
}: ProductGridProps) {
  const key = productGridKey({ collectionHandle, query, limit });

  // In the Builder editor we revalidate freely so admins see real-time product
  // changes. In production an SWR fallback is hydrated from the server, so we
  // pin it (no client refetch) — the grid is already in the server HTML.
  const previewing = isPreviewing();
  const { data, isLoading } = useSWR(
    key,
    fetcher,
    previewing
      ? undefined
      : { revalidateIfStale: false, revalidateOnFocus: false, revalidateOnReconnect: false },
  );

  return (
    <section className="flex flex-col gap-6">
      {heading && (
        <div className="flex items-center gap-4">
          <h2 className={`t-display ${styles.heading}`}>{heading}</h2>
          <div className={styles.headingRule} />
        </div>
      )}

      {isLoading && (
        <p className={`t-mono ${styles.scanText}`}>Scanning sector...</p>
      )}

      {data && data.products.length === 0 && !isLoading && (
        <p className={`t-mono ${styles.scanText}`}>⌁ No artifacts found</p>
      )}

      {data && data.products.length > 0 && (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.products.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
