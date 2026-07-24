import type { BlogCategory, BlogListing, BlogPost } from "@/types/blog.types";

interface BlogJsonLdOptions {
  origin: string;
  post: BlogPost;
}

interface BlogListingJsonLdOptions {
  origin: string;
  pathname: string;
  title: string;
  description: string;
  listing: BlogListing;
  category?: BlogCategory | null;
}

function absoluteUrl(origin: string, value: string): string {
  return new URL(value, origin).toString();
}

function imageObject(post: BlogPost) {
  if (!post.featuredImage) return undefined;
  return {
    "@type": "ImageObject",
    url: post.featuredImage.url,
    contentUrl: post.featuredImage.url,
    caption: post.featuredImage.alt ?? undefined,
    width: post.featuredImage.width ?? undefined,
    height: post.featuredImage.height ?? undefined,
  };
}

function authorObject(origin: string, post: BlogPost) {
  if (!post.author) return undefined;
  const url = post.author.profileUrl ?? undefined;
  return {
    "@type": post.author.schemaType,
    "@id": url ? `${url}#author` : undefined,
    name: post.author.name,
    url,
    description: post.author.bio ?? undefined,
    image: post.author.avatar
      ? {
          "@type": "ImageObject",
          url: post.author.avatar.url,
          contentUrl: post.author.avatar.url,
          caption: post.author.avatar.alt ?? undefined,
        }
      : undefined,
  };
}

function citationObjects(post: BlogPost) {
  const citations = post.citations
    .filter((citation) => citation.url)
    .map((citation) => ({
      "@type": "CreativeWork",
      name: citation.title,
      url: citation.url ?? undefined,
      publisher: citation.publisher
        ? { "@type": "Organization", name: citation.publisher }
        : undefined,
      dateAccessed: citation.accessedAt ?? undefined,
    }));
  return citations.length ? citations : undefined;
}

export function createBlogJsonLd({ origin, post }: BlogJsonLdOptions) {
  const blogUrl = absoluteUrl(origin, "/blog");
  const articleUrl = absoluteUrl(origin, post.canonicalUrl ?? `/blog/${encodeURIComponent(post.slug)}`);
  const category = post.categories[0] ?? null;
  const categoryUrl = category
    ? absoluteUrl(origin, `/blog/category/${encodeURIComponent(category.slug)}`)
    : null;
  const topics = [post.focusKeyword, ...post.tags]
    .filter((topic): topic is string => Boolean(topic))
    .map((name) => ({ "@type": "Thing", name }));
  const article = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${articleUrl}#article`,
    headline: post.title,
    description: post.seoDescription ?? post.excerpt ?? undefined,
    url: articleUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    isPartOf: { "@type": "Blog", "@id": `${blogUrl}#blog`, name: "Builder Shop Blog", url: blogUrl },
    inLanguage: "en-US",
    datePublished: post.publishedAt ?? undefined,
    dateModified: post.updatedAt ?? post.publishedAt ?? undefined,
    image: imageObject(post),
    author: authorObject(origin, post),
    publisher: { "@id": `${absoluteUrl(origin, "/")}#organization` },
    articleSection: post.categories.map((item) => item.name),
    keywords: [post.focusKeyword, ...post.tags].filter(Boolean).join(", ") || undefined,
    about: topics.length ? topics : undefined,
    citation: citationObjects(post),
    wordCount: post.wordCount ?? undefined,
    timeRequired: post.readingTimeMinutes ? `PT${post.readingTimeMinutes}M` : undefined,
  };
  const breadcrumbItems = [
    { name: "Home", item: absoluteUrl(origin, "/") },
    { name: "Blog", item: blogUrl },
    ...(category && categoryUrl ? [{ name: category.name, item: categoryUrl }] : []),
    { name: post.title, item: articleUrl },
  ];
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${articleUrl}#breadcrumbs`,
    itemListElement: breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      ...item,
    })),
  };
  const faq = post.faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${articleUrl}#faq`,
        url: articleUrl,
        mainEntity: post.faqs.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }
    : null;
  return faq ? [article, breadcrumbs, faq] : [article, breadcrumbs];
}

export function createBlogListingJsonLd({
  origin,
  pathname,
  title,
  description,
  listing,
  category,
}: BlogListingJsonLdOptions) {
  const pageUrl = absoluteUrl(origin, pathname);
  const blogUrl = absoluteUrl(origin, "/blog");
  const startPosition = (listing.page - 1) * listing.pageSize;
  const collection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}#collection`,
    url: pageUrl,
    name: title,
    description,
    inLanguage: "en-US",
    isPartOf: { "@type": "Blog", "@id": `${blogUrl}#blog`, name: "Builder Shop Blog", url: blogUrl },
    mainEntity: {
      "@type": "ItemList",
      "@id": `${pageUrl}#articles`,
      name: title,
      numberOfItems: listing.total,
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      itemListElement: listing.posts.map((post, index) => {
        const url = absoluteUrl(origin, `/blog/${encodeURIComponent(post.slug)}`);
        return {
          "@type": "ListItem",
          position: startPosition + index + 1,
          url,
          item: {
            "@type": "BlogPosting",
            "@id": `${url}#article`,
            headline: post.title,
            url,
            description: post.excerpt ?? undefined,
            datePublished: post.publishedAt ?? undefined,
            dateModified: post.updatedAt ?? undefined,
            image: imageObject(post),
            author: authorObject(origin, post),
          },
        };
      }),
    },
  };
  const breadcrumbItems = [
    { name: "Home", item: absoluteUrl(origin, "/") },
    { name: "Blog", item: blogUrl },
    ...(category ? [{ name: category.name, item: pageUrl }] : []),
  ];
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumbs`,
    itemListElement: breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      ...item,
    })),
  };
  return [collection, breadcrumbs];
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}
