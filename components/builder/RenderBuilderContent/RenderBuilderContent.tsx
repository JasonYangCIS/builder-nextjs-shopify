"use client";
import { Content, isPreviewing } from "@builder.io/sdk-react";
import { SWRConfig } from "swr";
import { config } from "@/config";
import { customComponents } from "@/builder-registry";
import type { RenderBuilderContentProps } from "./RenderBuilderContent.types";

/**
 * Client wrapper around the Builder SDK. Use this in every page that renders
 * Builder content. Never use `<Content>` directly elsewhere.
 *
 * When `fallback` is supplied, the Builder tree is wrapped in an `<SWRConfig>`
 * so data-driven client components (e.g. ProductGridSelected) render from
 * server-prefetched data — SSR/SSG with no client fetch in production.
 */
export default function RenderBuilderContent({ content, model, fallback }: RenderBuilderContentProps) {
  if (!content && !isPreviewing()) return null;
  const rendered = (
    <Content
      content={content ?? undefined}
      apiKey={config.apiKey}
      model={model}
      customComponents={customComponents}
    />
  );
  if (!fallback) return rendered;
  return <SWRConfig value={{ fallback }}>{rendered}</SWRConfig>;
}

export type { RenderBuilderContentProps } from "./RenderBuilderContent.types";
