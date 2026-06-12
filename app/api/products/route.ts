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
  if (handlesParam) {
    try {
      const handles = handlesParam.split(",").map((h) => h.trim()).filter(Boolean).slice(0, MAX_HANDLES);
      const uniqueHandles = [...new Set(handles)];
      const settled = await Promise.allSettled(uniqueHandles.map((h) => getProductByHandle(h)));
      const resultMap = new Map(uniqueHandles.map((h, i) => {
        const s = settled[i];
        return [
          h,
          s.status === "fulfilled"
            ? { product: s.value ?? null, fetchError: false }
            : { product: null, fetchError: true },
        ];
      }));
      const results = handles.map((h) => ({ handle: h, ...resultMap.get(h)! }));
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
