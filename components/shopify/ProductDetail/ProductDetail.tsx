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
    <article className="grid gap-8 md:grid-cols-2">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
        {img && (
          <Image
            src={img.url}
            alt={img.altText ?? product.title}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            priority
            className="object-cover"
          />
        )}
      </div>
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">{product.title}</h1>
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
        </header>
        <VariantPicker product={product} onSelect={setVariant} />
        {variant && (
          <AddToCartButton
            variantId={variant.id}
            availableForSale={variant.availableForSale}
            label="Add to cart"
          />
        )}
        {product.descriptionHtml && (
          <div
            className="prose prose-sm max-w-none text-foreground"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.descriptionHtml) }}
          />
        )}
      </div>
    </article>
  );
}
