import { BlogCard, BlogGrid } from "@jasonyangcis/core-ui";
import { normalizeBlogPost } from "@/lib/blog/normalize";
import type { BlogPost } from "@/types/blog.types";
import type { FeaturedBlogsProps } from "./FeaturedBlogs.types";

function formatPublishedAt(value: string | null): string | null {
  if (!value) return null;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

function toPost(value: unknown): BlogPost | null {
  if (!value || typeof value !== "object") return null;
  const resolved = (value as { value?: unknown }).value ?? value;
  return normalizeBlogPost(resolved);
}

function FeaturedBlogCard({ post }: { post: BlogPost }) {
  return (
    <BlogCard
      title={post.title}
      href={`/blog/${post.slug}`}
      excerpt={post.excerpt}
      category={post.categories[0]?.name}
      imageSrc={post.featuredImage?.url}
      imageAlt={post.featuredImage?.alt}
      publishedAt={post.publishedAt}
      publishedLabel={formatPublishedAt(post.publishedAt)}
    />
  );
}

export default function FeaturedBlogs({
  heading,
  featuredBlog1,
  featuredBlog2,
  featuredBlog3,
}: FeaturedBlogsProps) {
  const posts = [featuredBlog1, featuredBlog2, featuredBlog3]
    .map(toPost)
    .filter((post): post is BlogPost => post !== null)
    .slice(0, 3);

  if (posts.length === 0) return null;

  const label = heading ?? "Featured";

  if (posts.length === 1) {
    return (
      <section data-slot="blog-featured" aria-label={label}>
        <h2>{label}</h2>
        <FeaturedBlogCard post={posts[0]} />
      </section>
    );
  }

  return (
    <section data-slot="blog-recent" aria-label={label}>
      <h2>{label}</h2>
      <BlogGrid ariaLabel={label}>
        {posts.map((post) => (
          <FeaturedBlogCard key={post.id} post={post} />
        ))}
      </BlogGrid>
    </section>
  );
}

export type { FeaturedBlogsProps } from "./FeaturedBlogs.types";
