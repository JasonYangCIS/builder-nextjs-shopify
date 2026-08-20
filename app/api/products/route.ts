import { NextResponse } from "next/server";
import { z } from "zod";
import { getProductByHandle, resolveProductsByHandles, resolveProductGrid } from "@/lib/shopify/product";

const filtersSchema = z
  .array(
    z.string().refine((value) => {
      try {
        JSON.parse(value);
        return true;
      } catch {
        return false;
      }
    }, "must be a valid JSON string"),
  )
  .max(20);

export async function GET(req: Request) {
  const url = new URL(req.url);
  const handle = url.searchParams.get("handle");
  const handlesParam = url.searchParams.get("handles");
  const collection = url.searchParams.get("collection");
  const query = url.searchParams.get("query");
  const search = url.searchParams.get("q");
  const sort = url.searchParams.get("sort");
  const limit = url.searchParams.get("limit");
  const filtersParam = url.searchParams.get("filters");
  if (handlesParam) {
    try {
      const results = await resolveProductsByHandles(handlesParam.split(","));
      return NextResponse.json({ results });
    } catch {
      return NextResponse.json({ results: [] }, { status: 500 });
    }
  }
  let filters: string[] | undefined;
  if (filtersParam) {
    let rawFilters: unknown;
    try {
      rawFilters = JSON.parse(filtersParam);
    } catch {
      return NextResponse.json({ products: [], facets: [] }, { status: 400 });
    }
    const parsed = filtersSchema.safeParse(rawFilters);
    if (!parsed.success) {
      return NextResponse.json({ products: [], facets: [] }, { status: 400 });
    }
    filters = parsed.data;
  }
  try {
    if (handle) {
      const product = await getProductByHandle(handle);
      return NextResponse.json({ products: product ? [product] : [] });
    }
    const { products, facets } = await resolveProductGrid({
      collectionHandle: collection,
      query: search ?? query,
      limit,
      sort,
      filters,
    });
    return NextResponse.json({ products, facets });
  } catch {
    return NextResponse.json({ products: [], facets: [] }, { status: 500 });
  }
}
