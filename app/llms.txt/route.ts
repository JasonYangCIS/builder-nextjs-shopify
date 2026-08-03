import { listPublishedBlogPosts } from "@/lib/builder/client";

export const revalidate = 300;

function markdownText(value: string): string {
  return value.replace(/[\r\n]+/g, " ").replace(/([\\[\]])/g, "\\$1").trim();
}

export async function GET(request: Request) {
  const origin = process.env.APP_ORIGIN ?? new URL(request.url).origin;
  const listing = await listPublishedBlogPosts({ pageSize: 100 }).catch(() => null);
  const posts = listing?.posts.filter((post) => !post.noIndex) ?? [];
  const lines = [
    "# Builder Shop",
    "",
    "> Official storefront and source-backed editorial dispatches from Builder Shop.",
    "",
    "## Primary resources",
    "",
    `- [Homepage](${origin}/): Storefront overview.`,
    `- [Blog](${origin}/blog): Editorial dispatch index.`,
    `- [Sitemap](${origin}/sitemap.xml): Full public URL inventory.`,
    "",
    "## For agents",
    "",
    "Every `/blog/<slug>` article also resolves as plain Markdown at `/blog/<slug>.md` — same content, no HTML markup. Append `.md` to any blog URL below (or any blog URL you discover elsewhere on this site) to fetch that version instead of parsing HTML.",
    "",
    "## Blog posts",
    "",
    ...posts.map((post) => {
      const canonical = post.canonicalUrl ?? `${origin}/blog/${post.slug}`;
      const description = post.excerpt ? ` — ${markdownText(post.excerpt)}` : "";
      return `- [${markdownText(post.title)}](${canonical}).${description}`;
    }),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
