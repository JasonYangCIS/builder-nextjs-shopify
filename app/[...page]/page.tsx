import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBuilderPage } from "@/lib/builder/client";
import RenderBuilderContent from "@/components/builder/RenderBuilderContent/RenderBuilderContent";
import { config } from "@/config";

export const revalidate = 5;

interface PageParams {
  page: string[];
}

function pathFromParams(params: PageParams): string {
  return "/" + (params.page?.join("/") ?? "");
}

export async function generateMetadata(
  { params }: { params: Promise<PageParams> },
): Promise<Metadata> {
  const p = await params;
  const content = await getBuilderPage(pathFromParams(p));
  const data = content?.data as { seoTitle?: string; seoDescription?: string; noIndex?: boolean } | undefined;
  return {
    title: data?.seoTitle ?? p.page.join(" / "),
    description: data?.seoDescription,
    robots: data?.noIndex ? { index: false, follow: false } : undefined,
  };
}

export default async function CatchAllPage({ params }: { params: Promise<PageParams> }) {
  const p = await params;
  const path = pathFromParams(p);
  const content = await getBuilderPage(path);
  if (!content) notFound();
  return <RenderBuilderContent content={content} model={config.models.page} />;
}
