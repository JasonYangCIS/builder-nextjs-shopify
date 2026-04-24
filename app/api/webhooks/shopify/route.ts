import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { env } from "@/lib/env";

interface WebhookPayload {
  handle?: string;
  product_id?: string;
  inventory_item_id?: string;
}

export async function POST(req: Request) {
  if (!env.SHOPIFY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhooks not configured" }, { status: 503 });
  }
  const raw = await req.text();
  const sigHeader = req.headers.get("x-shopify-hmac-sha256") ?? "";
  const computed = createHmac("sha256", env.SHOPIFY_WEBHOOK_SECRET).update(raw, "utf8").digest("base64");
  const a = Buffer.from(sigHeader);
  const b = Buffer.from(computed);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const topic = req.headers.get("x-shopify-topic") ?? "";
  let body: WebhookPayload = {};
  try {
    body = JSON.parse(raw) as WebhookPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (topic.startsWith("products/")) {
    if (body.handle) revalidateTag(`product:${body.handle}`, "max");
    revalidateTag("products", "max");
  } else if (topic.startsWith("inventory_levels/")) {
    revalidateTag("products", "max");
  } else if (topic.startsWith("collections/")) {
    revalidateTag("collections", "max");
  }
  return NextResponse.json({ ok: true });
}
