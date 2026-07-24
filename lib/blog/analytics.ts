export const BLOG_EVENT_NAMES = {
  articleView: "blog:article-view",
  filter: "blog:filter",
  pagination: "blog:pagination",
  relatedClick: "blog:related-click",
  ctaClick: "blog:cta-click",
} as const;

export type BlogEventName = (typeof BLOG_EVENT_NAMES)[keyof typeof BLOG_EVENT_NAMES];

export interface BlogEventDetail {
  postId?: string;
  category?: string;
  tag?: string;
  page?: number;
  targetId?: string;
}

const SAFE_ID = /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,127}$/;

export function createBlogEventDetail(detail: BlogEventDetail): BlogEventDetail {
  const normalized: BlogEventDetail = {};
  if (detail.postId && SAFE_ID.test(detail.postId)) normalized.postId = detail.postId;
  if (detail.category && SAFE_ID.test(detail.category)) normalized.category = detail.category;
  if (detail.tag && SAFE_ID.test(detail.tag)) normalized.tag = detail.tag;
  if (detail.targetId && SAFE_ID.test(detail.targetId)) normalized.targetId = detail.targetId;
  if (detail.page && Number.isSafeInteger(detail.page) && detail.page > 0) normalized.page = detail.page;
  return normalized;
}

export function emitBlogEvent(name: BlogEventName, detail: BlogEventDetail): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(name, { detail: createBlogEventDetail(detail) }));
}

declare global {
  interface WindowEventMap {
    "blog:article-view": CustomEvent<BlogEventDetail>;
    "blog:filter": CustomEvent<BlogEventDetail>;
    "blog:pagination": CustomEvent<BlogEventDetail>;
    "blog:related-click": CustomEvent<BlogEventDetail>;
    "blog:cta-click": CustomEvent<BlogEventDetail>;
  }
}
