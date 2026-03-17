/**
 * Type-safe wrapper around localStorage with JSON serialization.
 * Fails gracefully if localStorage is unavailable (SSR, private browsing).
 */
export const storage = {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      console.warn(`[storage] Failed to read key "${key}":`, error);
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`[storage] Failed to write key "${key}":`, error);
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`[storage] Failed to remove key "${key}":`, error);
    }
  },
};
