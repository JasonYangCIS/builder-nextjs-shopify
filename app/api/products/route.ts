import { NextResponse } from "next/server";
import { listProducts, getCollection, getProductByHandle } from "@/lib/shopify/product";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const handle = url.searchParams.get("handle");
  const handlesParam = url.searchParams.get("handles");
  const collection = url.searchParams.get("collection");
  const query = url.searchParams.get("query");
  const limit = Math.min(48, Number(url.searchParams.get("limit") ?? 12));
  try {
    if (handlesParam) {
      const handles = handlesParam.split(",").map((h) => h.trim()).filter(Boolean);
      const settled = await Promise.all(handles.map((h) => getProductByHandle(h)));
      const results = handles.map((h, i) => ({ handle: h, product: settled[i] ?? null }));
      return NextResponse.json({ results });
    }
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
