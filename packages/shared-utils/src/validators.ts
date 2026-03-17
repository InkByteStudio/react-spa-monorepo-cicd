/**
 * Common validation functions for form inputs and data.
 */

import { z } from "zod/v4";

const emailSchema = z.email();

export function isValidEmail(value: string): boolean {
  return emailSchema.safeParse(value).success;
}

export function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

export function isWithinLength(value: string, min: number, max: number): boolean {
  const len = value.trim().length;
  return len >= min && len <= max;
}
