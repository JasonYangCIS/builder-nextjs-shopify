import sanitize from "sanitize-html";

const ALLOWED_TAGS = [
  "a", "b", "blockquote", "br", "code", "div", "em", "h1", "h2", "h3", "h4", "h5", "h6",
  "hr", "i", "img", "li", "ol", "p", "pre", "small", "span", "strong", "sub", "sup", "u", "ul",
];

const ALLOWED_ATTR_BY_TAG: Record<string, string[]> = {
  a: ["href", "target", "rel", "title", "class", "id"],
  img: ["src", "alt", "title", "class", "id", "loading"],
  "*": ["class", "id", "title"],
};

/** Sanitize untrusted HTML strings (e.g., Builder.io rich-text fields). */
export function sanitizeHtml(dirty: string | null | undefined): string {
  if (!dirty) return "";
  return sanitize(dirty, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTR_BY_TAG,
    allowedSchemes: ["http", "https", "mailto", "tel"],
    disallowedTagsMode: "discard",
  });
}
