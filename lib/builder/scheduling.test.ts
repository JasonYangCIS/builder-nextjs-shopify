import { describe, expect, it } from "vitest";
import { isBuilderEntryLive } from "@/lib/builder/scheduling";

const NOW = 1_700_000_000_000;

describe("isBuilderEntryLive", () => {
  it("excludes draft and archived entries", () => {
    expect(isBuilderEntryLive({ published: "draft" }, NOW)).toBe(false);
    expect(isBuilderEntryLive({ published: "archived" }, NOW)).toBe(false);
  });

  it("excludes entries with a future startDate", () => {
    expect(isBuilderEntryLive({ published: "published", startDate: NOW + 1000 }, NOW)).toBe(false);
  });

  it("includes entries with a past startDate", () => {
    expect(isBuilderEntryLive({ published: "published", startDate: NOW - 1000 }, NOW)).toBe(true);
  });

  it("excludes entries with a past endDate", () => {
    expect(isBuilderEntryLive({ published: "published", endDate: NOW - 1000 }, NOW)).toBe(false);
  });

  it("includes entries with a future endDate", () => {
    expect(isBuilderEntryLive({ published: "published", endDate: NOW + 1000 }, NOW)).toBe(true);
  });

  it("includes published entries with no startDate or endDate", () => {
    expect(isBuilderEntryLive({ published: "published" }, NOW)).toBe(true);
  });

  it("treats startDate exactly at now as live", () => {
    expect(isBuilderEntryLive({ published: "published", startDate: NOW }, NOW)).toBe(true);
  });

  it("treats endDate exactly at now as expired", () => {
    expect(isBuilderEntryLive({ published: "published", endDate: NOW }, NOW)).toBe(false);
  });

  it("returns false for null or non-object entries", () => {
    expect(isBuilderEntryLive(null, NOW)).toBe(false);
    expect(isBuilderEntryLive(undefined, NOW)).toBe(false);
  });
});
