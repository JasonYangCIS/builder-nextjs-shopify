import { BlogRichText as CoreBlogRichText } from "@jasonyangcis/core-ui";
import { sanitizeBlogHtml } from "@/utils/sanitize-html";
import type { BlogRichTextProps } from "./BlogRichText.types";

export default function BlogRichText({ html, ...props }: BlogRichTextProps) {
  return <CoreBlogRichText {...props} html={sanitizeBlogHtml(html)} />;
}

export type { BlogRichTextProps } from "./BlogRichText.types";
