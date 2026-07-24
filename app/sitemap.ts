import type { MetadataRoute } from "next";
import { listProductHandles } from "@/lib/shopify/product";
import {
  listBlogCategorySlugs,
  listBlogPostSlugs,
  listBuilderCollectionHandles,
} from "@/lib/builder/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = process.env.APP_ORIGIN ?? "http://localhost:3000";
  let products: string[] = [];
  let collections: string[] = [];
  let blogPosts: Awaited<ReturnType<typeof listBlogPostSlugs>> = [];
  let blogCategories: string[] = [];
  try { products = await listProductHandles(250); } catch {}
  try { collections = await listBuilderCollectionHandles(250); } catch {}
  try { blogPosts = await listBlogPostSlugs(100); } catch {}
  try { blogCategories = await listBlogCategorySlugs(100); } catch {}

  const now = new Date();
  return [
    { url: `${origin}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${origin}/cart`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${origin}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    ...products.map((handle) => ({
      url: `${origin}/products/${handle}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...collections.map((handle) => ({
      url: `${origin}/collections/${handle}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...blogPosts.map(({ slug, updatedAt }) => ({
      url: `${origin}/blog/${slug}`,
      lastModified: updatedAt ? new Date(updatedAt) : now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...blogCategories.map((slug) => ({
      url: `${origin}/blog/category/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
