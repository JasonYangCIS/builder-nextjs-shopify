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
  try {
    const logoutUrl = getLogoutUrl(idToken);
    return NextResponse.redirect(logoutUrl);
  } catch {
    return NextResponse.redirect(new URL("/", env.APP_ORIGIN));
  }
}
