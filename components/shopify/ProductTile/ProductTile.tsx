"use client";
import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@jasonyangcis/core-ui";
import PriceDisplay from "@/components/shopify/PriceDisplay/PriceDisplay";
import InventoryBadge from "@/components/shopify/InventoryBadge/InventoryBadge";
import VariantPicker from "@/components/shopify/VariantPicker/VariantPicker";
import QuantityStepper from "@/components/shopify/QuantityStepper/QuantityStepper";
import AddToCartButton from "@/components/shopify/AddToCartButton/AddToCartButton";
import { sanitizeHtml } from "@/utils/sanitize-html";
import type { Product, ProductVariant, ShopifyImage } from "@/lib/shopify/types";
import type { ProductTileProps } from "./ProductTile.types";
import cardStyles from "@/components/shopify/ProductCard/ProductCard.module.scss";
import styles from "./ProductTile.module.scss";

/** Dedupes the featured, catalog, and per-variant images so the gallery can show every
 * shot even when a variant's image isn't part of `product.images`. */
function buildGalleryImages(product: Product): ShopifyImage[] {
  const seen = new Set<string>();
  const gallery: ShopifyImage[] = [];

  const addImage = (image: ShopifyImage | null | undefined) => {
    if (!image?.url || seen.has(image.url)) return;
    seen.add(image.url);
    gallery.push(image);
  };

  addImage(product.featuredImage);
  (Array.isArray(product.images) ? product.images : []).forEach(addImage);
  (Array.isArray(product.variants) ? product.variants : []).forEach((v) => addImage(v.image));

  return gallery;
}

export default function ProductTile({ product }: ProductTileProps) {
  const [open, setOpen] = useState(false);
  const [variant, setVariant] = useState<ProductVariant | null>(product.variants[0] ?? null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const firstVariant = product.variants[0];
  const tileImage = product.featuredImage;
  const images = useMemo(() => buildGalleryImages(product), [product]);
  const activeImage = images[activeImageIndex] ?? tileImage;

  function handleVariantSelect(nextVariant: ProductVariant | null) {
    setVariant(nextVariant);
    if (!nextVariant?.image?.url) return;
    const index = images.findIndex((image) => image.url === nextVariant.image?.url);
    if (index !== -1) setActiveImageIndex(index);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      setVariant(product.variants[0] ?? null);
      setQuantity(1);
      setActiveImageIndex(0);
    }
  }

  return (
    <>
      <button
        type="button"
        ref={triggerRef}
        onClick={() => handleOpenChange(true)}
        className={`group ${cardStyles.card}`}
      >
        <span className="corner-tl" aria-hidden="true" />
        <span className="corner-br" aria-hidden="true" />

        <div className={`relative overflow-hidden ${cardStyles.imageWrap}`}>
          {tileImage ? (
            <Image
              src={tileImage.url}
              alt={tileImage.altText ?? product.title}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className={`absolute inset-0 flex items-center justify-center ${cardStyles.fallback}`}>
              <span className={cardStyles.fallbackGlyph}>◈</span>
            </div>
          )}

          <div aria-hidden="true" className={`absolute inset-0 pointer-events-none ${cardStyles.scanlines}`} />
        </div>

        <div className={`flex flex-col gap-2 p-4 ${cardStyles.info}`}>
          <div className={`t-mono ${cardStyles.kicker}`}>{product.productType || "ARTIFACT"}</div>

          <h3 className={`line-clamp-2 t-display ${cardStyles.title}`}>{product.title}</h3>

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
      </button>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          handleOpenChange(next);
        }}
      >
        <DialogContent
          className={styles.sidebar}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            triggerRef.current?.focus();
          }}
        >
          <DialogTitle className={`t-display ${styles.title}`}>{product.title}</DialogTitle>
          <DialogDescription className="sr-only">More details about {product.title}</DialogDescription>

          <div className={styles.gallery}>
            {activeImage ? (
              <Image
                key={activeImage.url}
                src={activeImage.url}
                alt={activeImage.altText ?? product.title}
                fill
                sizes="480px"
                className={styles.galleryImage}
              />
            ) : (
              <span className={styles.imageFallback} aria-hidden="true">
                <span className={cardStyles.fallbackGlyph}>◈</span>
              </span>
            )}
          </div>

          {images.length > 1 && (
            <div className={styles.thumbRow}>
              {images.map((image, index) => (
                <button
                  key={image.url}
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                  aria-label={`Show image ${index + 1} of ${images.length}`}
                  aria-current={index === activeImageIndex}
                  className={styles.thumb}
                  data-active={index === activeImageIndex ? "true" : "false"}
                >
                  <Image src={image.url} alt="" fill sizes="64px" className={styles.thumbImage} />
                </button>
              ))}
            </div>
          )}

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

          <VariantPicker product={product} onSelect={handleVariantSelect} />

          <div className={styles.quantityRow}>
            <span className="t-eyebrow">Quantity</span>
            <QuantityStepper value={quantity} onChange={setQuantity} />
          </div>

          {variant && (
            <AddToCartButton
              variantId={variant.id}
              availableForSale={variant.availableForSale}
              quantity={quantity}
            />
          )}

          {product.descriptionHtml && (
            <div
              className={styles.description}
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.descriptionHtml) }}
            />
          )}

          <Link href={`/products/${product.handle}`} className={`t-mono ${styles.viewProductLink}`}>
            View full details
          </Link>
        </DialogContent>
      </Dialog>
    </>
  );
}

export type { ProductTileProps } from "./ProductTile.types";
