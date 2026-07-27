import type { Metadata } from "next";
import { getBuilderSearchParams, fetchOneEntry } from "@builder.io/sdk-react";
import { BlogArticleHeader } from "@jasonyangcis/core-ui";
import RenderBuilderContent from "@/components/builder/RenderBuilderContent/RenderBuilderContent";
import { config } from "@/config";
import { normalizeBlogPost } from "@/lib/blog/normalize";

interface SP { [key: string]: string | string[] | undefined }

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

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
  if (model === config.models.blogPost) {
    const post = normalizeBlogPost(content);
    if (post) {
      return (
        <article data-slot="blog-article">
          <BlogArticleHeader
            title={post.title}
            eyebrow={post.categories[0]?.name ?? "Dispatch"}
            description={post.excerpt}
            readingTime={post.readingTimeMinutes ? `${post.readingTimeMinutes} min read` : null}
          />
          <section data-slot="blog-article-body" aria-label="Article content">
            <RenderBuilderContent
              content={content}
              model={config.models.blogPost}
              disableTracking
              isNestedRender
            />
          </section>
        </article>
      );
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <RenderBuilderContent content={content} model={model as any} disableTracking />;
}
