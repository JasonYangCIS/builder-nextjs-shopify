import Image from "next/image";
import Link from "next/link";
import PriceDisplay from "@/components/shopify/PriceDisplay/PriceDisplay";
import InventoryBadge from "@/components/shopify/InventoryBadge/InventoryBadge";
import type { ProductCardProps } from "./ProductCard.types";

export default function ProductCard({ product }: ProductCardProps) {
  const img = product.featuredImage;
  const firstVariant = product.variants[0];
  return (
    <Link
      href={`/products/${product.handle}`}
      className="group flex flex-col gap-3 rounded-lg border bg-card p-4 text-card-foreground transition-colors hover:border-foreground/30 focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
        {img && (
          <Image
            src={img.url}
            alt={img.altText ?? product.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        )}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="line-clamp-2 text-sm font-medium text-foreground">{product.title}</h3>
        <div className="flex items-center justify-between gap-2">
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
