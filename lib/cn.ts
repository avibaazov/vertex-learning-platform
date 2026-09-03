type ClassValue = string | number | false | null | undefined;

/** Minimal className joiner — filters falsy values and joins with a space. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
