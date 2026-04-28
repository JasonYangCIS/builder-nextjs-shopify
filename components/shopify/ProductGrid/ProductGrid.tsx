import { listProducts, getCollection } from "@/lib/shopify/product";
import ProductCard from "@/components/shopify/ProductCard/ProductCard";
import type { ProductGridProps } from "./ProductGrid.types";

const MAX_LIMIT = 48;

export default async function ProductGrid({
  collectionHandle,
  query,
  limit = 12,
  heading,
}: ProductGridProps) {
  const safeLimit = Math.min(MAX_LIMIT, Math.max(1, limit));
  let products: Awaited<ReturnType<typeof listProducts>> = [];

  try {
    if (collectionHandle) {
      const collection = await getCollection(collectionHandle, safeLimit);
      products = collection?.products ?? [];
    } else {
      products = await listProducts({ first: safeLimit, query: query ?? undefined });
    }
  } catch {
    // Degrade gracefully — show empty state rather than crashing the page
    products = [];
  }

  return (
    <section className="flex flex-col gap-6">
      {heading && <h2 className="text-2xl font-semibold tracking-tight">{heading}</h2>}
      {products.length === 0 && (
        <p className="text-muted-foreground">No products found.</p>
      )}
      {products.length > 0 && (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export type { ProductGridProps } from "./ProductGrid.types";
