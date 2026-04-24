import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const isProd = process.env.NODE_ENV === "production";
  if (!isProd) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/account", "/preview"] },
    sitemap: `${process.env.APP_ORIGIN}/sitemap.xml`,
  };
}
