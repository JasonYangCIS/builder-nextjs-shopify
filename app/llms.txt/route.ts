import { listPublishedBlogPosts } from "@/lib/builder/client";

export const revalidate = 300;

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
    "## Blog posts",
    "",
    ...posts.map((post) => {
      const canonical = post.canonicalUrl ?? `${origin}/blog/${post.slug}`;
      const description = post.excerpt ? ` — ${post.excerpt}` : "";
      return `- [${post.title} (Markdown)](${origin}/blog/${post.slug}.md): Canonical HTML: ${canonical}.${description}`;
    }),
    "",
    "## Usage",
    "",
    "Use canonical HTML pages for citations and user-facing links. Markdown routes provide a compact, structured representation of the same published article; check the canonical page for current availability, product details, and source context.",
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
