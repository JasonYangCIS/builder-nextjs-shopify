import { NextResponse } from "next/server";
import { listProducts, getCollection } from "@/lib/shopify/product";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const collection = url.searchParams.get("collection");
  const query = url.searchParams.get("query");
  const limit = Math.min(48, Number(url.searchParams.get("limit") ?? 12));
  try {
    if (collection) {
      const c = await getCollection(collection, limit);
      return NextResponse.json({ products: c?.products ?? [] });
    }
    const products = await listProducts({ first: limit, query: query ?? undefined });
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}
