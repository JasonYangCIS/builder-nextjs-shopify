// Isomorphic helper shared by the client component (SWR key) and the
// server-side SSR prefetch (fallback key). No "use client"/"server-only" —
// both runtimes import this, so it must stay free of side effects.
import type { ProductGridProps } from "./ProductGrid.types";

/**
 * The `/api/products` URL used as the SWR key. The server prefetch keys its SWR
 * fallback with the SAME string, so production renders straight from the
 * fallback with no client fetch. `limit` defaults to 12 to match the component.
 */
export function productGridKey({ collectionHandle, query, limit = 12 }: ProductGridProps): string {
  const params = new URLSearchParams();
  if (collectionHandle) params.set("collection", collectionHandle);
  if (query) params.set("query", query);
  params.set("limit", String(limit));
  return `/api/products?${params.toString()}`;
}
