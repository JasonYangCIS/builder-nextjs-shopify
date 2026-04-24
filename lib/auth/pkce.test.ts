import { describe, it, expect } from "vitest";
import { generatePkcePair, generateRandomString } from "./pkce";

describe("pkce", () => {
  it("generates verifier and challenge of correct shape", () => {
    const { verifier, challenge } = generatePkcePair();
    expect(verifier).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(challenge).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(verifier.length).toBeGreaterThanOrEqual(43);
    expect(challenge.length).toBeGreaterThanOrEqual(43);
  });
  it("randoms are unique", () => {
    expect(generateRandomString()).not.toBe(generateRandomString());
  });
});
