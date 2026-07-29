"use client";

import { useEffect, type MouseEvent } from "react";
import { BLOG_EVENT_NAMES, emitBlogEvent } from "@/lib/blog/analytics";
import type { BlogAnalyticsBoundaryProps } from "./BlogAnalyticsBoundary.types";

export default function BlogAnalyticsBoundary({ children, postId }: BlogAnalyticsBoundaryProps) {
  useEffect(() => {
    if (postId) emitBlogEvent(BLOG_EVENT_NAMES.articleView, { postId });
  }, [postId]);

  function handleClick(event: MouseEvent<HTMLDivElement>) {
    const link = (event.target as Element).closest<HTMLAnchorElement>("a");
    if (!link) return;
    const scope = link.closest<HTMLElement>("[data-blog-analytics]")?.dataset.blogAnalytics;
    if (scope === "filters") {
      const url = new URL(link.href, window.location.origin);
      emitBlogEvent(BLOG_EVENT_NAMES.filter, {
        category: url.searchParams.get("category") ?? undefined,
        tag: url.searchParams.get("tag") ?? undefined,
      });
    } else if (scope === "pagination") {
      const url = new URL(link.href, window.location.origin);
      emitBlogEvent(BLOG_EVENT_NAMES.pagination, {
        page: Number.parseInt(url.searchParams.get("page") ?? "1", 10),
      });
    } else if (scope === "related") {
      const segments = new URL(link.href, window.location.origin).pathname.split("/").filter(Boolean);
      emitBlogEvent(BLOG_EVENT_NAMES.relatedClick, {
        postId,
        targetId: link.dataset.postId ?? segments.at(-1),
      });
    } else if (scope === "cta") {
      emitBlogEvent(BLOG_EVENT_NAMES.ctaClick, {
        postId,
        targetId: link.dataset.ctaId ?? "primary",
      });
    }
  }

  return <div data-slot="blog-analytics-boundary" onClick={handleClick}>{children}</div>;
}

export type { BlogAnalyticsBoundaryProps } from "./BlogAnalyticsBoundary.types";
