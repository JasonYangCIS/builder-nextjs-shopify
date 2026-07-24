import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import BlogRichText from "@/components/blog/BlogRichText/BlogRichText";

describe("BlogRichText", () => {
  it("preserves the Core UI slot while sanitizing Builder HTML", () => {
    const markup = renderToStaticMarkup(createElement(BlogRichText, {
      html: '<p>Hello</p><script>alert(1)</script><a href="javascript:alert(2)">bad</a>',
    }));
    expect(markup).toContain('data-slot="blog-rich-text"');
    expect(markup).toContain("<p>Hello</p>");
    expect(markup).not.toContain("<script");
    expect(markup).not.toContain("javascript:");
  });
});
