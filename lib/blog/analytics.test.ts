import { describe, expect, it } from "vitest";
import { createBlogEventDetail } from "@/lib/blog/analytics";

describe("createBlogEventDetail", () => {
  it("keeps only non-sensitive allowlisted identifiers", () => {
    expect(createBlogEventDetail({
      postId: "post_123",
      category: "field-notes",
      tag: "tag with spaces",
      page: 2,
      targetId: "related-2",
    })).toEqual({
      postId: "post_123",
      category: "field-notes",
      page: 2,
      targetId: "related-2",
    });
  });
});
