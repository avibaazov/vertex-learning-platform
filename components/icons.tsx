import type { ReactNode, SVGProps } from "react";
import { cn } from "@/lib/cn";

/* ============================================================
   Vertex icon set
   24×24 grid · 2px stroke · rounded line caps · optical balance
   ============================================================ */

export type IconName =
  | "bell"
  | "search"
  | "play"
  | "file"
  | "bookmark"
  | "chart"
  | "clock"
  | "user"
  | "chevron-right"
  | "chevron-left"
  | "chevron-down"
  | "external-link"
  | "check-circle"
  | "circle-dashed"
  | "lock"
  | "play-circle"
  | "arrow-right"
  | "command";

const outline: Record<IconName, ReactNode> = {
  bell: (
    <>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  play: <path d="M7 4.5v15l12-7.5-12-7.5Z" />,
  file: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
      <path d="M14 3v5h5" />
    </>
  ),
  bookmark: <path d="M19 21l-7-4.5L5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" />,
  chart: (
    <>
      <path d="M4 20h16" />
      <path d="M7 20v-6" />
      <path d="M12 20V8" />
      <path d="M17 20v-9" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  user: (
    <>
      <path d="M19 21v-1a5 5 0 0 0-5-5h-4a5 5 0 0 0-5 5v1" />
      <circle cx="12" cy="8" r="4" />
    </>
  ),
  "chevron-right": <path d="m9 5 7 7-7 7" />,
  "chevron-left": <path d="m15 5-7 7 7 7" />,
  "chevron-down": <path d="m5 9 7 7 7-7" />,
  "external-link": (
    <>
      <path d="M14 4h6v6" />
      <path d="M20 4 10 14" />
      <path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />
    </>
  ),
  "check-circle": (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </>
  ),
  "circle-dashed": (
    <path d="M12 3.5a8.5 8.5 0 1 1-6 2.5" />
  ),
  lock: (
    <>
      <rect x="4.5" y="11" width="15" height="9.5" rx="2" />
      <path d="M8 11V7.5a4 4 0 0 1 8 0V11" />
    </>
  ),
  "play-circle": (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M10.5 9 16 12l-5.5 3V9Z" />
    </>
  ),
  "arrow-right": (
    <>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
  command: (
    <path d="M9 9V7a2.5 2.5 0 1 0-2.5 2.5H9Zm0 0v6m0-6h6M9 15v2a2.5 2.5 0 1 1-2.5-2.5H9Zm6 0v2a2.5 2.5 0 1 0 2.5-2.5H15Zm0 0V9m0 0v-2a2.5 2.5 0 1 1 2.5 2.5H15Z" />
  ),
};

const filled: Partial<Record<IconName, ReactNode>> = {
  bell: (
    <path d="M12 2a6 6 0 0 0-6 6c0 7-3 9-3 9h18s-3-2-3-9a6 6 0 0 0-6-6Zm2 17h-4a2 2 0 0 0 4 0Z" />
  ),
  bookmark: <path d="M7 2h10a2 2 0 0 1 2 2v17l-7-4.5L5 21V4a2 2 0 0 1 2-2Z" />,
  file: (
    <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7l-5-5Zm-1 6V3.5L18.5 9H14a1 1 0 0 1-1-1Z" />
  ),
  "play-circle": (
    <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-1.5 5.7a1 1 0 0 1 1.52-.86l4.5 2.8a1 1 0 0 1 0 1.72l-4.5 2.8A1 1 0 0 1 10.5 16.3V8.7Z" />
  ),
  user: (
    <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4 0-7 2.2-7 5v1h14v-1c0-2.8-3-5-7-5Z" />
  ),
  chart: (
    <path d="M4 19a1 1 0 0 0 1 1h15a1 1 0 0 0 0-2H6V4a1 1 0 0 0-2 0v15Zm5-1h1.5a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1Zm5 0h1.5a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H14a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1Zm5 0h.5a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-.5a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1Z" />
  ),
  clock: (
    <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm1 8.6V7a1 1 0 1 0-2 0v5a1 1 0 0 0 .3.7l3 3a1 1 0 0 0 1.4-1.4L13 11.6Z" />
  ),
  search: (
    <path d="M11 4a7 7 0 1 1-4.2 12.6l-2.1 2.1a1 1 0 0 1-1.4-1.4l2.1-2.1A7 7 0 0 1 11 4Zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z" />
  ),
  "chevron-right": (
    <path d="M9 4.6a1 1 0 0 1 1.7-.7l7 7a1 1 0 0 1 0 1.4l-7 7A1 1 0 0 1 9 18.6V4.6Z" />
  ),
};

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  /** px size for width & height. Default 24. */
  size?: number;
  variant?: "outline" | "filled";
}

export function Icon({
  name,
  size = 24,
  variant = "outline",
  className,
  ...props
}: IconProps) {
  const isFilled = variant === "filled" && filled[name] != null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={isFilled ? "currentColor" : "none"}
      stroke={isFilled ? "none" : "currentColor"}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("shrink-0", className)}
      {...props}
    >
      {isFilled ? filled[name] : outline[name]}
    </svg>
  );
}

/* ---- Brand mark ---------------------------------------------------------- */

export function VertexLogo({
  className,
  withWordmark = true,
}: {
  className?: string;
  withWordmark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        viewBox="0 0 32 32"
        className="h-6 w-6"
        aria-hidden="true"
        fill="none"
      >
        <path d="M3 5h9l4 9.5L20 5h9L16 29 3 5Z" fill="var(--color-primary-500)" />
        <path d="M12 5h8l-4 9.5L12 5Z" fill="var(--color-primary-300)" />
      </svg>
      {withWordmark && (
        <span className="text-heading-3 font-semibold tracking-tight text-neutral-900">
          Vertex
        </span>
      )}
    </span>
  );
}
