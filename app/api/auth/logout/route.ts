import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAMES } from "@/lib/auth/session";
import { decryptSession } from "@/lib/auth/session";
import { getLogoutUrl } from "@/lib/auth/customer-token";
import { verifySameOrigin } from "@/lib/auth/csrf";
import { env } from "@/lib/env";

export async function POST(req: Request) {
  if (!verifySameOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const jar = await cookies();
  const sessCookie = jar.get(COOKIE_NAMES.session)?.value;
  let idToken: string | undefined;
  if (sessCookie) {
    const session = await decryptSession(sessCookie);
    idToken = session?.idToken;
  }
  jar.delete(COOKIE_NAMES.session);
  jar.delete(COOKIE_NAMES.oauthState);
  // Use 303 See Other so the browser converts the POST → GET on the redirect
  // target (Shopify's logout endpoint). 307 (the NextResponse.redirect default)
  // would re-POST and break the flow.
  try {
    const logoutUrl = getLogoutUrl(idToken);
    return NextResponse.redirect(logoutUrl, 303);
  } catch {
    return NextResponse.redirect(new URL("/", env.APP_ORIGIN), 303);
  }
}
