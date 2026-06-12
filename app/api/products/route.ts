import { NextResponse } from "next/server";
import { getProductByHandle, resolveProductsByHandles, resolveProductGrid } from "@/lib/shopify/product";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const handle = url.searchParams.get("handle");
  const handlesParam = url.searchParams.get("handles");
  const collection = url.searchParams.get("collection");
  const query = url.searchParams.get("query");
  const limit = url.searchParams.get("limit");
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
    const products = await resolveProductGrid({ collectionHandle: collection, query, limit });
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}
