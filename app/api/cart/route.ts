import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import {
  addCartLines,
  createCart,
  getCart,
  removeCartLines,
  updateCartLines,
} from "@/lib/shopify/cart";
import { COOKIE_NAMES, COOKIE_OPTIONS } from "@/lib/auth/session";
import { verifySameOrigin } from "@/lib/auth/csrf";

const ActionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("add"), variantId: z.string().min(1), quantity: z.number().int().min(1).max(99) }),
  z.object({ action: z.literal("update"), lineId: z.string().min(1), quantity: z.number().int().min(0).max(99) }),
  z.object({ action: z.literal("remove"), lineId: z.string().min(1) }),
]);

export async function GET() {
  const jar = await cookies();
  const cartId = jar.get(COOKIE_NAMES.cartId)?.value;
  if (!cartId) return NextResponse.json({ cart: null });
  try {
    const cart = await getCart(cartId);
    if (!cart) {
      // Definitive miss — Shopify confirmed the cart no longer exists.
      jar.delete(COOKIE_NAMES.cartId);
      return NextResponse.json({ cart: null });
    }
    return NextResponse.json({ cart });
  } catch {
    // Transient error (network / 5xx / 429). Keep the cookie so the cart is
    // recoverable on the next request instead of wiping a valid cart.
    return NextResponse.json({ cart: null, transient: true }, { status: 503 });
  }
}

export async function POST(req: Request) {
  if (!verifySameOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const parsed = ActionSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const jar = await cookies();
  let cartId = jar.get(COOKIE_NAMES.cartId)?.value;

  // If we have a cart_id, verify it still exists in Shopify. Only clear the
  // cookie on a definitive miss; surface transient errors so we don't wipe a
  // valid cart during a Shopify outage.
  if (cartId) {
    try {
      const existing = await getCart(cartId);
      if (!existing) {
        jar.delete(COOKIE_NAMES.cartId);
        cartId = undefined;
      }
    } catch {
      return NextResponse.json(
        { error: "Cart lookup failed", transient: true },
        { status: 503 },
      );
    }
  }

  if (!cartId) {
    const created = await createCart();
    if (!created.cart) {
      return NextResponse.json(
        { error: "Could not create cart", userErrors: created.userErrors },
        { status: 500 },
      );
    }
    cartId = created.cart.id;
    jar.set(COOKIE_NAMES.cartId, cartId, { ...COOKIE_OPTIONS, maxAge: 60 * 60 * 24 * 14 });
  }

  const data = parsed.data;
  let result;
  if (data.action === "add") {
    result = await addCartLines(cartId, [{ merchandiseId: data.variantId, quantity: data.quantity }]);
  } else if (data.action === "update") {
    result = await updateCartLines(cartId, [{ id: data.lineId, quantity: data.quantity }]);
  } else {
    result = await removeCartLines(cartId, [data.lineId]);
  }
  return NextResponse.json(result);
}
