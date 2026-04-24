import "server-only";
import { EncryptJWT, jwtDecrypt } from "jose";
import { env } from "@/lib/env";

const ALG = "dir";
const ENC = "A256GCM";

function getKey(): Uint8Array {
  // Derive a 32-byte key from SESSION_SECRET (raw or hex).
  const raw = env.SESSION_SECRET;
  const buf = Buffer.from(raw, "utf8");
  if (buf.length >= 32) return buf.subarray(0, 32);
  // pad
  const out = Buffer.alloc(32);
  buf.copy(out);
  return out;
}

export interface SessionPayload {
  /** Customer Account API access token (encrypted at rest in cookie). */
  accessToken?: string;
  refreshToken?: string;
  /** Epoch seconds when access token expires. */
  expiresAt?: number;
  idToken?: string;
}

export async function encryptSession(payload: SessionPayload, ttlSec = 60 * 60 * 24 * 7): Promise<string> {
  return await new EncryptJWT({ ...payload })
    .setProtectedHeader({ alg: ALG, enc: ENC })
    .setIssuedAt()
    .setExpirationTime(`${ttlSec}s`)
    .encrypt(getKey());
}

export async function decryptSession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtDecrypt(token, getKey());
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

export interface OAuthStatePayload {
  state: string;
  nonce: string;
  verifier: string;
  redirectTo: string;
}

export async function encryptOAuthState(payload: OAuthStatePayload): Promise<string> {
  return encryptSession(payload as unknown as SessionPayload, 60 * 10);
}

export async function decryptOAuthState(token: string): Promise<OAuthStatePayload | null> {
  return (await decryptSession(token)) as unknown as OAuthStatePayload | null;
}

export const COOKIE_NAMES = {
  session: "__session",
  oauthState: "__oauth_state",
  cartId: "cart_id",
} as const;

export const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: env.NODE_ENV === "production",
  path: "/",
};
