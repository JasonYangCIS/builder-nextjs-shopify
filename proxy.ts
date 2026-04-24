import { NextResponse, type NextRequest } from "next/server";

/**
 * Proxy (formerly `middleware` in older Next.js versions): runs before render.
 * Adds strict security headers; relaxes CSP on /preview so Builder.io editor can iframe + edit.
 */

const PRODUCTION_CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.shopify.com https://cdn.builder.io",
  "font-src 'self' data:",
  "connect-src 'self' https://cdn.shopify.com https://*.myshopify.com https://shopify.com https://*.builder.io",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self' https://*.myshopify.com https://shop.app",
].join("; ");

const PREVIEW_CSP = [
  "default-src 'self' https://*.builder.io",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.builder.io https://cdn.builder.io",
  "style-src 'self' 'unsafe-inline' https://*.builder.io",
  "img-src 'self' data: blob: https://cdn.shopify.com https://cdn.builder.io https://*.builder.io",
  "font-src 'self' data: https://*.builder.io",
  "connect-src 'self' https://*.builder.io https://cdn.builder.io https://cdn.shopify.com https://*.myshopify.com",
  "frame-ancestors https://*.builder.io",
].join("; ");

export function proxy(req: NextRequest) {
  const res = NextResponse.next();
  const isPreview = req.nextUrl.pathname.startsWith("/preview");

  res.headers.set("Content-Security-Policy", isPreview ? PREVIEW_CSP : PRODUCTION_CSP);
  res.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  if (!isPreview) res.headers.set("X-Frame-Options", "DENY");
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
