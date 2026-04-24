import type { MetadataRoute } from "next";
import { listProductHandles, listCollectionHandles } from "@/lib/shopify/product";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = process.env.APP_ORIGIN ?? "http://localhost:3000";
  let products: string[] = [];
  let collections: string[] = [];
  try { products = await listProductHandles(250); } catch {}
  try { collections = await listCollectionHandles(250); } catch {}

  const now = new Date();
  return [
    { url: `${origin}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${origin}/cart`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
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
  ];
}
