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
      className="product-card group"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0",
        position: "relative",
        border: "1px solid var(--border)",
        background: "var(--card)",
        transition: "border-color 0.18s, box-shadow 0.18s",
        textDecoration: "none",
        color: "var(--foreground)",
        overflow: "hidden",
      }}
    >
      {/* Corner brackets */}
      <span className="corner-tl" aria-hidden="true" />
      <span className="corner-br" aria-hidden="true" />

      {/* Image area */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: "4/5", background: "var(--void-3)" }}
      >
        {img ? (
          <Image
            src={img.url}
            alt={img.altText ?? product.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: "radial-gradient(120% 80% at 50% 0%, rgba(61,217,214,0.15), transparent 60%), var(--void-3)",
            }}
          >
            <span style={{ color: "var(--cyan-3)", opacity: 0.4, fontSize: "32px" }}>◈</span>
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
      </div>

      {/* Info */}
      <div
        className="flex flex-col gap-2 p-4"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        {/* Product num / handle hint */}
        <div
          className="t-mono"
          style={{ fontSize: "9px", letterSpacing: "0.18em", color: "var(--ink-2)", textTransform: "uppercase" }}
        >
          {product.productType || "ARTIFACT"}
        </div>

        <h3
          className="line-clamp-2 t-display"
          style={{ fontSize: "13px", letterSpacing: "0.06em", color: "var(--ink-0)" }}
        >
          {product.title}
        </h3>

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

      <style>{`
        .product-card:hover {
          border-color: var(--cyan-line) !important;
          box-shadow: var(--glow-cyan-sm);
        }
      `}</style>
    </Link>
  );
}

export type { ProductCardProps } from "./ProductCard.types";
