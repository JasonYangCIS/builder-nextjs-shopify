/**
 * Builder.io public client config.
 * Server-only secrets live in lib/env.ts.
 */
export const config = {
  apiKey: process.env.NEXT_PUBLIC_BUILDER_API_KEY ?? "",
  models: {
    page: "page",
    product: "product",
    collection: "collection",
    announcementBar: "announcement-bar",
  },
} as const;

export type BuilderModelName = (typeof config.models)[keyof typeof config.models];
