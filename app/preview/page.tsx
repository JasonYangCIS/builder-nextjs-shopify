import type { Metadata } from "next";
import { getBuilderSearchParams, fetchOneEntry } from "@builder.io/sdk-react";
import RenderBuilderContent from "@/components/builder/RenderBuilderContent/RenderBuilderContent";
import PreviewBlogArticleHeader from "@/components/blog/PreviewBlogArticleHeader/PreviewBlogArticleHeader";
import ProductDetail from "@/components/shopify/ProductDetail/ProductDetail";
import { prefetchBuilderFallback } from "@/components/builder/prefetchBuilderFallback";
import { getProductByHandle } from "@/lib/shopify/product";
import { config } from "@/config";

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
    return (
      <article data-slot="blog-article">
        <PreviewBlogArticleHeader
          initialContent={content}
          model={config.models.blogPost}
          apiKey={config.apiKey}
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
  if (model === config.models.product) {
    const handle = urlPath.replace(/^\/products\//, "").replace(/\/$/, "");
    const product = handle ? await getProductByHandle(handle) : null;
    const fallback = await prefetchBuilderFallback(content);
    return (
      <>
        {product ? <ProductDetail product={product} /> : null}
        <section aria-label="Additional product content">
          <RenderBuilderContent
            content={content}
            model={config.models.product}
            fallback={fallback}
            disableTracking
          />
        </section>
      </>
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <RenderBuilderContent content={content} model={model as any} disableTracking />;
}
