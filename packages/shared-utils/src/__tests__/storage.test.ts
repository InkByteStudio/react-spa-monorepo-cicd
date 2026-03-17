import { describe, it, expect, beforeEach } from "vitest";
import { storage } from "../storage";

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("stores and retrieves values", () => {
    storage.set("key", { name: "test" });
    expect(storage.get("key")).toEqual({ name: "test" });
  });

  it("returns null for missing keys", () => {
    expect(storage.get("nonexistent")).toBeNull();
  });

  it("removes values", () => {
    storage.set("key", "value");
    storage.remove("key");
    expect(storage.get("key")).toBeNull();
  });

  it("handles primitive values", () => {
    storage.set("num", 42);
    expect(storage.get<number>("num")).toBe(42);

    storage.set("bool", true);
    expect(storage.get<boolean>("bool")).toBe(true);
  });
});
