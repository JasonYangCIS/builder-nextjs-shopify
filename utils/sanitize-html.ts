import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = [
  "a", "b", "blockquote", "br", "code", "div", "em", "h1", "h2", "h3", "h4", "h5", "h6",
  "hr", "i", "img", "li", "ol", "p", "pre", "small", "span", "strong", "sub", "sup", "u", "ul",
];

const ALLOWED_ATTR = ["href", "target", "rel", "src", "alt", "title", "class", "id", "loading"];

/** Sanitize untrusted HTML strings (e.g., Builder.io rich-text fields). */
export function sanitizeHtml(dirty: string | null | undefined): string {
  if (!dirty) return "";
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    FORBID_ATTR: ["style", "onerror", "onclick"],
  });
}
