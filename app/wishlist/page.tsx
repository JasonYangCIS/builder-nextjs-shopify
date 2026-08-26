"use client";
import useSWR from "swr";
import ProductCard from "@/components/shopify/ProductCard/ProductCard";
import WishlistButton from "@/components/shopify/WishlistButton/WishlistButton";
import { useWishlist } from "@/lib/wishlist/useWishlist";
import type { SelectedProductResult } from "@/lib/shopify/types";
import styles from "./Wishlist.module.scss";

const fetcher = async (url: string): Promise<{ results: SelectedProductResult[] }> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load products");
  return (await res.json()) as { results: SelectedProductResult[] };
};

export default function WishlistPage() {
  const { handles, isLoading: handlesLoading } = useWishlist();
  const key =
    handles.length > 0 ? `/api/products?handles=${handles.map(encodeURIComponent).join(",")}` : null;
  const { data, isLoading: productsLoading } = useSWR(key, fetcher);

  const results = data?.results ?? [];

  const isLoading = handlesLoading || (key !== null && productsLoading);

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <h1 className="t-display">Your wishlist</h1>
      </div>

      {isLoading && <p className="t-mono">Scanning sector...</p>}

      {!isLoading && handles.length === 0 && (
        <div className={`flex flex-col items-center gap-4 py-12 ${styles.empty}`}>
          <span className={styles.emptyGlyph}>◈</span>
          <p className={`t-mono ${styles.emptyText}`}>No artifacts saved</p>
        </div>
      )}

      {!isLoading && results.length > 0 && (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {results.map(({ handle, product, fetchError }) => (
            <li key={handle} className={styles.gridItem}>
              {product ? (
                <ProductCard product={product} />
              ) : (
                <div className={`flex flex-col items-center justify-center gap-2 ${styles.notFoundSlot}`}>
                  <span className={`t-mono ${styles.notFoundLabel}`}>
                    {fetchError ? `⌁ ${handle} unavailable` : `⌁ ${handle} not found`}
                  </span>
                </div>
              )}
              <WishlistButton handle={handle} className={styles.wishlistButton} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
