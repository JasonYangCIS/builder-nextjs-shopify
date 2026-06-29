import "server-only";
import { resolveProductsByHandles } from "@/lib/shopify/product";
import type { ComponentPrefetcher } from "@/lib/builder/prefetch";
import { extractSelectedHandles, selectedProductsKey } from "./ProductGridSelected.shared";
import type { ProductGridSelectedProps } from "./ProductGridSelected.types";

export const productGridSelectedPrefetcher: ComponentPrefetcher<ProductGridSelectedProps> = {
  componentName: "ProductGridSelected",
  getKey: (options) => selectedProductsKey(extractSelectedHandles(options.handles)),
  fetchData: async (options) => ({
    results: await resolveProductsByHandles(extractSelectedHandles(options.handles)),
  }),
};
