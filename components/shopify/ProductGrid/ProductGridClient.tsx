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
      {heading && <h2 className="text-2xl font-semibold tracking-tight">{heading}</h2>}
      {isLoading && <p className="text-muted-foreground">Loading…</p>}
      {data && data.products.length === 0 && !isLoading && (
        <p className="text-muted-foreground">No products found.</p>
      )}
      {data && data.products.length > 0 && (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
