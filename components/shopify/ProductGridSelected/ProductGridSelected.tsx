import { getProductByHandle } from "@/lib/shopify/product";
import ProductCard from "@/components/shopify/ProductCard/ProductCard";
import type { ProductGridSelectedProps } from "./ProductGridSelected.types";
import styles from "./ProductGridSelected.module.scss";

export default async function ProductGridSelected({
  handles,
  heading,
}: ProductGridSelectedProps) {
  const rawHandles = (handles ?? [])
    .map((h) => h.shopifyProductHandle)
    .filter((h): h is string => !!h);

  const settled = await Promise.all(rawHandles.map((h) => getProductByHandle(h)));
  const results = rawHandles.map((h, i) => ({ handle: h, product: settled[i] ?? null }));
  const found = results.filter((r) => r.product !== null);

  return (
    <section className="flex flex-col gap-6">
      {heading && (
        <div className="flex items-center gap-4">
          <h2 className={`t-display ${styles.heading}`}>{heading}</h2>
          <div className={styles.headingRule} />
          <span className="t-eyebrow">
            {found.length} artifact{found.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {results.length === 0 && (
        <p className={styles.empty}>⌁ NO ARTIFACTS FOUND IN THIS SECTOR</p>
      )}

      {results.length > 0 && (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {results.map(({ handle, product }) =>
            product ? (
              <li key={handle}>
                <ProductCard product={product} />
              </li>
            ) : (
              <li key={handle} className={styles.notFoundSlot}>
                <span className={`t-mono ${styles.notFoundLabel}`}>
                  ⌁ {handle} not found
                </span>
              </li>
            )
          )}
        </ul>
      )}
    </section>
  );
}

export type { ProductGridSelectedProps } from "./ProductGridSelected.types";
