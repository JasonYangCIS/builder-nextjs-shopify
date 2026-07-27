"use client";
import { Content } from "@builder.io/sdk-react";
import { SWRConfig } from "swr";
import { useHasHydrated, useIsPreviewing } from "@/lib/builder/useIsPreviewing";
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
export default function RenderBuilderContent({
  content,
  model,
  fallback,
  disableTracking = false,
  isNestedRender = false,
  isNestedRenderOnServer = false,
}: RenderBuilderContentProps) {
  const hasHydrated = useHasHydrated();
  const previewing = useIsPreviewing();
  if (!content && !previewing) return null;
  const rendered = (
    <Content
      key={isNestedRender || (isNestedRenderOnServer && !hasHydrated) ? "nested" : "top-level"}
      content={content ?? undefined}
      apiKey={config.apiKey}
      model={model}
      customComponents={customComponents}
      canTrack={!disableTracking && !previewing}
      isNestedRender={isNestedRender || (isNestedRenderOnServer && !hasHydrated)}
    />
  );
  if (!fallback) return rendered;
  return <SWRConfig value={{ fallback }}>{rendered}</SWRConfig>;
}

export type { RenderBuilderContentProps } from "./RenderBuilderContent.types";
