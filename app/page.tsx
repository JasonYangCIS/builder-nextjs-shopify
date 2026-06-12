import type { Metadata } from "next";
import { getBuilderPage } from "@/lib/builder/client";
import RenderBuilderContent from "@/components/builder/RenderBuilderContent/RenderBuilderContent";
import { prefetchBuilderFallback } from "@/components/builder/prefetchBuilderFallback";
import { config } from "@/config";

export const revalidate = 5;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getBuilderPage("/");
  const data = content?.data as { seoTitle?: string; seoDescription?: string; noIndex?: boolean } | undefined;
  return {
    title: data?.seoTitle ?? "Home",
    description: data?.seoDescription,
    robots: data?.noIndex ? { index: false, follow: false } : undefined,
  };
}

export default async function HomePage() {
  const content = await getBuilderPage("/");
  const fallback = await prefetchBuilderFallback(content);
  return <RenderBuilderContent content={content} model={config.models.page} fallback={fallback} />;
}
