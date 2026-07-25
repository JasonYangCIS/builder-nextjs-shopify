import { describe, expect, it } from "vitest";
import {
  createBlogJsonLd,
  createBlogListingJsonLd,
  serializeJsonLd,
} from "@/lib/blog/json-ld";
import type { BlogListing, BlogPost } from "@/types/blog.types";

const post: BlogPost = {
  id: "post-1",
  slug: "safe-post",
  title: "Safe <title>",
  excerpt: "Excerpt",
  seoTitle: null,
  seoDescription: null,
  canonicalUrl: null,
  focusKeyword: "safe publishing",
  noIndex: false,
  qualityGateStatus: null,
  featured: false,
  featuredImage: {
    url: "https://example.com/image.jpg",
    alt: "Article hero",
    width: 1200,
    height: 675,
  },
  author: {
    id: "author-1",
    name: "Builder Editorial Team",
    slug: "builder-editorial-team",
    schemaType: "Organization",
    bio: "Editorial team bio",
    avatar: null,
    profileUrl: "https://example.com/about",
  },
  categories: [{ id: "category-1", name: "Guides", slug: "guides", description: null }],
  tags: ["SEO"],
  citations: [{
    id: "source-1",
    title: "Primary source",
    url: "https://example.com/source",
    publisher: "Example Publisher",
    accessedAt: "2025-01-02T00:00:00Z",
  }],
  relatedPostIds: [],
  cta: null,
  publishedAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-03T00:00:00Z",
  readingTimeMinutes: 7,
  wordCount: 1200,
  faqs: [{ question: "Is this visible?", answer: "Yes, it appears in the article." }],
};

describe("blog JSON-LD", () => {
  it("builds comprehensive article, breadcrumb, and visible FAQ graphs", () => {
    const graph = createBlogJsonLd({ origin: "https://example.com", post });

    expect(graph[0]).toMatchObject({
      "@type": "BlogPosting",
      "@id": "https://example.com/blog/safe-post#article",
      url: "https://example.com/blog/safe-post",
      publisher: { "@id": "https://example.com/#organization" },
      wordCount: 1200,
      timeRequired: "PT7M",
      author: {
        "@type": "Organization",
        url: "https://example.com/about",
      },
      image: {
        "@type": "ImageObject",
        width: 1200,
        height: 675,
      },
      citation: [{
        "@type": "CreativeWork",
        name: "Primary source",
        url: "https://example.com/source",
      }],
    });
    expect(graph[1]).toMatchObject({
      "@type": "BreadcrumbList",
      itemListElement: [
        { position: 1, name: "Home" },
        { position: 2, name: "Blog" },
        { position: 3, name: "Guides" },
        { position: 4, name: "Safe <title>" },
      ],
    });
    expect(graph[2]).toMatchObject({
      "@type": "FAQPage",
      mainEntity: [{
        "@type": "Question",
        name: "Is this visible?",
        acceptedAnswer: { "@type": "Answer", text: "Yes, it appears in the article." },
      }],
    });

    const serialized = serializeJsonLd(graph);
    expect(serialized).toContain("\\u003ctitle>");
    expect(serialized).not.toContain("<title>");
  });

  it("builds a paginated collection and ordered article list", () => {
    const listing: BlogListing = {
      posts: [post],
      page: 2,
      pageSize: 12,
      total: 20,
      totalPages: 2,
      hasPreviousPage: true,
      hasNextPage: false,
    };
    const graph = createBlogListingJsonLd({
      origin: "https://example.com",
      pathname: "/blog/category/guides",
      title: "Guides",
      description: "Guide articles",
      listing,
      category: post.categories[0],
    });

    expect(graph[0]).toMatchObject({
      "@type": "CollectionPage",
      url: "https://example.com/blog/category/guides",
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: 20,
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        itemListElement: [{
          position: 13,
          item: { "@type": "BlogPosting", headline: "Safe <title>" },
        }],
      },
    });
    expect(graph[1]).toMatchObject({
      "@type": "BreadcrumbList",
      itemListElement: [
        { position: 1, name: "Home" },
        { position: 2, name: "Blog" },
        { position: 3, name: "Guides" },
      ],
    });
  });
});
