import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAMES, decryptSession } from "@/lib/auth/session";
import { customerFetch, refreshAccessToken } from "@/lib/auth/customer-token";
import { CUSTOMER_PROFILE, CUSTOMER_ORDERS } from "@/lib/shopify/queries/customer";

interface OrderEdge {
  node: {
    id: string;
    name: string;
    processedAt: string;
    financialStatus: string | null;
    fulfillmentStatus: string | null;
    totalPrice: { amount: string; currencyCode: string };
  };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const wantOrders = url.searchParams.get("orders") === "1";
  const jar = await cookies();
  const sessCookie = jar.get(COOKIE_NAMES.session)?.value;
  if (!sessCookie) {
    return NextResponse.json({ authenticated: false }, { status: wantOrders ? 401 : 200 });
  }
  let session = await decryptSession(sessCookie);
  if (!session?.accessToken) {
    return NextResponse.json({ authenticated: false }, { status: wantOrders ? 401 : 200 });
  }
  // refresh if near expiry
  if (session.expiresAt && session.expiresAt - 60 < Math.floor(Date.now() / 1000) && session.refreshToken) {
    try {
      const t = await refreshAccessToken(session.refreshToken);
      session = {
        ...session,
        accessToken: t.access_token,
        refreshToken: t.refresh_token,
        expiresAt: Math.floor(Date.now() / 1000) + t.expires_in,
        idToken: t.id_token ?? session.idToken,
      };
      // re-encrypt cookie
      const { encryptSession, COOKIE_OPTIONS } = await import("@/lib/auth/session");
      const newSess = await encryptSession(session);
      jar.set(COOKIE_NAMES.session, newSess, { ...COOKIE_OPTIONS, maxAge: 60 * 60 * 24 * 7 });
    } catch {
      return NextResponse.json({ authenticated: false }, { status: wantOrders ? 401 : 200 });
    }
  }

  const accessToken = session.accessToken;
  if (!accessToken) {
    return NextResponse.json({ authenticated: false }, { status: wantOrders ? 401 : 200 });
  }
  try {
    if (wantOrders) {
      const data = await customerFetch<{ customer: { orders: { edges: OrderEdge[] } } }>(
        accessToken,
        CUSTOMER_ORDERS,
        { first: 25 },
      );
      return NextResponse.json({ orders: data.customer.orders.edges.map((e) => e.node) });
    }
    const data = await customerFetch<{ customer: unknown }>(accessToken, CUSTOMER_PROFILE);
    return NextResponse.json({ authenticated: true, customer: data.customer });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: wantOrders ? 401 : 200 });
  }
}
