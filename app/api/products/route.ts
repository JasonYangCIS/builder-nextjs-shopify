import { NextResponse } from "next/server";
import { listProducts, getCollection, getProductByHandle } from "@/lib/shopify/product";

const MAX_HANDLES = 24;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const handle = url.searchParams.get("handle");
  const handlesParam = url.searchParams.get("handles");
  const collection = url.searchParams.get("collection");
  const query = url.searchParams.get("query");
  const limit = Math.min(48, Number(url.searchParams.get("limit") ?? 12));
  try {
    if (handlesParam) {
      const handles = handlesParam.split(",").map((h) => h.trim()).filter(Boolean).slice(0, MAX_HANDLES);
      const uniqueHandles = [...new Set(handles)];
      const settled = await Promise.allSettled(uniqueHandles.map((h) => getProductByHandle(h)));
      const productMap = new Map(uniqueHandles.map((h, i) => [
        h,
        settled[i]?.status === "fulfilled" ? (settled[i].value ?? null) : null,
      ]));
      const results = handles.map((h) => ({ handle: h, product: productMap.get(h) ?? null }));
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
