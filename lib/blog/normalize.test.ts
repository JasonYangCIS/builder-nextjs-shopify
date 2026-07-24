import { describe, expect, it } from "vitest";
import { normalizeBlogCategory, normalizeBlogPost } from "@/lib/blog/normalize";

describe("normalizeBlogPost", () => {
  it("normalizes nullable Builder data and reference maps", () => {
    const category = normalizeBlogCategory({ id: "cat-1", data: { name: "Field Notes", slug: "field-notes" } });
    expect(category).not.toBeNull();
    const post = normalizeBlogPost(
      {
        id: "post-1",
        lastUpdated: "2025-01-03T00:00:00Z",
        data: {
          slug: "first-contact",
          title: "First Contact",
          author: null,
          categories: [{ category: { id: "cat-1" } }],
          tags: [{ tag: "News" }, null, "News"],
          citations: [{ title: "Primary source", url: "https://example.com/source" }],
          featuredImage: { url: "https://example.com/image.jpg", alt: null },
          focusKeyword: "first contact",
          blocks: [{
            component: {
              name: "BlogRichText",
              options: {
                html: "<p>Visible article introduction.</p><h2>Frequently asked questions</h2><h3>What is first contact?</h3><p>A visible answer.</p>",
              },
            },
          }],
        },
      },
      { categories: new Map(category ? [[category.id, category]] : []) },
    );

    expect(post).toMatchObject({
      id: "post-1",
      slug: "first-contact",
      author: null,
      tags: ["News"],
      categories: [{ slug: "field-notes" }],
      updatedAt: "2025-01-03T00:00:00Z",
      focusKeyword: "first contact",
      faqs: [{ question: "What is first contact?", answer: "A visible answer." }],
    });
    expect(post?.wordCount).toBe(13);
    expect(post?.citations[0]?.url).toBe("https://example.com/source");
  });

  it("fails closed for missing required slug/title and unsafe URLs", () => {
    expect(normalizeBlogPost({ data: { title: "Missing slug" } })).toBeNull();
    const post = normalizeBlogPost({
      data: {
        title: "Safe",
        slug: "safe",
        citations: [{ title: "Bad", url: "javascript:alert(1)" }],
        cta: { heading: "Go", actionLabel: "Click", actionHref: "javascript:alert(1)" },
      },
    });
    expect(post?.citations[0]?.url).toBeNull();
    expect(post?.cta?.actionHref).toBeNull();
  });
});
