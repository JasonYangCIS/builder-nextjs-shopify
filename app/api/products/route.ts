import { NextResponse } from "next/server";
import { listProducts, getCollection, getProductByHandle, resolveProductsByHandles } from "@/lib/shopify/product";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const handle = url.searchParams.get("handle");
  const handlesParam = url.searchParams.get("handles");
  const collection = url.searchParams.get("collection");
  const query = url.searchParams.get("query");
  const limit = Math.min(48, Number(url.searchParams.get("limit") ?? 12));
  if (handlesParam) {
    try {
      const results = await resolveProductsByHandles(handlesParam.split(","));
      return NextResponse.json({ results });
    } catch {
      return NextResponse.json({ results: [] }, { status: 500 });
    }
  }
  try {
    if (handle) {
      const product = await getProductByHandle(handle);
      return NextResponse.json({ products: product ? [product] : [] });
    }
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
