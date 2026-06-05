"use client";
import useSWR from "swr";
import ProductCard from "@/components/shopify/ProductCard/ProductCard";
import type { Product } from "@/lib/shopify/types";
import type { ProductCardClientProps } from "./ProductCard.types";
import styles from "./ProductCardClient.module.scss";

const fetcher = async (url: string): Promise<{ products: Product[] }> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load product");
  return (await res.json()) as { products: Product[] };
};

export default function ProductCardClient({ productHandle }: ProductCardClientProps) {
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

  return <ProductCard product={product} />;
}
