import { listProducts, getCollection } from "@/lib/shopify/product";
import ProductCard from "@/components/shopify/ProductCard/ProductCard";
import type { ProductGridProps } from "./ProductGrid.types";

export default async function ProductGrid({
  collectionHandle,
  query,
  limit = 12,
  heading,
}: ProductGridProps) {
  let products: Awaited<ReturnType<typeof listProducts>> = [];

  if (collectionHandle) {
    const collection = await getCollection(collectionHandle, limit);
    products = collection?.products ?? [];
  } else {
    products = await listProducts({ first: limit, query: query ?? undefined });
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
