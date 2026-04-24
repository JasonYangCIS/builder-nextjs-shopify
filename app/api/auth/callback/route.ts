import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  COOKIE_NAMES,
  COOKIE_OPTIONS,
  decryptOAuthState,
  encryptSession,
} from "@/lib/auth/session";
import { exchangeCodeForToken } from "@/lib/auth/customer-token";
import { env } from "@/lib/env";
import { safeInternalPath } from "@/utils/url";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!code || !state) {
    return NextResponse.redirect(new URL("/account?error=missing", env.APP_ORIGIN));
  }

  const jar = await cookies();
  const oauthCookie = jar.get(COOKIE_NAMES.oauthState)?.value;
  jar.delete(COOKIE_NAMES.oauthState);
  if (!oauthCookie) {
    return NextResponse.redirect(new URL("/account?error=state", env.APP_ORIGIN));
  }
  const stored = await decryptOAuthState(oauthCookie);
  if (!stored || stored.state !== state) {
    return NextResponse.redirect(new URL("/account?error=state", env.APP_ORIGIN));
  }

  try {
    const tokens = await exchangeCodeForToken(code, stored.verifier);
    const session = await encryptSession({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: Math.floor(Date.now() / 1000) + tokens.expires_in,
      idToken: tokens.id_token,
    });
    jar.set(COOKIE_NAMES.session, session, {
      ...COOKIE_OPTIONS,
      maxAge: 60 * 60 * 24 * 7,
    });
    const dest = safeInternalPath(stored.redirectTo, "/account");
    return NextResponse.redirect(new URL(dest, env.APP_ORIGIN));
  } catch {
    return NextResponse.redirect(new URL("/account?error=exchange", env.APP_ORIGIN));
  }
}
