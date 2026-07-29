import { describe, expect, it } from "vitest";
import { blogListingHref, normalizeBlogFilters, paginate } from "@/lib/blog/urls";

describe("blog URL helpers", () => {
  it("normalizes filters and creates stable query strings", () => {
    expect(normalizeBlogFilters({ category: " Field-Notes ", tag: "bad tag", page: -2 })).toMatchObject({
      category: "field-notes",
      tag: null,
      page: 1,
    });
    expect(blogListingHref("/blog", { category: "news", tag: "release", page: 2 }))
      .toBe("/blog?category=news&tag=release&page=2");
  });

  it("clamps pagination and reports navigation", () => {
    expect(paginate([1, 2, 3, 4, 5], 99, 2)).toEqual({
      items: [5],
      page: 3,
      pageSize: 2,
      total: 5,
      totalPages: 3,
      hasPreviousPage: true,
      hasNextPage: false,
    });
  });
});
