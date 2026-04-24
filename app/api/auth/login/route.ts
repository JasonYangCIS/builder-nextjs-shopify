import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { generatePkcePair, generateRandomString } from "@/lib/auth/pkce";
import {
  COOKIE_NAMES,
  COOKIE_OPTIONS,
  encryptOAuthState,
} from "@/lib/auth/session";
import { getAuthorizeUrl } from "@/lib/auth/customer-token";
import { safeInternalPath } from "@/utils/url";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const redirectTo = safeInternalPath(url.searchParams.get("redirect_to"), "/account");
  const { verifier, challenge } = generatePkcePair();
  const state = generateRandomString(16);
  const nonce = generateRandomString(16);
  const cookieValue = await encryptOAuthState({ state, nonce, verifier, redirectTo });
  const jar = await cookies();
  jar.set(COOKIE_NAMES.oauthState, cookieValue, { ...COOKIE_OPTIONS, maxAge: 60 * 10 });
  const authUrl = getAuthorizeUrl({ state, nonce, challenge });
  return NextResponse.redirect(authUrl);
}
