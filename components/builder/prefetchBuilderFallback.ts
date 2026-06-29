import "server-only";
import type { BuilderContent } from "@builder.io/sdk-react";
import { walkAndPrefetch } from "@/lib/builder/prefetch";
import { productGridPrefetcher } from "@/components/shopify/ProductGrid/ProductGrid.prefetch";
import { productGridSelectedPrefetcher } from "@/components/shopify/ProductGridSelected/ProductGridSelected.prefetch";

/**
 * Resolve every data-driven Builder block in `content` server-side into one SWR
 * fallback map, to pass to `<RenderBuilderContent fallback={...} />`. Register
 * new data-driven components by adding their prefetcher to this array.
 */
const prefetchers = [productGridPrefetcher, productGridSelectedPrefetcher];

export async function prefetchBuilderFallback(
  content: BuilderContent | null,
): Promise<Record<string, unknown>> {
  return walkAndPrefetch(content, prefetchers);
}
