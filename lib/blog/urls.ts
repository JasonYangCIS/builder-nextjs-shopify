import type { BlogListFilters } from "@/types/blog.types";

export const DEFAULT_BLOG_PAGE_SIZE = 9;
export const MAX_BLOG_PAGE_SIZE = 24;

export function positiveInteger(value: string | number | null | undefined, fallback = 1): number {
  const parsed = typeof value === "number" ? value : Number.parseInt(value ?? "", 10);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function normalizeBlogFilters(filters: BlogListFilters): {
  category: string | null;
  tag: string | null;
  page: number;
  pageSize: number;
} {
  return {
    category: cleanFilter(filters.category),
    tag: cleanFilter(filters.tag),
    page: positiveInteger(filters.page, 1),
    pageSize: Math.min(positiveInteger(filters.pageSize, DEFAULT_BLOG_PAGE_SIZE), MAX_BLOG_PAGE_SIZE),
  };
}

function cleanFilter(value: string | null | undefined): string | null {
  const cleaned = value?.trim().toLocaleLowerCase() ?? "";
  return cleaned && /^[a-z0-9][a-z0-9-]{0,79}$/.test(cleaned) ? cleaned : null;
}

export function slugifyTag(value: string): string {
  return value
    .toLocaleLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function blogListingHref(
  pathname: string,
  filters: Pick<BlogListFilters, "category" | "tag" | "page">,
): string {
  const params = new URLSearchParams();
  const category = cleanFilter(filters.category);
  const tag = cleanFilter(filters.tag);
  const page = positiveInteger(filters.page, 1);
  if (category) params.set("category", category);
  if (tag) params.set("tag", tag);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function paginate<T>(items: readonly T[], page: number, pageSize: number) {
  const safeSize = Math.min(positiveInteger(pageSize, DEFAULT_BLOG_PAGE_SIZE), MAX_BLOG_PAGE_SIZE);
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / safeSize));
  const safePage = Math.min(positiveInteger(page, 1), totalPages);
  const start = (safePage - 1) * safeSize;
  return {
    items: items.slice(start, start + safeSize),
    page: safePage,
    pageSize: safeSize,
    total,
    totalPages,
    hasPreviousPage: safePage > 1,
    hasNextPage: safePage < totalPages,
  };
}
