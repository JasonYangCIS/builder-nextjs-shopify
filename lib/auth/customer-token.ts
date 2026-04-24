import "server-only";
import { env } from "@/lib/env";

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  id_token?: string;
  token_type: string;
  scope?: string;
}

function getApiBase(): string {
  const url = env.SHOPIFY_CUSTOMER_ACCOUNT_API_URL;
  if (!url) throw new Error("SHOPIFY_CUSTOMER_ACCOUNT_API_URL not configured");
  // strip trailing slash
  return url.replace(/\/$/, "");
}

export function getAuthorizeUrl(params: { state: string; nonce: string; challenge: string }): string {
  const base = getApiBase();
  const qs = new URLSearchParams({
    client_id: env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID,
    response_type: "code",
    redirect_uri: env.SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI,
    scope: "openid email customer-account-api:full",
    state: params.state,
    nonce: params.nonce,
    code_challenge: params.challenge,
    code_challenge_method: "S256",
  });
  return `${base}/auth/oauth/authorize?${qs.toString()}`;
}

export async function exchangeCodeForToken(code: string, verifier: string): Promise<TokenResponse> {
  const base = getApiBase();
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID,
    redirect_uri: env.SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI,
    code,
    code_verifier: verifier,
  });
  const res = await fetch(`${base}/auth/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) throw new Error(`Token exchange failed: ${res.status}`);
  return (await res.json()) as TokenResponse;
}

export async function refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
  const base = getApiBase();
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID,
    refresh_token: refreshToken,
  });
  const res = await fetch(`${base}/auth/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) throw new Error(`Token refresh failed: ${res.status}`);
  return (await res.json()) as TokenResponse;
}

export function getLogoutUrl(idTokenHint?: string): string {
  const base = getApiBase();
  const qs = new URLSearchParams({
    post_logout_redirect_uri: env.APP_ORIGIN,
  });
  if (idTokenHint) qs.set("id_token_hint", idTokenHint);
  return `${base}/auth/logout?${qs.toString()}`;
}

export async function customerFetch<T>(
  accessToken: string,
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const base = getApiBase();
  const res = await fetch(`${base}/account/customer/api/2024-10/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Customer Account API error: ${res.status}`);
  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join("; "));
  if (!json.data) throw new Error("Customer API response missing data");
  return json.data;
}
