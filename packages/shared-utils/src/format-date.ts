/**
 * Format a Date object into a human-readable string.
 *
 * @param date - The date to format
 * @param locale - BCP 47 locale string (default: "en-US")
 * @returns Formatted date string like "March 15, 2025"
 */
export function formatDate(date: Date, locale: string = "en-US"): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return "Invalid date";
  }
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Returns a relative time string like "2 hours ago" or "in 3 days".
 *
 * @param date - The date to compare against now
 * @param locale - BCP 47 locale string (default: "en-US")
 * @returns Relative time string
 */
export function relativeTime(date: Date, locale: string = "en-US"): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return "Invalid date";
  }
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffSeconds = Math.trunc(diffMs / 1000);
  const diffMinutes = Math.trunc(diffMs / 60_000);
  const diffHours = Math.trunc(diffMs / 3_600_000);
  const diffDays = Math.trunc(diffMs / 86_400_000);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (Math.abs(diffDays) >= 1) return rtf.format(diffDays, "day");
  if (Math.abs(diffHours) >= 1) return rtf.format(diffHours, "hour");
  if (Math.abs(diffMinutes) >= 1) return rtf.format(diffMinutes, "minute");
  return rtf.format(diffSeconds, "second");
}
