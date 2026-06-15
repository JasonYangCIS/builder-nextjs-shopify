"use client";
import { useEffect, useRef } from "react";
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
  const listRef = useRef<HTMLUListElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  const previewing = isPreviewing();
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

  return (
    <section className="flex flex-col gap-6">
      {heading && (
        <div ref={headingRef} className={`flex items-center gap-4 ${styles.headingWrap}`}>
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
