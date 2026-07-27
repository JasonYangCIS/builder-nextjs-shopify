"use client";
import { Content, createRegisterComponentMessage } from "@builder.io/sdk-react";
import { useEffect } from "react";
import { SWRConfig } from "swr";
import { useIsPreviewing } from "@/lib/builder/useIsPreviewing";
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
}: RenderBuilderContentProps) {
  const previewing = useIsPreviewing();

  useEffect(() => {
    if (!isNestedRender || !previewing) return;

    customComponents.forEach(({ component: _component, ...componentInfo }) => {
      window.parent.postMessage(createRegisterComponentMessage(componentInfo), "*");
    });
  }, [isNestedRender, previewing]);

  if (!content && !previewing) return null;
  const rendered = (
    <Content
      content={content ?? undefined}
      apiKey={config.apiKey}
      model={model}
      customComponents={customComponents}
      canTrack={!disableTracking && !previewing}
      isNestedRender={isNestedRender}
    />
  );
  if (!fallback) return rendered;
  return <SWRConfig value={{ fallback }}>{rendered}</SWRConfig>;
}

export type { RenderBuilderContentProps } from "./RenderBuilderContent.types";
