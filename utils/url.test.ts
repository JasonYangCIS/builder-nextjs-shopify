import { describe, it, expect } from "vitest";
import { safeInternalPath } from "./url";

describe("safeInternalPath", () => {
  it("rejects open-redirect attempts", () => {
    expect(safeInternalPath("//evil.com")).toBe("/");
    expect(safeInternalPath("https://evil.com")).toBe("/");
    expect(safeInternalPath("/account\\evil")).toBe("/");
  });
  it("accepts internal paths", () => {
    expect(safeInternalPath("/account")).toBe("/account");
    expect(safeInternalPath("/products/foo")).toBe("/products/foo");
  });
  it("falls back when null", () => {
    expect(safeInternalPath(null, "/home")).toBe("/home");
  });
});
