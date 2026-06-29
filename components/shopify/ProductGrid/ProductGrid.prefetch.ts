import "server-only";
import { resolveProductGrid } from "@/lib/shopify/product";
import type { ComponentPrefetcher } from "@/lib/builder/prefetch";
import { productGridKey } from "./ProductGrid.shared";
import type { ProductGridProps } from "./ProductGrid.types";

export const productGridPrefetcher: ComponentPrefetcher<ProductGridProps> = {
  componentName: "ProductGrid",
  getKey: (options) => productGridKey(options),
  fetchData: async (options) => ({ products: await resolveProductGrid(options) }),
};
