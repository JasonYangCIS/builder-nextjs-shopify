import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogListingView from "@/components/blog/BlogListingView/BlogListingView";
import {
  getBlogCategoryBySlug,
  listBlogCategories,
  listBlogCategorySlugs,
  listPublishedBlogPosts,
} from "@/lib/builder/client";
import { normalizeBlogFilters } from "@/lib/blog/urls";

export const revalidate = 5;
export const dynamicParams = true;

type CategoryParams = Promise<{ slug: string }>;
type CategorySearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined): string | null {
  return Array.isArray(value) ? value[0] ?? null : value ?? null;
}

export async function generateStaticParams() {
  const slugs = await listBlogCategorySlugs().catch(() => []);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params, searchParams }: {
  params: CategoryParams;
  searchParams: CategorySearchParams;
}): Promise<Metadata> {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const category = await getBlogCategoryBySlug(slug).catch(() => null);
  if (!category) return {};
  const page = Number(first(query.page) ?? "1");
  const tag = first(query.tag);
  const title = `${category.name} articles`;
  const description = category.description ?? `Explore ${category.name} articles from Builder Shop.`;
  const canonical = `/blog/category/${category.slug}`;
  return {
    title,
    description,
    alternates: { canonical },
    robots: page > 1 || tag ? { index: false, follow: true } : undefined,
    openGraph: { title, description, type: "website", url: canonical },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function BlogCategoryPage({ params, searchParams }: {
  params: CategoryParams;
  searchParams: CategorySearchParams;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const filters = normalizeBlogFilters({
    category: slug,
    tag: first(query.tag),
    page: Number(first(query.page) ?? "1"),
  });
  const [category, categories, listing] = await Promise.all([
    getBlogCategoryBySlug(slug).catch(() => null),
    listBlogCategories().catch(() => []),
    listPublishedBlogPosts(filters).catch(() => ({
      posts: [], page: 1, pageSize: filters.pageSize, total: 0, totalPages: 1,
      hasPreviousPage: false, hasNextPage: false,
    })),
  ]);
  if (!category) notFound();

  return (
    <BlogListingView
      listing={listing}
      categories={categories}
      pathname={`/blog/category/${category.slug}`}
      activeCategory={category.slug}
      activeTag={filters.tag}
      heading={category.name}
      description={category.description}
    />
  );
}
