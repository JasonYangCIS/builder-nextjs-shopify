import type { BlogCategory, BlogListing } from "@/types/blog.types";

export interface BlogListingViewProps {
  listing: BlogListing;
  categories: BlogCategory[];
  pathname: string;
  activeCategory?: string | null;
  activeTag?: string | null;
  heading: string;
  description?: string | null;
}
