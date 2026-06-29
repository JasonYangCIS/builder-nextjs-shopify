import "server-only";
import type { BuilderContent } from "@builder.io/sdk-react";

export type ComponentPrefetcher<O = unknown> = {
  componentName: string;
  getKey: (options: O) => string | null;
  fetchData: (options: O) => Promise<unknown>;
};

function collect(node: unknown, name: string, out: unknown[]): void {
  if (Array.isArray(node)) {
    for (const c of node) collect(c, name, out);
    return;
  }
  if (!node || typeof node !== "object") return;
  const obj = node as Record<string, unknown>;
  const comp = obj.component as { name?: string; options?: unknown } | undefined;
  if (comp?.name === name) out.push(comp.options ?? {});
  for (const v of Object.values(obj)) collect(v, name, out);
}

export async function walkAndPrefetch(
  content: BuilderContent | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prefetchers: ComponentPrefetcher<any>[],
): Promise<Record<string, unknown>> {
  if (!content) return {};
  const fallback: Record<string, unknown> = {};
  await Promise.all(
    prefetchers.flatMap((p) => {
      const instances: unknown[] = [];
      collect(content.data?.blocks ?? [], p.componentName, instances);
      return instances.map(async (opts) => {
        const key = p.getKey(opts as never);
        if (!key || key in fallback) return;
        fallback[key] = await p.fetchData(opts as never);
      });
    }),
  );
  return fallback;
}
