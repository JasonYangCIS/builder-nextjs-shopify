import "server-only";
import type { BuilderContent } from "@builder.io/sdk-react";
import { prefetchSelectedProducts } from "@/components/shopify/ProductGridSelected/ProductGridSelected.prefetch";
import { prefetchProductGrids } from "@/components/shopify/ProductGrid/ProductGrid.prefetch";

/**
 * Resolve every data-driven Builder block in `content` server-side into one SWR
 * fallback map, to pass to `<RenderBuilderContent fallback={...} />`. This is
 * how production routes render Shopify-backed blocks in the server HTML
 * (ISR/SSG) with no client fetch. Keys are distinct `/api/products` URLs, so
 * merging the per-component maps never collides. Register new data-driven
 * blocks here so every route picks them up.
 */
export async function prefetchBuilderFallback(
  content: BuilderContent | null,
): Promise<Record<string, unknown>> {
  const [selectedProducts, productGrids] = await Promise.all([
    prefetchSelectedProducts(content),
    prefetchProductGrids(content),
  ]);
  return { ...selectedProducts, ...productGrids };
}
