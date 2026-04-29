"use client";
import { useState } from "react";
import Image from "next/image";
import VariantPicker from "@/components/shopify/VariantPicker/VariantPicker";
import AddToCartButton from "@/components/shopify/AddToCartButton/AddToCartButton";
import InventoryBadge from "@/components/shopify/InventoryBadge/InventoryBadge";
import PriceDisplay from "@/components/shopify/PriceDisplay/PriceDisplay";
import { sanitizeHtml } from "@/utils/sanitize-html";
import type { Product, ProductVariant } from "@/lib/shopify/types";

export interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [variant, setVariant] = useState<ProductVariant | null>(product.variants[0] ?? null);
  const img = variant?.image ?? product.featuredImage;

  return (
    <article className="grid gap-12 md:grid-cols-2">
      {/* Image panel */}
      <div
        className="relative overflow-hidden x-frame"
        style={{ aspectRatio: "4/5" }}
      >
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
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: "radial-gradient(120% 80% at 50% 0%, rgba(61,217,214,0.18), transparent 60%), var(--void-3)",
            }}
          >
            <span style={{ color: "var(--cyan-3)", opacity: 0.4, fontSize: "64px" }}>◈</span>
          </div>
        )}

        {/* Scan-line overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.012) 0 1px, transparent 1px 3px)",
            mixBlendMode: "overlay",
          }}
        />

        {/* Product type tag */}
        {product.productType && (
          <div
            className="absolute top-4 left-4 t-eyebrow px-2 py-1"
            style={{
              background: "rgba(6, 9, 15, 0.75)",
              border: "1px solid var(--cyan-line)",
              backdropFilter: "blur(4px)",
              fontSize: "9px",
            }}
          >
            {product.productType}
          </div>
        )}
      </div>

      {/* Info panel */}
      <div className="flex flex-col gap-6">
        {/* Eyebrow */}
        <div className="t-eyebrow flex items-center gap-3">
          <span style={{ width: "28px", height: "1px", background: "var(--cyan-3)", boxShadow: "var(--glow-cyan-sm)", display: "inline-block" }} aria-hidden="true" />
          SPECIMEN DETAIL
        </div>

        {/* Title */}
        <h1
          className="t-display"
          style={{
            fontSize: "clamp(28px, 4vw, 48px)",
            letterSpacing: "0.04em",
            lineHeight: 0.95,
            color: "var(--ink-0)",
          }}
        >
          {product.title}
        </h1>

        {/* Price + inventory */}
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

        {/* Divider */}
        <div style={{ height: "1px", background: "var(--border)" }} />

        {/* Variant picker */}
        <VariantPicker product={product} onSelect={setVariant} />

        {/* Add to cart */}
        {variant && (
          <AddToCartButton
            variantId={variant.id}
            availableForSale={variant.availableForSale}
            label="Acquire artifact"
          />
        )}

        {/* Divider */}
        <div style={{ height: "1px", background: "var(--border)" }} />

        {/* Description */}
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
