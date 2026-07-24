import type { BlogPost } from "@/types/blog.types";

interface BlogJsonLdOptions {
  origin: string;
  post: BlogPost;
}

export function createBlogJsonLd({ origin, post }: BlogJsonLdOptions) {
  const articleUrl = new URL(`/blog/${encodeURIComponent(post.slug)}`, origin).toString();
  const article = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDescription ?? post.excerpt ?? undefined,
    url: articleUrl,
    mainEntityOfPage: articleUrl,
    datePublished: post.publishedAt ?? undefined,
    dateModified: post.updatedAt ?? post.publishedAt ?? undefined,
    image: post.featuredImage?.url ? [post.featuredImage.url] : undefined,
    author: post.author ? { "@type": "Person", name: post.author.name } : undefined,
    articleSection: post.categories.map((category) => category.name),
    keywords: post.tags.length ? post.tags.join(", ") : undefined,
  };
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: new URL("/", origin).toString() },
      { "@type": "ListItem", position: 2, name: "Blog", item: new URL("/blog", origin).toString() },
      { "@type": "ListItem", position: 3, name: post.title, item: articleUrl },
    ],
  };
  return [article, breadcrumbs];
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}
