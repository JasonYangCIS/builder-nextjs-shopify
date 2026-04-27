import { getBuilderSearchParams, fetchOneEntry } from "@builder.io/sdk-react";
import RenderBuilderContent from "@/components/builder/RenderBuilderContent/RenderBuilderContent";
import { config } from "@/config";

interface SP { [key: string]: string | string[] | undefined }

export default async function PreviewPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const builderParams = getBuilderSearchParams(sp as any);
  const requested = sp["model"];
  const allowed = Object.values(config.models) as string[];
  const model =
    typeof requested === "string" && allowed.includes(requested)
      ? requested
      : config.models.page;
  const urlPath = typeof sp["urlPath"] === "string" ? sp["urlPath"] : "/";
  const content = await fetchOneEntry({
    model,
    apiKey: config.apiKey,
    userAttributes: { urlPath },
    options: builderParams,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <RenderBuilderContent content={content} model={model as any} />;
}
