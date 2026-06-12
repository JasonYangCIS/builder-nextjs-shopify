import "server-only";
import type { BuilderContent } from "@builder.io/sdk-react";
import { resolveProductsByHandles } from "@/lib/shopify/product";
import type { SelectedProductResult } from "@/lib/shopify/types";
import { extractSelectedHandles, selectedProductsKey } from "./ProductGridSelected.shared";
import type { ProductGridSelectedProps } from "./ProductGridSelected.types";

const COMPONENT_NAME = "ProductGridSelected";

type SelectedProductsFallback = Record<string, { results: SelectedProductResult[] }>;

/**
 * Deep-walk a Builder content tree collecting the handle list of every
 * `ProductGridSelected` block. We scan generically for any node carrying
 * `component.name === COMPONENT_NAME` so nesting (columns, sections, children)
 * is covered without coupling to Builder's exact block schema.
 */
function collectHandleLists(node: unknown, out: string[][]): void {
  if (Array.isArray(node)) {
    for (const child of node) collectHandleLists(child, out);
    return;
  }
  if (!node || typeof node !== "object") return;
  const obj = node as Record<string, unknown>;
  const component = obj.component as
    | { name?: string; options?: ProductGridSelectedProps }
    | undefined;
  if (component?.name === COMPONENT_NAME) {
    out.push(extractSelectedHandles(component.options?.handles));
  }
  for (const value of Object.values(obj)) collectHandleLists(value, out);
}

/**
 * Resolve every `ProductGridSelected` block in `content` server-side and return
 * an SWR fallback map keyed by each block's `/api/products` URL. Feed the result
 * to `<RenderBuilderContent fallback={...} />` so production renders the grids in
 * the server HTML (ISR/SSG) with no client fetch. In the Builder editor the
 * fallback is absent, so the grid stays client-rendered for real-time edits.
 */
export async function prefetchSelectedProducts(
  content: BuilderContent | null,
): Promise<SelectedProductsFallback> {
  if (!content) return {};
  const handleLists: string[][] = [];
  collectHandleLists(content.data?.blocks ?? [], handleLists);

  const fallback: SelectedProductsFallback = {};
  await Promise.all(
    handleLists.map(async (rawHandles) => {
      const key = selectedProductsKey(rawHandles);
      if (!key || fallback[key]) return; // skip empties and duplicate grids
      fallback[key] = { results: await resolveProductsByHandles(rawHandles) };
    }),
  );
  return fallback;
}
