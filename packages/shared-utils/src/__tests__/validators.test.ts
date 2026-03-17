import { describe, it, expect } from "vitest";
import { isValidEmail, isValidUrl, isNonEmpty, isWithinLength } from "../validators";

describe("isValidEmail", () => {
  it("accepts valid emails", () => {
    expect(isValidEmail("user@example.com")).toBe(true);
    expect(isValidEmail("user+tag@sub.domain.com")).toBe(true);
  });

  it("rejects invalid emails", () => {
    expect(isValidEmail("")).toBe(false);
    expect(isValidEmail("not-an-email")).toBe(false);
    expect(isValidEmail("@no-local.com")).toBe(false);
  });
});

describe("isValidUrl", () => {
  it("accepts valid URLs", () => {
    expect(isValidUrl("https://example.com")).toBe(true);
    expect(isValidUrl("http://localhost:3000/path")).toBe(true);
  });

  it("rejects invalid URLs", () => {
    expect(isValidUrl("")).toBe(false);
    expect(isValidUrl("not-a-url")).toBe(false);
    expect(isValidUrl("ftp://files.example.com")).toBe(false);
  });
});

describe("isNonEmpty", () => {
  it("returns true for non-empty strings", () => {
    expect(isNonEmpty("hello")).toBe(true);
  });

  it("returns false for empty or whitespace-only strings", () => {
    expect(isNonEmpty("")).toBe(false);
    expect(isNonEmpty("   ")).toBe(false);
  });
});

describe("isWithinLength", () => {
  it("returns true when within bounds", () => {
    expect(isWithinLength("hello", 1, 10)).toBe(true);
  });

  it("returns false when out of bounds", () => {
    expect(isWithinLength("hi", 3, 10)).toBe(false);
    expect(isWithinLength("a very long string", 1, 5)).toBe(false);
  });
});
