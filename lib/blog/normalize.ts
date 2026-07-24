import type {
  BlogAuthor,
  BlogCategory,
  BlogCitation,
  BlogCtaData,
  BlogFaq,
  BlogImage,
  BlogPost,
} from "@/types/blog.types";

type UnknownRecord = Record<string, unknown>;

export interface BlogReferenceMaps {
  authors?: ReadonlyMap<string, BlogAuthor>;
  categories?: ReadonlyMap<string, BlogCategory>;
}

function record(value: unknown): UnknownRecord | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as UnknownRecord)
    : null;
}

function text(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function numberValue(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function safeUrl(value: unknown, allowRelative = false): string | null {
  const candidate = text(value);
  if (!candidate) return null;
  if (allowRelative && candidate.startsWith("/") && !candidate.startsWith("//")) return candidate;
  try {
    const url = new URL(candidate.startsWith("//") ? `https:${candidate}` : candidate);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function dateValue(value: unknown): string | null {
  const valueText = text(value);
  return valueText && !Number.isNaN(Date.parse(valueText)) ? valueText : null;
}

function dataOf(value: unknown): UnknownRecord {
  const root = record(value);
  return record(root?.data) ?? root ?? {};
}

function referenceId(value: unknown): string | null {
  if (typeof value === "string") return text(value);
  const item = record(value);
  const nested = record(item?.value);
  return text(item?.id) ?? text(nested?.id) ?? text(item?.modelId);
}

function listFieldValue(value: unknown, field: string): unknown {
  return record(value)?.[field] ?? value;
}

function image(value: unknown, fallbackAlt?: unknown): BlogImage | null {
  const direct = safeUrl(value);
  if (direct) return { url: direct, alt: text(fallbackAlt), width: null, height: null };
  const item = record(value);
  const url = safeUrl(item?.url) ?? safeUrl(item?.src) ?? safeUrl(item?.file);
  if (!url) return null;
  return {
    url,
    alt: text(item?.alt) ?? text(item?.altText) ?? text(fallbackAlt),
    width: numberValue(item?.width),
    height: numberValue(item?.height),
  };
}

function normalizeAuthorValue(value: unknown, maps: BlogReferenceMaps): BlogAuthor | null {
  const id = referenceId(value);
  if (id && maps.authors?.has(id)) return maps.authors.get(id) ?? null;
  return normalizeBlogAuthor(value);
}

function normalizeCategoryValue(value: unknown, maps: BlogReferenceMaps): BlogCategory | null {
  const id = referenceId(value);
  if (id && maps.categories?.has(id)) return maps.categories.get(id) ?? null;
  return normalizeBlogCategory(value);
}

export function normalizeBlogAuthor(value: unknown): BlogAuthor | null {
  const root = record(value);
  const data = dataOf(root?.value ?? value);
  const name = text(data.name) ?? text(data.title);
  if (!name) return null;
  return {
    id: text(root?.id) ?? referenceId(value) ?? text(data.slug) ?? name,
    name,
    slug: text(data.slug),
    schemaType: data.schemaType === "Organization" ? "Organization" : "Person",
    bio: text(data.bio) ?? text(data.description),
    avatar: image(data.avatar ?? data.image, data.avatarAlt),
    profileUrl: safeUrl(data.profileUrl),
  };
}

export function normalizeBlogCategory(value: unknown): BlogCategory | null {
  const root = record(value);
  const data = dataOf(root?.value ?? value);
  const slug = text(data.slug);
  const name = text(data.name) ?? text(data.title);
  if (!slug || !name) return null;
  return {
    id: text(root?.id) ?? referenceId(value) ?? slug,
    name,
    slug,
    description: text(data.description),
  };
}

function normalizeCitation(value: unknown, index: number): BlogCitation | null {
  const item = record(value);
  const title = text(item?.title);
  if (!title) return null;
  return {
    id: text(item?.id) ?? `citation-${index + 1}`,
    title,
    url: safeUrl(item?.url),
    publisher: text(item?.publisher),
    accessedAt: dateValue(item?.accessedAt),
  };
}



function normalizeCta(value: unknown): BlogCtaData | null {
  const item = record(value);
  if (!item) return null;
  const cta = {
    heading: text(item.heading),
    body: text(item.body),
    actionLabel: text(item.actionLabel),
    actionHref: safeUrl(item.actionHref, true),
  };
  return Object.values(cta).some(Boolean) ? cta : null;
}

function unique<T>(values: T[], key: (value: T) => string): T[] {
  return Array.from(new Map(values.map((value) => [key(value), value])).values());
}

function plainText(value: string): string {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function richTextHtml(blocks: unknown): string[] {
  if (!Array.isArray(blocks)) return [];
  return blocks.flatMap((block) => {
    const item = record(block);
    const component = record(item?.component);
    const options = record(component?.options);
    const current = text(options?.html);
    const children = richTextHtml(item?.children);
    return current ? [current, ...children] : children;
  });
}

function extractFaqs(htmlValues: readonly string[]): BlogFaq[] {
  return htmlValues.flatMap((html) => {
    const section = html.match(/<h2[^>]*>\s*Frequently asked questions\s*<\/h2>([\s\S]*)/i)?.[1];
    if (!section) return [];
    const faqs: BlogFaq[] = [];
    const questionPattern = /<h3[^>]*>([\s\S]*?)<\/h3>([\s\S]*?)(?=<h3|<h2|$)/gi;
    for (const match of section.matchAll(questionPattern)) {
      const question = plainText(match[1] ?? "");
      const answer = plainText(match[2] ?? "");
      if (question && answer) faqs.push({ question, answer });
    }
    return faqs;
  });
}

function countWords(htmlValues: readonly string[]): number | null {
  const words = plainText(htmlValues.join(" ")).match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu);
  return words?.length ?? null;
}

export function normalizeBlogPost(value: unknown, maps: BlogReferenceMaps = {}): BlogPost | null {
  const root = record(value);
  const data = dataOf(value);
  const slug = text(data.slug);
  const title = text(data.title);
  if (!slug || !title) return null;

  const categoryValues = Array.isArray(data.categories)
    ? data.categories
    : data.category ? [data.category] : [];
  const categories = unique(
    categoryValues
      .map((item) => normalizeCategoryValue(listFieldValue(item, "category"), maps))
      .filter((item): item is BlogCategory => item !== null),
    (item) => item.slug,
  );
  const tags = unique(
    (Array.isArray(data.tags) ? data.tags : [])
      .map((item) => text(listFieldValue(item, "tag")))
      .filter((item): item is string => item !== null),
    (item) => item.toLocaleLowerCase(),
  );
  const relatedValues = Array.isArray(data.relatedPosts) ? data.relatedPosts : [];
  const articleHtml = richTextHtml(data.blocks);

  return {
    id: text(root?.id) ?? slug,
    slug,
    title,
    excerpt: text(data.excerpt) ?? text(data.description),
    seoTitle: text(data.seoTitle),
    seoDescription: text(data.seoDescription),
    canonicalUrl: safeUrl(data.canonicalUrl, true),
    focusKeyword: text(data.focusKeyword),
    noIndex: data.noIndex === true,
    featured: data.featured === true,
    featuredImage: image(data.featuredImage ?? data.image, data.featuredImageAlt ?? data.imageAlt),
    author: normalizeAuthorValue(data.author, maps),
    categories,
    tags,
    citations: (Array.isArray(data.citations) ? data.citations : [])
      .map(normalizeCitation)
      .filter((item): item is BlogCitation => item !== null),
    relatedPostIds: relatedValues
      .map((item) => referenceId(listFieldValue(item, "post")))
      .filter((item): item is string => item !== null),
    cta: normalizeCta(data.cta),
    publishedAt: dateValue(data.publishedAt ?? root?.publishedDate),
    updatedAt: dateValue(data.updatedAt ?? root?.lastUpdated),
    readingTimeMinutes: numberValue(data.readingTimeMinutes ?? data.readingTime),
    wordCount: countWords(articleHtml),
    faqs: extractFaqs(articleHtml),
  };
}

export function createReferenceMap<T extends { id: string }>(items: readonly T[]): Map<string, T> {
  return new Map(items.map((item) => [item.id, item]));
}
