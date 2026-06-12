import type { BuilderContent } from "@builder.io/sdk-react";
import type { BuilderModelName } from "@/config";

export interface RenderBuilderContentProps {
  content: BuilderContent | null;
  model: BuilderModelName;
  /**
   * SWR fallback map (key → resolved data) hydrated into an `<SWRConfig>` so
   * client components inside the Builder tree render from server-fetched data
   * with no client request. Used for SSR/SSG of data-driven blocks.
   */
  fallback?: Record<string, unknown>;
}
