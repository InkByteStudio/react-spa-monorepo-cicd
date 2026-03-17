/**
 * Merges class names, filtering out falsy values.
 * Lightweight alternative to clsx/classnames.
 *
 * @example
 *   cn("base", isActive && "active", className)
 *   // => "base active custom-class"
 */
export function cn(...inputs: (string | false | null | undefined)[]): string {
  return inputs.filter(Boolean).join(" ");
}
