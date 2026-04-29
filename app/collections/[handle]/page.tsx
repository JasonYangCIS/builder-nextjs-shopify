import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBuilderCollection, listBuilderCollectionHandles } from "@/lib/builder/client";
import RenderBuilderContent from "@/components/builder/RenderBuilderContent/RenderBuilderContent";
import { config } from "@/config";

export const revalidate = 5;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const handles = await listBuilderCollectionHandles(100);
    return handles.map((handle) => ({ handle }));
  } catch {
    return [];
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ handle: string }> },
): Promise<Metadata> {
  const { handle } = await params;
  const content = await getBuilderCollection(handle).catch(() => null);
  const data = content?.data as
    | { seoTitle?: string; seoDescription?: string; noIndex?: boolean; title?: string }
    | undefined;
  if (!data) return {};
  return {
    title: data.seoTitle ?? data.title ?? handle,
    description: data.seoDescription,
    alternates: { canonical: `/collections/${handle}` },
    robots: data.noIndex ? { index: false, follow: false } : undefined,
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const content = await getBuilderCollection(handle);
  if (!content) notFound();
  return <RenderBuilderContent content={content} model={config.models.collection} />;
}
