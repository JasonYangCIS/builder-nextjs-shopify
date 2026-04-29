import Image from "next/image";
import Link from "next/link";
import PriceDisplay from "@/components/shopify/PriceDisplay/PriceDisplay";
import InventoryBadge from "@/components/shopify/InventoryBadge/InventoryBadge";
import type { ProductCardProps } from "./ProductCard.types";
import styles from "./ProductCard.module.scss";

export default function ProductCard({ product }: ProductCardProps) {
  const img = product.featuredImage;
  const firstVariant = product.variants[0];

  return (
    <Link href={`/products/${product.handle}`} className={`group ${styles.card}`}>
      <span className="corner-tl" aria-hidden="true" />
      <span className="corner-br" aria-hidden="true" />

      <div className={`relative overflow-hidden ${styles.imageWrap}`}>
        {img ? (
          <Image
            src={img.url}
            alt={img.altText ?? product.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className={`absolute inset-0 flex items-center justify-center ${styles.fallback}`}>
            <span className={styles.fallbackGlyph}>◈</span>
          </div>
        )}

        <div
          aria-hidden="true"
          className={`absolute inset-0 pointer-events-none ${styles.scanlines}`}
        />
      </div>

      <div className={`flex flex-col gap-2 p-4 ${styles.info}`}>
        <div className={`t-mono ${styles.kicker}`}>
          {product.productType || "ARTIFACT"}
        </div>

        <h3 className={`line-clamp-2 t-display ${styles.title}`}>{product.title}</h3>

        <div className="flex items-center justify-between gap-2 mt-1">
          <PriceDisplay
            price={product.priceRange.minVariantPrice}
            compareAtPrice={firstVariant?.compareAtPrice}
          />
          <InventoryBadge
            availableForSale={product.availableForSale}
            quantityAvailable={firstVariant?.quantityAvailable ?? null}
          />
        </div>
      </div>
    </Link>
  );
}

export type { ProductCardProps } from "./ProductCard.types";
