/** Validate that a redirect target is a same-origin path. Used to prevent open-redirect. */
export function safeInternalPath(input: string | null | undefined, fallback = "/"): string {
  if (!input) return fallback;
  try {
    if (!input.startsWith("/") || input.startsWith("//")) return fallback;
    if (input.includes("\\")) return fallback;
    return input;
  } catch {
    return fallback;
  }
}

/** Build absolute URL from APP_ORIGIN + path. Server-only. */
export function absoluteUrl(origin: string, path: string): string {
  const u = new URL(path.startsWith("/") ? path : `/${path}`, origin);
  return u.toString();
}
