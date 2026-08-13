"use client";
import { useState } from "react";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@jasonyangcis/core-ui";
import BlogRichText from "@/components/blog/BlogRichText/BlogRichText";
import PriceDisplay from "@/components/shopify/PriceDisplay/PriceDisplay";
import InventoryBadge from "@/components/shopify/InventoryBadge/InventoryBadge";
import VariantPicker from "@/components/shopify/VariantPicker/VariantPicker";
import AddToCartButton from "@/components/shopify/AddToCartButton/AddToCartButton";
import type { Product, ProductVariant } from "@/lib/shopify/types";
import type { CompareCardItem } from "./CompareCards.types";
import styles from "./CompareCards.module.scss";

interface CompareCardsClientProps {
  items: CompareCardItem[];
}

const fetcher = async (url: string): Promise<{ products: Product[] }> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load product");
  return (await res.json()) as { products: Product[] };
};

export default function CompareCardsClient({ items }: CompareCardsClientProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selected = selectedIndex !== null ? items[selectedIndex] : null;

  const { data, isLoading } = useSWR(
    selected?.productHandle
      ? `/api/products?handle=${encodeURIComponent(selected.productHandle)}`
      : null,
    fetcher,
  );
  const product = data?.products[0];

  if (items.length === 0) return null;

  return (
    <>
      <div className={styles.grid}>
        {items.map((item, index) => (
          <button
            key={`${item.label}-${index}`}
            type="button"
            className={styles.card}
            onClick={() => setSelectedIndex(index)}
          >
            <span className={styles.imageWrap}>
              <Image
                src={item.image}
                alt={item.imageAlt ?? item.label}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className={styles.image}
              />
              <span className={styles.scrim} aria-hidden="true" />
            </span>
            <span className={styles.plusIcon} aria-hidden="true">
              <PlusIcon />
            </span>
            <span className={`t-mono ${styles.label}`}>{item.label}</span>
          </button>
        ))}
      </div>

      <Dialog
        open={selectedIndex !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedIndex(null);
        }}
      >
        <DialogContent>
          {selected && (
            <div className={styles.sidebar}>
              <DialogTitle className={`t-display ${styles.sidebarTitle}`}>
                {selected.label}
              </DialogTitle>
              <DialogDescription className="sr-only">
                More details about {selected.label}
              </DialogDescription>

              {selected.productHandle && (
                <div className={styles.productSummary}>
                  {isLoading && <p className={`t-mono ${styles.placeholder}`}>Loading...</p>}
                  {!isLoading && product && <ProductVariantPanel key={product.id} product={product} />}
                  {!isLoading && !product && (
                    <p className={`t-mono ${styles.placeholder}`}>Product not found</p>
                  )}
                </div>
              )}

              {selected.sidebarContent && (
                <BlogRichText html={selected.sidebarContent} className={styles.sidebarContent} />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function ProductVariantPanel({ product }: { product: Product }) {
  const [variant, setVariant] = useState<ProductVariant | null>(product.variants[0] ?? null);
  const img = variant?.image ?? product.featuredImage;

  return (
    <>
      {img && (
        <div className={styles.productImageWrap}>
          <Image
            src={img.url}
            alt={img.altText ?? product.title}
            fill
            sizes="400px"
            className={styles.productImage}
          />
        </div>
      )}
      <h3 className={`t-display ${styles.productTitle}`}>{product.title}</h3>
      <div className="flex items-center gap-3">
        <PriceDisplay
          price={variant?.price ?? product.priceRange.minVariantPrice}
          compareAtPrice={variant?.compareAtPrice}
        />
        <InventoryBadge
          availableForSale={variant?.availableForSale ?? product.availableForSale}
          quantityAvailable={variant?.quantityAvailable ?? null}
        />
      </div>
      <VariantPicker product={product} onSelect={setVariant} />
      {variant && <AddToCartButton variantId={variant.id} availableForSale={variant.availableForSale} />}
      <Link href={`/products/${product.handle}`} className={`t-mono ${styles.viewProductLink}`}>
        View product
      </Link>
    </>
  );
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
