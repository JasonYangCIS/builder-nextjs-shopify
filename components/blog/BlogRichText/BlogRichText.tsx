import { BlogRichText as CoreBlogRichText } from "@jasonyangcis/core-ui";
import { sanitizeHtml } from "@/utils/sanitize-html";
import type { BlogRichTextProps } from "./BlogRichText.types";

export default function BlogRichText({ html, ...props }: BlogRichTextProps) {
  return <CoreBlogRichText {...props} html={sanitizeHtml(html)} />;
}

export type { BlogRichTextProps } from "./BlogRichText.types";
