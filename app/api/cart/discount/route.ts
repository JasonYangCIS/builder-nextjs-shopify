import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { updateDiscountCodes } from "@/lib/shopify/cart";
import { COOKIE_NAMES } from "@/lib/auth/session";
import { verifySameOrigin } from "@/lib/auth/csrf";

const Schema = z.object({
  discountCodes: z.array(z.string().min(1).max(100)).max(10),
});

export async function POST(req: Request) {
  if (!verifySameOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const parsed = Schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const jar = await cookies();
  const cartId = jar.get(COOKIE_NAMES.cartId)?.value;
  if (!cartId) return NextResponse.json({ error: "No cart" }, { status: 400 });
  const result = await updateDiscountCodes(cartId, parsed.data.discountCodes);
  return NextResponse.json(result);
}
