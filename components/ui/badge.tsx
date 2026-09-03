import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type BadgeTone = "video" | "lesson" | "popular";

const tones: Record<BadgeTone, string> = {
  video: "bg-primary-100 text-primary-500",
  lesson: "bg-info-soft text-info",
  popular: "border border-primary-300 text-primary-500",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export function Badge({ tone = "video", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide leading-4",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
