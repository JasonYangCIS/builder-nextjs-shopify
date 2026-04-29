import { listProducts, getCollection } from "@/lib/shopify/product";
import ProductCard from "@/components/shopify/ProductCard/ProductCard";
import type { ProductGridProps } from "./ProductGrid.types";
import styles from "./ProductGrid.module.scss";

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
    products = [];
  }

  return (
    <section className="flex flex-col gap-6">
      {heading && (
        <div className="flex items-center gap-4">
          <h2 className={`t-display ${styles.heading}`}>{heading}</h2>
          <div className={styles.headingRule} />
          <span className="t-eyebrow">
            {products.length} artifact{products.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {products.length === 0 && (
        <p className={styles.empty}>⌁ NO ARTIFACTS FOUND IN THIS SECTOR</p>
      )}

      {products.length > 0 && (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
