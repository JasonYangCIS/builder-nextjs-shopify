export interface BlogImage {
  url: string;
  alt: string | null;
  width: number | null;
  height: number | null;
}

export interface BlogAuthor {
  id: string;
  name: string;
  slug: string | null;
  schemaType: "Person" | "Organization";
  bio: string | null;
  avatar: BlogImage | null;
  profileUrl: string | null;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface BlogCitation {
  id: string;
  title: string;
  url: string | null;
  publisher: string | null;
  accessedAt: string | null;
}


export interface BlogCtaData {
  heading: string | null;
  body: string | null;
  actionLabel: string | null;
  actionHref: string | null;
}

export interface BlogFaq {
  question: string;
  answer: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  focusKeyword: string | null;
  noIndex: boolean;
  qualityGateStatus: string | null;
  featured: boolean;
  featuredImage: BlogImage | null;
  author: BlogAuthor | null;
  categories: BlogCategory[];
  tags: string[];
  citations: BlogCitation[];
  relatedPostIds: string[];
  cta: BlogCtaData | null;
  publishedAt: string | null;
  updatedAt: string | null;
  readingTimeMinutes: number | null;
  wordCount: number | null;
  faqs: BlogFaq[];
}

export interface BlogListing {
  posts: BlogPost[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface BlogListFilters {
  category?: string | null;
  tag?: string | null;
  page?: number | null;
  pageSize?: number | null;
}

export interface BlogSlugRecord {
  slug: string;
  updatedAt: string | null;
}
