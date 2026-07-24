import {
  BlogCard,
  BlogFilters,
  BlogGrid,
  BlogPagination,
} from "@jasonyangcis/core-ui";
import BlogAnalyticsBoundary from "@/components/blog/BlogAnalyticsBoundary/BlogAnalyticsBoundary";
import { blogListingHref } from "@/lib/blog/urls";
import type { BlogPost } from "@/types/blog.types";
import type { BlogListingViewProps } from "./BlogListingView.types";

function formatPublishedAt(value: string | null): string | null {
  if (!value) return null;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

function PostCard({ post }: { post: BlogPost }) {
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

export default function BlogListingView({
  listing,
  categories,
  pathname,
  activeCategory,
  activeTag,
  heading,
  description,
}: BlogListingViewProps) {
  const featured = listing.page === 1 ? listing.posts.find((post) => post.featured) ?? null : null;
  const recent = featured ? listing.posts.filter((post) => post.id !== featured.id) : listing.posts;
  const tags = Array.from(new Set(listing.posts.flatMap((post) => post.tags))).sort();
  const previousHref = listing.hasPreviousPage
    ? blogListingHref(pathname, { category: activeCategory, tag: activeTag, page: listing.page - 1 })
    : null;
  const nextHref = listing.hasNextPage
    ? blogListingHref(pathname, { category: activeCategory, tag: activeTag, page: listing.page + 1 })
    : null;

  return (
    <BlogAnalyticsBoundary>
      <header data-slot="blog-listing-header">
        <p data-slot="blog-listing-eyebrow">Dispatches</p>
        <h1>{heading}</h1>
        {description ? <p>{description}</p> : null}
      </header>

      {categories.length > 0 ? (
        <BlogFilters
          data-blog-analytics="filters"
          ariaLabel="Filter articles by category"
          activeValue={activeCategory ?? "all"}
          items={[
            { label: "All", value: "all", href: blogListingHref(pathname, { tag: activeTag }) },
            ...categories.map((category) => ({
              label: category.name,
              value: category.slug,
              href: blogListingHref("/blog", { category: category.slug, tag: activeTag }),
            })),
          ]}
        />
      ) : null}

      {tags.length > 0 ? (
        <BlogFilters
          data-blog-analytics="filters"
          ariaLabel="Filter articles by tag"
          activeValue={activeTag}
          items={tags.map((tag) => ({
            label: `#${tag}`,
            value: tag.toLocaleLowerCase(),
            href: blogListingHref(pathname, { category: activeCategory, tag }),
          }))}
        />
      ) : null}

      {featured ? (
        <section data-slot="blog-featured" aria-labelledby="featured-article-heading">
          <h2 id="featured-article-heading">Featured</h2>
          <PostCard post={featured} />
        </section>
      ) : null}

      <section data-slot="blog-recent" aria-labelledby="recent-articles-heading">
        <h2 id="recent-articles-heading">{featured ? "Recent" : "Articles"}</h2>
        {recent.length > 0 ? (
          <BlogGrid ariaLabel="Blog articles">
            {recent.map((post) => <PostCard key={post.id} post={post} />)}
          </BlogGrid>
        ) : (
          <p data-slot="blog-empty-state">No published articles match these filters.</p>
        )}
      </section>

      <BlogPagination
        data-blog-analytics="pagination"
        currentPage={listing.page}
        totalPages={listing.totalPages}
        previousHref={previousHref}
        nextHref={nextHref}
      />
    </BlogAnalyticsBoundary>
  );
}

export type { BlogListingViewProps } from "./BlogListingView.types";
