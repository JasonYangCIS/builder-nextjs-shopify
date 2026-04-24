"use client";
import { Content, isPreviewing } from "@builder.io/sdk-react";
import { config } from "@/config";
import { customComponents } from "@/builder-registry";
import type { RenderBuilderContentProps } from "./RenderBuilderContent.types";

/**
 * Client wrapper around the Builder SDK. Use this in every page that renders
 * Builder content. Never use `<Content>` directly elsewhere.
 */
export default function RenderBuilderContent({ content, model }: RenderBuilderContentProps) {
  if (!content && !isPreviewing()) return null;
  return (
    <Content
      content={content ?? undefined}
      apiKey={config.apiKey}
      model={model}
      customComponents={customComponents}
    />
  );
}

export type { RenderBuilderContentProps } from "./RenderBuilderContent.types";
