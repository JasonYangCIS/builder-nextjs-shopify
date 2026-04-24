import "server-only";
import { shopifyFetch } from "./storefront-client";
import { GET_PRODUCT_BY_HANDLE, LIST_PRODUCTS, LIST_PRODUCT_HANDLES } from "./queries/product";
import { GET_COLLECTION, LIST_COLLECTION_HANDLES } from "./queries/collection";
import type { Product } from "./types";

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

export async function listProducts(opts: { first?: number; query?: string } = {}): Promise<Product[]> {
  const { first = 24, query } = opts;
  const { data } = await shopifyFetch<{ products: { edges: { node: RawProduct }[] } }>({
    query: LIST_PRODUCTS,
    variables: { first, query },
    tags: ["products"],
  });
  return data.products.edges.map((e) => normalizeProduct(e.node)!).filter(Boolean);
}

export async function listProductHandles(first = 250): Promise<string[]> {
  const { data } = await shopifyFetch<{ products: { edges: { node: { handle: string } }[] } }>({
    query: LIST_PRODUCT_HANDLES,
    variables: { first },
    tags: ["products"],
  });
  return data.products.edges.map((e) => e.node.handle);
}

export async function getCollection(handle: string, first = 24) {
  const { data } = await shopifyFetch<{
    collection:
      | (Omit<Product, "variants" | "images" | "options" | "priceRange" | "tags" | "availableForSale"> & {
          products: { edges: { node: RawProduct }[] };
        })
      | null;
  }>({
    query: GET_COLLECTION,
    variables: { handle, first },
    tags: [`collection:${handle}`],
  });
  if (!data.collection) return null;
  return {
    ...data.collection,
    products: data.collection.products.edges.map((e) => normalizeProduct(e.node)!).filter(Boolean),
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
