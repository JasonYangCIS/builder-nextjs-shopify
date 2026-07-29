import "server-only";

type BuilderEntryEnvelope = {
  published?: string;
  startDate?: number | null;
  endDate?: number | null;
};

export function isBuilderEntryLive(entry: unknown, now: number = Date.now()): boolean {
  if (!entry || typeof entry !== "object") return false;
  const { published, startDate, endDate } = entry as BuilderEntryEnvelope;
  if (published !== "published") return false;
  if (typeof startDate === "number" && startDate > now) return false;
  if (typeof endDate === "number" && endDate <= now) return false;
  return true;
}
