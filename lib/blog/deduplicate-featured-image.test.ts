import type { BuilderContent } from "@builder.io/sdk-react";
import { describe, expect, it } from "vitest";
import { removeDuplicateFeaturedImageBlocks } from "./deduplicate-featured-image";

const featuredImage = "https://cdn.builder.io/api/v1/image/assets%2Fspace%2Fasset";

describe("removeDuplicateFeaturedImageBlocks", () => {
  it("removes only body image blocks that match the featured image", () => {
    const content = {
      data: {
        blocks: [
          { component: { name: "BlogRichText", options: { html: "<p>Opening signal.</p>" } } },
          { component: { name: "BlogImageCaption", options: { src: `${featuredImage}?width=800`, alt: "Duplicate" } } },
          { component: { name: "BlogImageCaption", options: { src: "https://cdn.builder.io/api/v1/image/assets%2Fspace%2Fother", alt: "Distinct" } } },
        ],
      },
    } as unknown as BuilderContent;

    const result = removeDuplicateFeaturedImageBlocks(content, featuredImage);
    expect(result?.data?.blocks).toEqual([
      { component: { name: "BlogRichText", options: { html: "<p>Opening signal.</p>" } } },
      { component: { name: "BlogImageCaption", options: { src: "https://cdn.builder.io/api/v1/image/assets%2Fspace%2Fother", alt: "Distinct" } } },
    ]);
  });

  it("preserves content when there is no featured image", () => {
    const content = { data: { blocks: [{ component: { name: "BlogImageCaption", options: { src: featuredImage } } }] } } as unknown as BuilderContent;
    expect(removeDuplicateFeaturedImageBlocks(content, null)).toBe(content);
  });
});
