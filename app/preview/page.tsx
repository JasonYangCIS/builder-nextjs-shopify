import { getBuilderSearchParams, fetchOneEntry } from "@builder.io/sdk-react";
import RenderBuilderContent from "@/components/builder/RenderBuilderContent/RenderBuilderContent";
import { config } from "@/config";

interface SP { [key: string]: string | string[] | undefined }

export default async function PreviewPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const builderParams = getBuilderSearchParams(sp as any);
  const model = (sp["model"] as string | undefined) ?? config.models.page;
  const content = await fetchOneEntry({
    model,
    apiKey: config.apiKey,
    options: builderParams,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <RenderBuilderContent content={content} model={model as any} />;
}
