import { NextRequest } from "next/server";
import { getBlogPostBySlug } from "@/lib/builder/client";
import { createBlogMarkdown } from "@/lib/blog/markdown";

export const revalidate = 5;

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) return new Response("Not found\n", { status: 404 });

  const result = await getBlogPostBySlug(slug).catch(() => null);
  if (!result) return new Response("Not found\n", { status: 404 });

  const origin = process.env.APP_ORIGIN ?? request.nextUrl.origin;
  const markdown = createBlogMarkdown(result.post, result.content?.data?.blocks, origin);
  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Link": `<${result.post.canonicalUrl ?? `${origin}/blog/${result.post.slug}`}>; rel=\"canonical\"`,
      "X-Robots-Tag": "noindex, follow",
    },
  });
}
