import "server-only";
import type { BuilderContent } from "@builder.io/sdk-react";
import { resolveProductGrid } from "@/lib/shopify/product";
import type { Product } from "@/lib/shopify/types";
import { productGridKey } from "./ProductGrid.shared";
import type { ProductGridProps } from "./ProductGrid.types";

const COMPONENT_NAME = "ProductGrid";

type ProductGridFallback = Record<string, { products: Product[] }>;

/**
 * Deep-walk a Builder content tree collecting the options of every `ProductGrid`
 * block. We scan generically for any node carrying `component.name === COMPONENT_NAME`
 * so nesting (columns, sections, children) is covered without coupling to
 * Builder's exact block schema.
 */
function collectGridOptions(node: unknown, out: ProductGridProps[]): void {
  if (Array.isArray(node)) {
    for (const child of node) collectGridOptions(child, out);
    return;
  }
  if (!node || typeof node !== "object") return;
  const obj = node as Record<string, unknown>;
  const component = obj.component as
    | { name?: string; options?: ProductGridProps }
    | undefined;
  if (component?.name === COMPONENT_NAME) {
    out.push(component.options ?? {});
  }
  for (const value of Object.values(obj)) collectGridOptions(value, out);
}

/**
 * Resolve every `ProductGrid` block in `content` server-side and return an SWR
 * fallback map keyed by each block's `/api/products` URL. Feed the result to
 * `<RenderBuilderContent fallback={...} />` so production renders the grids in
 * the server HTML (ISR/SSG) with no client fetch. In the Builder editor the
 * fallback is absent, so the grid stays client-rendered for real-time edits.
 */
export async function prefetchProductGrids(
  content: BuilderContent | null,
): Promise<ProductGridFallback> {
  if (!content) return {};
  const optionsList: ProductGridProps[] = [];
  collectGridOptions(content.data?.blocks ?? [], optionsList);

  const fallback: ProductGridFallback = {};
  await Promise.all(
    optionsList.map(async (options) => {
      const key = productGridKey(options);
      if (fallback[key]) return; // skip duplicate grids with identical queries
      fallback[key] = { products: await resolveProductGrid(options) };
    }),
  );
  return fallback;
}
