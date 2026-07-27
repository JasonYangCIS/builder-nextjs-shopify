"use client";

import { useEffect, useState } from "react";
import { subscribeToEditor } from "@builder.io/sdk-react";
import { BlogArticleHeader } from "@jasonyangcis/core-ui";
import { normalizeBlogPost } from "@/lib/blog/normalize";
import type { PreviewBlogArticleHeaderProps } from "./PreviewBlogArticleHeader.types";

export default function PreviewBlogArticleHeader({
  initialContent,
  model,
  apiKey,
}: PreviewBlogArticleHeaderProps) {
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    return subscribeToEditor({
      model,
      apiKey,
      callback: (updatedContent) => setContent(updatedContent),
    });
  }, [model, apiKey]);

  const post = normalizeBlogPost(content);
  if (!post) return null;

  return (
    <BlogArticleHeader
      title={post.title}
      eyebrow={post.categories[0]?.name ?? "Dispatch"}
      description={post.excerpt}
      readingTime={post.readingTimeMinutes ? `${post.readingTimeMinutes} min read` : null}
    />
  );
}

export type { PreviewBlogArticleHeaderProps } from "./PreviewBlogArticleHeader.types";
