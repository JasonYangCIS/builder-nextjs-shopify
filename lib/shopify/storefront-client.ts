import "server-only";
import { env } from "@/lib/env";

export interface ShopifyFetchOptions<TVars> {
  query: string;
  variables?: TVars;
  tags?: string[];
  revalidate?: number | false;
}

export interface ShopifyFetchResult<T> {
  data: T;
}

const endpoint = `https://${env.SHOPIFY_STORE_DOMAIN}/api/${env.SHOPIFY_STOREFRONT_API_VERSION}/graphql.json`;

export async function shopifyFetch<T, V = Record<string, unknown>>({
  query,
  variables,
  tags,
  revalidate = 60,
}: ShopifyFetchOptions<V>): Promise<ShopifyFetchResult<T>> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": env.SHOPIFY_STOREFRONT_API_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    next: tags || revalidate ? { tags, revalidate: revalidate === false ? undefined : revalidate } : undefined,
  });

  if (!res.ok) {
    throw new Error(`Shopify Storefront error: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (json.errors?.length) {
    throw new Error(`Shopify GraphQL errors: ${json.errors.map((e) => e.message).join("; ")}`);
  }
  if (!json.data) throw new Error("Shopify response missing `data`");
  return { data: json.data };
}
