import type { BuilderContent } from "@builder.io/sdk-react";

type UnknownRecord = Record<string, unknown>;

function record(value: unknown): UnknownRecord | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? value as UnknownRecord
    : null;
}

function imageIdentity(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return `${url.origin}${url.pathname.replace(/\/$/, "")}`;
  } catch {
    return null;
  }
}

function filterBlocks(blocks: unknown[], featuredImage: string): [unknown[], boolean] {
  let changed = false;
  const filtered = blocks.flatMap((block) => {
    const item = record(block);
    const component = record(item?.component);
    const options = record(component?.options);
    if (component?.name === "BlogImageCaption" && imageIdentity(options?.src) === featuredImage) {
      changed = true;
      return [];
    }

    if (!Array.isArray(item?.children)) return [block];
    const [children, childChanged] = filterBlocks(item.children, featuredImage);
    if (!childChanged) return [block];
    changed = true;
    return [{ ...item, children }];
  });
  return [filtered, changed];
}

export function removeDuplicateFeaturedImageBlocks(
  content: BuilderContent | null,
  featuredImageUrl: string | null | undefined,
): BuilderContent | null {
  const featuredImage = imageIdentity(featuredImageUrl);
  const blocks = content?.data?.blocks;
  if (!content || !featuredImage || !Array.isArray(blocks)) return content;

  const [filteredBlocks, changed] = filterBlocks(blocks, featuredImage);
  return changed
    ? { ...content, data: { ...content.data, blocks: filteredBlocks as typeof blocks } }
    : content;
}
