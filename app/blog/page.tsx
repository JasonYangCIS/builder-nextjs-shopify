import type { Metadata } from "next";
import BlogListingView from "@/components/blog/BlogListingView/BlogListingView";
import { listBlogCategories, listPublishedBlogPosts } from "@/lib/builder/client";
import { normalizeBlogFilters } from "@/lib/blog/urls";

export const revalidate = 5;

type BlogSearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined): string | null {
  return Array.isArray(value) ? value[0] ?? null : value ?? null;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: BlogSearchParams;
}): Promise<Metadata> {
  const query = await searchParams;
  const filters = normalizeBlogFilters({
    category: first(query.category),
    tag: first(query.tag),
    page: first(query.page) ? Number(first(query.page)) : 1,
  });
  const filtered = Boolean(filters.category || filters.tag || filters.page > 1);
  const title = filtered ? "Filtered articles" : "Blog";
  const description = "Field notes, product stories, and ideas from Builder Shop.";
  return {
    title,
    description,
    alternates: { canonical: "/blog" },
    robots: filtered ? { index: false, follow: true } : undefined,
    openGraph: { title, description, type: "website", url: "/blog" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function BlogPage({ searchParams }: { searchParams: BlogSearchParams }) {
  const query = await searchParams;
  const filters = normalizeBlogFilters({
    category: first(query.category),
    tag: first(query.tag),
    page: first(query.page) ? Number(first(query.page)) : 1,
  });
  const [listing, categories] = await Promise.all([
    listPublishedBlogPosts(filters).catch(() => ({
      posts: [], page: 1, pageSize: filters.pageSize, total: 0, totalPages: 1,
      hasPreviousPage: false, hasNextPage: false,
    })),
    listBlogCategories().catch(() => []),
  ]);

  return (
    <BlogListingView
      listing={listing}
      categories={categories}
      pathname="/blog"
      activeCategory={filters.category}
      activeTag={filters.tag}
      heading="Builder Shop Blog"
      description="Field notes, product stories, and ideas from beyond the storefront."
    />
  );
}
