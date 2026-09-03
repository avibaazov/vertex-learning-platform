/** Display formatters for course/lesson data. */

/**
 * Coerce a Sanity `duration` to a non-negative integer of seconds. The lesson
 * schema types `duration` as a string, but the seeded data stores plain numbers
 * of seconds — this absorbs that mismatch in one place.
 */
export function secondsFrom(
  value: string | number | null | undefined,
): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : 0;
}

/**
 * Human runtime label from a total number of seconds.
 * `7169 -> "1h 59m"`, `2700 -> "45m"`, `7200 -> "2h"`. Returns `null` when there
 * is nothing meaningful to show.
 */
export function formatRuntime(totalSeconds: number): string | null {
  const s = Number.isFinite(totalSeconds) ? Math.max(0, Math.round(totalSeconds)) : 0;
  if (s <= 0) return null;

  const hours = Math.floor(s / 3600);
  const minutes = Math.round((s % 3600) / 60);

  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  return `${minutes}m`;
}

/** Short clip label, `mm:ss` or `h:mm:ss`. `350 -> "5:50"`. */
export function formatClock(totalSeconds: number): string | null {
  const s = Number.isFinite(totalSeconds) ? Math.max(0, Math.round(totalSeconds)) : 0;
  if (s <= 0) return null;

  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;
  const mm = hours > 0 ? String(minutes).padStart(2, "0") : String(minutes);
  const ss = String(seconds).padStart(2, "0");
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
}

/** Compact count, lower-cased. `18240 -> "18.2k"`. */
export function formatCount(value: number | null | undefined): string | null {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return null;
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  })
    .format(n)
    .toLowerCase();
}

/** Capitalise the first letter. `"intermediate" -> "Intermediate"`. */
export function titleCase(value: string | null | undefined): string | null {
  if (!value) return null;
  return value.charAt(0).toUpperCase() + value.slice(1);
}
