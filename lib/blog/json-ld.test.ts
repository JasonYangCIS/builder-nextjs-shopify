import { describe, expect, it } from "vitest";
import { createBlogJsonLd, serializeJsonLd } from "@/lib/blog/json-ld";
import type { BlogPost } from "@/types/blog.types";

const post: BlogPost = {
  id: "post-1", slug: "safe-post", title: "Safe <title>", excerpt: "Excerpt",
  seoTitle: null, seoDescription: null, canonicalUrl: null, noIndex: false, featured: false,
  featuredImage: null, author: null, categories: [], tags: [], citations: [], assetRights: [],
  relatedPostIds: [], cta: null, publishedAt: "2025-01-01T00:00:00Z",
  updatedAt: null, readingTimeMinutes: null,
};

describe("blog JSON-LD", () => {
  it("builds article and breadcrumb graphs and escapes script-breaking characters", () => {
    const graph = createBlogJsonLd({ origin: "https://example.com", post });
    expect(graph[0]).toMatchObject({ "@type": "BlogPosting", url: "https://example.com/blog/safe-post" });
    const serialized = serializeJsonLd(graph);
    expect(serialized).toContain("\\u003ctitle>");
    expect(serialized).not.toContain("<title>");
  });
});
