// Isomorphic helpers shared by the client component (SWR key) and the
// server-side SSR prefetch (fallback key). No "use client"/"server-only" —
// both runtimes import this, so it must stay free of side effects.
import type { SelectedHandle } from "./ProductGridSelected.types";

/** Builder gives us a list of `{ shopifyProductHandle }`; flatten to truthy handles, order preserved. */
export function extractSelectedHandles(handles?: SelectedHandle[] | null): string[] {
  return (handles ?? [])
    .map((h) => h.shopifyProductHandle)
    .filter((h): h is string => !!h);
}

/**
 * The `/api/products` URL used as the SWR key. The server prefetch keys its
 * SWR fallback with the SAME string, so production renders straight from the
 * fallback with no client fetch. Returns null (SWR "no-op") when empty.
 */
export function selectedProductsKey(rawHandles: string[]): string | null {
  return rawHandles.length > 0
    ? `/api/products?handles=${rawHandles.map(encodeURIComponent).join(",")}`
    : null;
}
