import { describe, it, expect } from "vitest";
import { formatDate, relativeTime } from "../format-date";

describe("formatDate", () => {
  it("formats a date in en-US locale by default", () => {
    const date = new Date("2025-03-15T12:00:00Z");
    const result = formatDate(date);
    expect(result).toContain("March");
    expect(result).toContain("15");
    expect(result).toContain("2025");
  });

  it("accepts a custom locale", () => {
    const date = new Date("2025-01-01T12:00:00Z");
    const result = formatDate(date, "de-DE");
    expect(result).toContain("Januar");
  });

  it("handles different months", () => {
    const july = new Date("2025-07-04T12:00:00Z");
    expect(formatDate(july)).toContain("July");

    const december = new Date("2025-12-25T12:00:00Z");
    expect(formatDate(december)).toContain("December");
  });
});

describe("relativeTime", () => {
  it("returns a string for past dates", () => {
    const pastDate = new Date(Date.now() - 3600 * 1000 * 2); // 2 hours ago
    const result = relativeTime(pastDate);
    expect(result).toContain("ago");
  });

  it("returns a string for future dates", () => {
    const futureDate = new Date(Date.now() + 3600 * 1000 * 24 * 3); // 3 days from now
    const result = relativeTime(futureDate);
    expect(result).toContain("in");
  });

  it("returns a string for very recent dates", () => {
    const justNow = new Date(Date.now() - 5000); // 5 seconds ago
    const result = relativeTime(justNow);
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});
