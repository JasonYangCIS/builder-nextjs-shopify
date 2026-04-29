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

const REQUEST_TIMEOUT_MS = 10_000;
const MAX_ATTEMPTS = 3;

function isRetryableError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const e = err as { name?: string; code?: string; cause?: { code?: string; errors?: { code?: string }[] } };
  if (e.name === "AbortError") return true;
  const code = e.code ?? e.cause?.code ?? e.cause?.errors?.[0]?.code;
  return (
    code === "ETIMEDOUT" ||
    code === "ECONNRESET" ||
    code === "ECONNREFUSED" ||
    code === "EAI_AGAIN" ||
    code === "UND_ERR_CONNECT_TIMEOUT" ||
    code === "UND_ERR_SOCKET"
  );
}

async function fetchWithRetry(body: string, fetchInit: RequestInit): Promise<Response> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const res = await fetch(endpoint, { ...fetchInit, body, signal: controller.signal });
      clearTimeout(timer);
      // Retry on transient 5xx / 429
      if ((res.status >= 500 || res.status === 429) && attempt < MAX_ATTEMPTS) {
        await new Promise((r) => setTimeout(r, 250 * 2 ** (attempt - 1)));
        continue;
      }
      return res;
    } catch (err) {
      clearTimeout(timer);
      lastErr = err;
      if (attempt >= MAX_ATTEMPTS || !isRetryableError(err)) throw err;
      await new Promise((r) => setTimeout(r, 250 * 2 ** (attempt - 1)));
    }
  }
  throw lastErr;
}

export async function shopifyFetch<T, V = Record<string, unknown>>({
  query,
  variables,
  tags,
  revalidate = 60,
}: ShopifyFetchOptions<V>): Promise<ShopifyFetchResult<T>> {
  const res = await fetchWithRetry(JSON.stringify({ query, variables }), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": env.SHOPIFY_STOREFRONT_API_TOKEN,
    },
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
