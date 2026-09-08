"use client";
import useSWR from "swr";
import ProductTile from "@/components/shopify/ProductTile/ProductTile";
import type { Product } from "@/lib/shopify/types";
import type { ProductTileClientProps } from "./ProductTile.types";
import styles from "@/components/shopify/ProductCard/ProductCardClient.module.scss";

const fetcher = async (url: string): Promise<{ products: Product[] }> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load product");
  return (await res.json()) as { products: Product[] };
};

export default function ProductTileClient({ productHandle }: ProductTileClientProps) {
  const { data, isLoading } = useSWR(
    productHandle ? `/api/products?handle=${encodeURIComponent(productHandle)}` : null,
    fetcher,
  );

  if (!productHandle) {
    return <p className={`t-mono ${styles.placeholder}`}>⌁ Set a product handle</p>;
  }

  if (isLoading) {
    return <p className={`t-mono ${styles.placeholder}`}>Scanning sector...</p>;
  }

  const product = data?.products[0];
  if (!product) {
    return <p className={`t-mono ${styles.placeholder}`}>⌁ No artifact found</p>;
  }

  return <ProductTile product={product} />;
}
