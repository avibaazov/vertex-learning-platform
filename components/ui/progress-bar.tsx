import { cn } from "@/lib/cn";

export interface ProgressBarProps {
  /** 0–100 */
  value: number;
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  showLabel = true,
  className,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-200"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-linear-to-r from-primary-500 to-primary-400 transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="shrink-0 text-body tabular-nums text-neutral-500">
          {pct}% complete
        </span>
      )}
    </div>
  );
}
