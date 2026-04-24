import "server-only";
import { env } from "@/lib/env";

/**
 * Verify a mutating request originates from our own app.
 * Origin must match APP_ORIGIN.
 */
export function verifySameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try {
    const allowed = new URL(env.APP_ORIGIN).origin;
    return new URL(origin).origin === allowed;
  } catch {
    return false;
  }
}
