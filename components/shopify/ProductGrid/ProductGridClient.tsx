"use client";
import useSWR from "swr";
import ProductCard from "@/components/shopify/ProductCard/ProductCard";
import type { Product } from "@/lib/shopify/types";
import type { ProductGridProps } from "./ProductGrid.types";

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
  const params = new URLSearchParams();
  if (collectionHandle) params.set("collection", collectionHandle);
  if (query) params.set("query", query);
  params.set("limit", String(limit));
  const { data, isLoading } = useSWR(`/api/products?${params.toString()}`, fetcher);

  return (
    <section className="flex flex-col gap-6">
      {heading && (
        <div className="flex items-center gap-4">
          <h2
            className="t-display"
            style={{ fontSize: "var(--t-xl)", letterSpacing: "0.06em", color: "var(--ink-0)" }}
          >
            {heading}
          </h2>
          <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
        </div>
      )}

      {isLoading && (
        <p className="t-mono" style={{ color: "var(--ink-2)", fontSize: "var(--t-xs)", letterSpacing: "0.18em", textTransform: "uppercase" }}>
          Scanning sector...
        </p>
      )}

      {data && data.products.length === 0 && !isLoading && (
        <p className="t-mono" style={{ color: "var(--ink-2)", fontSize: "var(--t-xs)", letterSpacing: "0.18em", textTransform: "uppercase" }}>
          // No artifacts found
        </p>
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
