import "server-only";
import { shopifyFetch } from "./storefront-client";
import { GET_PRODUCT_BY_HANDLE, LIST_PRODUCTS, LIST_PRODUCT_HANDLES } from "./queries/product";
import { GET_COLLECTION, LIST_COLLECTION_HANDLES } from "./queries/collection";
import type { Product, ProductFacet, SelectedProductResult } from "./types";
import { PRODUCT_SORT_OPTIONS } from "./sort-options";

/** Upper bound on handles resolved in a single selected-products request. */
export const SELECTED_PRODUCTS_MAX_HANDLES = 24;

interface RawProduct extends Omit<Product, "images" | "variants"> {
  images: { edges: { node: Product["images"][number] }[] };
  variants: { edges: { node: Product["variants"][number] }[] };
}

function normalizeProduct(p: RawProduct | null): Product | null {
  if (!p) return null;
  return {
    ...p,
    images: p.images.edges.map((e) => e.node),
    variants: p.variants.edges.map((e) => e.node),
  };
}

export async function getProductByHandle(handle: string): Promise<Product | null> {
  const { data } = await shopifyFetch<{ product: RawProduct | null }>({
    query: GET_PRODUCT_BY_HANDLE,
    variables: { handle },
    tags: [`product:${handle}`],
  });
  return normalizeProduct(data.product);
}

/**
 * Resolve a list of product handles, preserving input order and trimming to
 * {@link SELECTED_PRODUCTS_MAX_HANDLES}. Each handle is fetched independently so
 * one failure never sinks the rest. Shared by the `/api/products` handler and
 * the server-side SSR prefetch so both produce byte-identical results.
 */
export async function resolveProductsByHandles(handles: string[]): Promise<SelectedProductResult[]> {
  const ordered = handles
    .map((h) => h.trim())
    .filter(Boolean)
    .slice(0, SELECTED_PRODUCTS_MAX_HANDLES);
  const unique = [...new Set(ordered)];
  const settled = await Promise.allSettled(unique.map((h) => getProductByHandle(h)));
  const resolved = new Map(
    unique.map((h, i) => {
      const s = settled[i];
      return [
        h,
        s.status === "fulfilled"
          ? { product: s.value ?? null, fetchError: false }
          : { product: null, fetchError: true },
      ] as const;
    }),
  );
  return ordered.map((h) => ({ handle: h, ...resolved.get(h)! }));
}

/** Upper bound on the number of products a single grid request returns. */
export const PRODUCT_GRID_MAX_LIMIT = 48;

/**
 * Resolve the products for a ProductGrid block: a collection's products when a
 * handle is given, otherwise a (optionally filtered) product listing. Shared by
 * the `/api/products` handler and the server-side SSR prefetch so both produce
 * identical results for the same query string.
 */
export interface ProductGridResult {
  products: Product[];
  facets: ProductFacet[];
}

export async function resolveProductGrid(opts: {
  collectionHandle?: string | null;
  query?: string | null;
  limit?: number | string | null;
  sort?: string | null;
  filters?: string[] | null;
}): Promise<ProductGridResult> {
  const limit = Math.min(PRODUCT_GRID_MAX_LIMIT, Number(opts.limit ?? 12));
  const filters = opts.filters?.map((f) => JSON.parse(f) as Record<string, unknown>);
  const sortOption = opts.sort ? PRODUCT_SORT_OPTIONS.find((o) => o.id === opts.sort) : undefined;
  if (opts.collectionHandle) {
    const collection = await getCollection(opts.collectionHandle, limit, {
      sortKey: sortOption?.sortKey,
      reverse: sortOption?.reverse,
      filters,
    });
    return { products: collection?.products ?? [], facets: collection?.facets ?? [] };
  }
  // The root `products` field has no `filters` argument (only `Collection.products` does),
  // so a facet selection with no collection selected can't be applied.
  return listProducts({
    first: limit,
    query: opts.query ?? undefined,
    // The root `products` field uses `ProductSortKeys`, which spells "created at" differently.
    sortKey: sortOption?.sortKey === "CREATED" ? "CREATED_AT" : sortOption?.sortKey,
    reverse: sortOption?.reverse,
  });
}

export async function listProducts(opts: {
  first?: number;
  query?: string;
  sortKey?: string;
  reverse?: boolean;
} = {}): Promise<ProductGridResult> {
  const { first = 24, query, sortKey, reverse } = opts;
  const { data } = await shopifyFetch<{
    products: { edges: { node: RawProduct }[] };
  }>({
    query: LIST_PRODUCTS,
    variables: { first, query, sortKey, reverse },
    tags: ["products"],
  });
  return {
    products: data.products.edges.map((e) => normalizeProduct(e.node)!).filter(Boolean),
    // The root `products` field has no `filters` argument, so facets would be non-actionable here.
    facets: [],
  };
}

export async function listProductHandles(first = 250): Promise<string[]> {
  const { data } = await shopifyFetch<{ products: { edges: { node: { handle: string } }[] } }>({
    query: LIST_PRODUCT_HANDLES,
    variables: { first },
    tags: ["products"],
  });
  return data.products.edges.map((e) => e.node.handle);
}

export async function getCollection(
  handle: string,
  first = 24,
  opts: { sortKey?: string; reverse?: boolean; filters?: Record<string, unknown>[] } = {},
) {
  const { data } = await shopifyFetch<{
    collection:
      | (Omit<Product, "variants" | "images" | "options" | "priceRange" | "tags" | "availableForSale"> & {
          products: { edges: { node: RawProduct }[]; filters: ProductFacet[] };
        })
      | null;
  }>({
    query: GET_COLLECTION,
    variables: { handle, first, sortKey: opts.sortKey, reverse: opts.reverse, filters: opts.filters },
    tags: [`collection:${handle}`],
  });
  if (!data.collection) return null;
  return {
    ...data.collection,
    products: data.collection.products.edges.map((e) => normalizeProduct(e.node)!).filter(Boolean),
    facets: data.collection.products.filters ?? [],
  };
}

export async function listCollectionHandles(first = 250): Promise<string[]> {
  const { data } = await shopifyFetch<{ collections: { edges: { node: { handle: string } }[] } }>({
    query: LIST_COLLECTION_HANDLES,
    variables: { first },
    tags: ["collections"],
  });
  return data.collections.edges.map((e) => e.node.handle);
}
