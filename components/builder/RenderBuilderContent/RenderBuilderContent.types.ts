import type { BuilderContent } from "@builder.io/sdk-react";
import type { BuilderModelName } from "@/config";

export interface RenderBuilderContentProps {
  content: BuilderContent | null;
  model: BuilderModelName;
}
