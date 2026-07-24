import "server-only";

import { fetchOneEntry, fetchEntries } from "@builder.io/sdk-react";
import { config, type BuilderModelName } from "@/config";
import {
  createReferenceMap,
  normalizeBlogAuthor,
  normalizeBlogCategory,
  normalizeBlogPost,
} from "@/lib/blog/normalize";
import { normalizeBlogFilters, paginate } from "@/lib/blog/urls";
import type {
  BlogAuthor,
  BlogCategory,
  BlogListFilters,
  BlogListing,
  BlogPost,
  BlogSlugRecord,
} from "@/types/blog.types";

const BLOG_LIST_PROJECTION = [
  "id",
  "lastUpdated",
  "publishedDate",
  "data.slug",
  "data.title",
  "data.excerpt",
  "data.seoTitle",
  "data.seoDescription",
  "data.canonicalUrl",
  "data.noIndex",
  "data.featured",
  "data.featuredImage",
  "data.featuredImageAlt",
  "data.author",
  "data.categories",
  "data.category",
  "data.tags",
  "data.publishedAt",
  "data.updatedAt",
  "data.readingTimeMinutes",
].join(",");

export async function getBuilderPage(urlPath: string) {
  return fetchOneEntry({
    model: config.models.page,
    apiKey: config.apiKey,
    userAttributes: { urlPath },
  });
}

export async function getBuilderEntry(model: BuilderModelName, query?: Record<string, unknown>) {
  return fetchOneEntry({
    model,
    apiKey: config.apiKey,
    query,
  });
}

export async function getBuilderProduct(handle: string) {
  return fetchOneEntry({
    model: config.models.product,
    apiKey: config.apiKey,
    userAttributes: { urlPath: `/products/${handle}`, handle },
    query: { "data.handle": handle },
  });
}

export async function getBuilderCollection(handle: string) {
  return fetchOneEntry({
    model: config.models.collection,
    apiKey: config.apiKey,
    userAttributes: { urlPath: `/collections/${handle}`, handle },
  });
}

export async function listBuilderEntries(model: BuilderModelName, limit = 100) {
  return fetchEntries({ model, apiKey: config.apiKey, limit });
}

export async function listBuilderCollectionHandles(limit = 100): Promise<string[]> {
  const entries = await fetchEntries({
    model: config.models.collection,
    apiKey: config.apiKey,
    limit,
    fields: "data.handle",
  });
  const handles = (entries ?? [])
    .map((entry) => (entry?.data as { handle?: string } | undefined)?.handle)
    .filter((handle): handle is string => typeof handle === "string" && handle.length > 0);
  return Array.from(new Set(handles));
}

async function listBlogAuthors(limit = 100): Promise<BlogAuthor[]> {
  const entries = await fetchEntries({
    model: config.models.blogAuthor,
    apiKey: config.apiKey,
    limit,
    fields: "id,data.name,data.title,data.slug,data.schemaType,data.bio,data.description,data.avatar,data.image,data.avatarAlt,data.profileUrl",
  });
  return (entries ?? []).map(normalizeBlogAuthor).filter((item): item is BlogAuthor => item !== null);
}

export async function listBlogCategories(limit = 100): Promise<BlogCategory[]> {
  const entries = await fetchEntries({
    model: config.models.blogCategory,
    apiKey: config.apiKey,
    limit,
    fields: "id,data.name,data.title,data.slug,data.description",
  });
  return (entries ?? []).map(normalizeBlogCategory).filter((item): item is BlogCategory => item !== null);
}

async function getBlogReferenceMaps() {
  const [authors, categories] = await Promise.all([
    listBlogAuthors().catch(() => []),
    listBlogCategories().catch(() => []),
  ]);
  return { authors: createReferenceMap(authors), categories: createReferenceMap(categories) };
}

export async function getBlogPostBySlug(slug: string): Promise<{
  content: Awaited<ReturnType<typeof fetchOneEntry>>;
  post: BlogPost;
} | null> {
  const content = await fetchOneEntry({
    model: config.models.blogPost,
    apiKey: config.apiKey,
    query: { "data.slug": slug },
    userAttributes: { urlPath: `/blog/${slug}` },
  });
  if (!content) return null;
  const post = normalizeBlogPost(content, await getBlogReferenceMaps());
  return post ? { content, post } : null;
}

export async function listPublishedBlogPosts(filters: BlogListFilters = {}): Promise<BlogListing> {
  const normalizedFilters = normalizeBlogFilters(filters);
  const [entries, maps] = await Promise.all([
    fetchEntries({
      model: config.models.blogPost,
      apiKey: config.apiKey,
      limit: 100,
      fields: BLOG_LIST_PROJECTION,
      options: { noTargeting: true },
    }),
    getBlogReferenceMaps(),
  ]);
  const posts = (entries ?? [])
    .map((entry) => normalizeBlogPost(entry, maps))
    .filter((post): post is BlogPost => post !== null)
    .filter((post) => !post.noIndex)
    .sort((left, right) => {
      const leftDate = Date.parse(left.publishedAt ?? left.updatedAt ?? "") || 0;
      const rightDate = Date.parse(right.publishedAt ?? right.updatedAt ?? "") || 0;
      return rightDate - leftDate;
    })
    .filter((post) => !normalizedFilters.category || post.categories.some(({ slug }) => slug.toLocaleLowerCase() === normalizedFilters.category))
    .filter((post) => !normalizedFilters.tag || post.tags.some((tag) => tag.toLocaleLowerCase() === normalizedFilters.tag));
  const result = paginate(posts, normalizedFilters.page, normalizedFilters.pageSize);
  return {
    posts: result.items,
    page: result.page,
    pageSize: result.pageSize,
    total: result.total,
    totalPages: result.totalPages,
    hasPreviousPage: result.hasPreviousPage,
    hasNextPage: result.hasNextPage,
  };
}

export async function listBlogPostSlugs(limit = 100): Promise<BlogSlugRecord[]> {
  const entries = await fetchEntries({
    model: config.models.blogPost,
    apiKey: config.apiKey,
    limit,
    fields: "data.slug,data.updatedAt,data.noIndex,lastUpdated",
    options: { noTargeting: true },
  });
  return (entries ?? []).flatMap((entry) => {
    const post = normalizeBlogPost({
      ...entry,
      data: { ...(entry.data ?? {}), title: "slug" },
    });
    return post && !post.noIndex ? [{ slug: post.slug, updatedAt: post.updatedAt }] : [];
  });
}

export async function listBlogCategorySlugs(limit = 100): Promise<string[]> {
  const categories = await listBlogCategories(limit);
  return Array.from(new Set(categories.map(({ slug }) => slug)));
}

export async function getBlogCategoryBySlug(slug: string): Promise<BlogCategory | null> {
  const entry = await fetchOneEntry({
    model: config.models.blogCategory,
    apiKey: config.apiKey,
    query: { "data.slug": slug },
    userAttributes: { urlPath: `/blog/category/${slug}` },
  });
  return normalizeBlogCategory(entry);
}

export async function listRelatedBlogPosts(post: BlogPost, limit = 3): Promise<BlogPost[]> {
  const listing = await listPublishedBlogPosts({ pageSize: 24 });
  const relatedIds = new Set(post.relatedPostIds);
  const categorySlugs = new Set(post.categories.map(({ slug }) => slug));
  return listing.posts
    .filter((candidate) => candidate.id !== post.id)
    .filter((candidate) => relatedIds.has(candidate.id) || candidate.categories.some(({ slug }) => categorySlugs.has(slug)))
    .slice(0, limit);
}
