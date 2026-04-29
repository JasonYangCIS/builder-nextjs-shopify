"use client";
import { useState } from "react";
import Image from "next/image";
import VariantPicker from "@/components/shopify/VariantPicker/VariantPicker";
import AddToCartButton from "@/components/shopify/AddToCartButton/AddToCartButton";
import InventoryBadge from "@/components/shopify/InventoryBadge/InventoryBadge";
import PriceDisplay from "@/components/shopify/PriceDisplay/PriceDisplay";
import { sanitizeHtml } from "@/utils/sanitize-html";
import type { Product, ProductVariant } from "@/lib/shopify/types";
import styles from "./ProductDetail.module.scss";

export interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [variant, setVariant] = useState<ProductVariant | null>(product.variants[0] ?? null);
  const img = variant?.image ?? product.featuredImage;

  return (
    <article className="grid gap-12 md:grid-cols-2">
      {/* Image panel */}
      <div className={`relative overflow-hidden x-frame ${styles.imageFrame}`}>
        <span className="corner-tl" aria-hidden="true" />
        <span className="corner-br" aria-hidden="true" />

        {img ? (
          <Image
            src={img.url}
            alt={img.altText ?? product.title}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            priority
            className="object-cover"
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

        {product.productType && (
          <div className={`absolute top-4 left-4 t-eyebrow px-2 py-1 ${styles.typeTag}`}>
            {product.productType}
          </div>
        )}
      </div>

      {/* Info panel */}
      <div className="flex flex-col gap-6">
        <div className="t-eyebrow flex items-center gap-3">
          <span aria-hidden="true" className={styles.eyebrowRule} />
          SPECIMEN DETAIL
        </div>

        <h1 className={`t-display ${styles.title}`}>{product.title}</h1>

        <div className="flex items-center gap-4">
          <PriceDisplay
            price={variant?.price ?? product.priceRange.minVariantPrice}
            compareAtPrice={variant?.compareAtPrice}
          />
          <InventoryBadge
            availableForSale={variant?.availableForSale ?? product.availableForSale}
            quantityAvailable={variant?.quantityAvailable ?? null}
          />
        </div>

        <div className={styles.divider} />

        <VariantPicker product={product} onSelect={setVariant} />

        {variant && (
          <AddToCartButton
            variantId={variant.id}
            availableForSale={variant.availableForSale}
            label="Acquire artifact"
          />
        )}

        <div className={styles.divider} />

        {product.descriptionHtml && (
          <div
            className="xeno-prose"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.descriptionHtml) }}
          />
        )}
      </div>
    </article>
  );
}
