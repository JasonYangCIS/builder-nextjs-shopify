import { describe, expect, it } from "vitest";
import { createBlogMarkdown } from "./markdown";
import type { BlogPost } from "@/types/blog.types";

const post: BlogPost = {
  id: "post-1",
  slug: "field-notes",
  title: "Field Notes",
  excerpt: "A concise report.",
  seoTitle: null,
  seoDescription: null,
  canonicalUrl: "https://example.com/blog/field-notes",
  focusKeyword: null,
  noIndex: false,
  featured: false,
  featuredImage: null,
  author: null,
  categories: [{ id: "category-1", name: "Research", slug: "research", description: null }],
  tags: ["Evidence"],
  citations: [{ id: "source-1", title: "Primary source", url: "https://source.example/report", publisher: "Source Lab", accessedAt: null }],
  assetRights: [],
  relatedPostIds: [],
  cta: { heading: "Read the record", body: "Use the current source.", actionLabel: "Open source", actionHref: "https://source.example/report" },
  publishedAt: "2026-01-02T00:00:00.000Z",
  updatedAt: "2026-01-03T00:00:00.000Z",
  readingTimeMinutes: 4,
  wordCount: 12,
  faqs: [],
};

describe("createBlogMarkdown", () => {
  it("serializes visible editorial blocks and safe metadata", () => {
    const markdown = createBlogMarkdown(post, [
      { component: { name: "BlogRichText", options: { html: "<h2>Evidence</h2><p>Read the <a href=\"https://source.example/report\">record</a>.</p>" } } },
      { component: { name: "BlogTable", options: { columns: [{ key: "signal", header: "Signal" }], rows: [{ signal: "Verified" }] } } },
      { component: { name: "BlogImageCaption", options: { src: "javascript:alert(1)", alt: "Unsafe" } } },
    ], "https://example.com");

    expect(markdown).toContain('canonical: "https://example.com/blog/field-notes"');
    expect(markdown).toContain("# Field Notes");
    expect(markdown).toContain("## Evidence");
    expect(markdown).toContain("[record](https://source.example/report)");
    expect(markdown).toContain("| Signal |\n| --- |\n| Verified |");
    expect(markdown).toContain("## Sources");
    expect(markdown).toContain("## Read the record");
    expect(markdown).not.toContain("javascript:");
  });
});
