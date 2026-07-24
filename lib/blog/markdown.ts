import type { BlogPost } from "@/types/blog.types";

type UnknownRecord = Record<string, unknown>;

function record(value: unknown): UnknownRecord | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as UnknownRecord)
    : null;
}

function text(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function safeUrl(value: unknown): string | null {
  const candidate = text(value);
  if (!candidate) return null;
  try {
    const url = new URL(candidate);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function decodeHtml(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function htmlToMarkdown(html: string): string {
  return decodeHtml(
    html
      .replace(/<\s*br\s*\/?>/gi, "\n")
      .replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, (_, level: string, content: string) => `\n${"#".repeat(Number(level))} ${content}\n`)
      .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "\n- $1")
      .replace(/<\/?(?:ul|ol)[^>]*>/gi, "\n")
      .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, "\n> $1\n")
      .replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, "\n```\n$1\n```\n")
      .replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, "`$1`")
      .replace(/<strong[^>]*>([\s\S]*?)<\/strong>|<b[^>]*>([\s\S]*?)<\/b>/gi, "**$1$2**")
      .replace(/<em[^>]*>([\s\S]*?)<\/em>|<i[^>]*>([\s\S]*?)<\/i>/gi, "_$1$2_")
      .replace(/<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_, href: string, label: string) => {
        const url = safeUrl(href);
        return url ? `[${label}](${url})` : label;
      })
      .replace(/<\/?(?:p|div|section|article)[^>]*>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/\n[ \t]+/g, "\n")
      .replace(/\n{3,}/g, "\n\n"),
  );
}

function markdownTable(columns: unknown, rows: unknown): string | null {
  if (!Array.isArray(columns) || !Array.isArray(rows) || columns.length === 0) return null;
  const headers = columns.map((column) => text(record(column)?.header) ?? "");
  const keys = columns.map((column) => text(record(column)?.key) ?? "");
  if (headers.some((header) => !header) || keys.some((key) => !key)) return null;
  const lines = [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => {
      const values = record(row);
      return `| ${keys.map((key) => text(values?.[key])?.replace(/\|/g, "\\|") ?? "").join(" | ")} |`;
    }),
  ];
  return lines.join("\n");
}

function blockMarkdown(blocks: unknown): string[] {
  if (!Array.isArray(blocks)) return [];
  return blocks.flatMap((block) => {
    const component = record(record(block)?.component);
    const name = text(component?.name);
    const options = record(component?.options);
    if (!name || !options) return [];

    if (name === "BlogRichText") {
      const html = text(options.html);
      return html ? [htmlToMarkdown(html)] : [];
    }
    if (name === "BlogImageCaption") {
      const src = safeUrl(options.src);
      const alt = text(options.alt) ?? "";
      const caption = text(options.caption);
      return src ? [`![${alt}](${src})${caption ? `\n\n*${caption}*` : ""}`] : [];
    }
    if (name === "BlogTable") {
      const table = markdownTable(options.columns, options.rows);
      const caption = text(options.caption);
      return table ? [caption ? `*${caption}*\n\n${table}` : table] : [];
    }
    if (name === "BlogCallout" || name === "BlogPullQuote") {
      const title = text(options.title) ?? text(options.quote);
      const body = text(options.body) ?? text(options.attribution);
      return title || body ? [`> ${[title, body].filter(Boolean).join(" — ")}`] : [];
    }
    if (name === "BlogCodeBlock") {
      const code = text(options.code);
      const language = text(options.language) ?? "";
      return code ? [`\`\`\`${language}\n${code}\n\`\`\``] : [];
    }
    if (name === "BlogDivider") return ["---"];
    return blockMarkdown(record(block)?.children);
  });
}

function isoDate(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
}

export function createBlogMarkdown(post: BlogPost, blocks: unknown, origin: string): string {
  const articleUrl = post.canonicalUrl ?? `${origin}/blog/${post.slug}`;
  const frontmatter = [
    "---",
    `title: ${JSON.stringify(post.title)}`,
    `canonical: ${JSON.stringify(articleUrl)}`,
    `published: ${JSON.stringify(isoDate(post.publishedAt))}`,
    `updated: ${JSON.stringify(isoDate(post.updatedAt))}`,
    `author: ${JSON.stringify(post.author?.name ?? null)}`,
    `categories: ${JSON.stringify(post.categories.map((category) => category.name))}`,
    `tags: ${JSON.stringify(post.tags)}`,
    "---",
  ];
  const sections = [
    `# ${post.title}`,
    post.excerpt,
    post.featuredImage ? `![${post.featuredImage.alt ?? post.title}](${post.featuredImage.url})` : null,
    ...blockMarkdown(blocks),
    post.citations.length
      ? [
          "## Sources",
          ...post.citations.map((citation) => `- ${citation.url ? `[${citation.title}](${citation.url})` : citation.title}${citation.publisher ? ` — ${citation.publisher}` : ""}`),
        ].join("\n")
      : null,
    post.cta?.heading
      ? [
          `## ${post.cta.heading}`,
          post.cta.body,
          post.cta.actionHref && post.cta.actionLabel ? `[${post.cta.actionLabel}](${post.cta.actionHref})` : null,
        ].filter(Boolean).join("\n\n")
      : null,
  ].filter((section): section is string => Boolean(section));

  return `${frontmatter.join("\n")}\n\n${sections.join("\n\n").trim()}\n`;
}
