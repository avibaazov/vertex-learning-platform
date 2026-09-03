import { cn } from "@/lib/cn";
import { Icon, type IconName } from "@/components/icons";

export type Status = "in-progress" | "completed" | "now-playing" | "locked";

const config: Record<
  Status,
  { label: string; icon: IconName; className: string; spin?: boolean }
> = {
  "in-progress": {
    label: "In Progress",
    icon: "circle-dashed",
    className: "text-primary-500",
    spin: true,
  },
  completed: {
    label: "Completed",
    icon: "check-circle",
    className: "text-success",
  },
  "now-playing": {
    label: "Now Playing",
    icon: "play-circle",
    className: "text-primary-500",
  },
  locked: {
    label: "Locked",
    icon: "lock",
    className: "text-neutral-500",
  },
};

export interface StatusIndicatorProps {
  status: Status;
  className?: string;
}

export function StatusIndicator({ status, className }: StatusIndicatorProps) {
  const { label, icon, className: tone, spin } = config[status];
  return (
    <span className={cn("inline-flex items-center gap-2 text-body", tone, className)}>
      <Icon name={icon} size={18} className={cn(spin && "animate-spin")} />
      <span className="font-medium">{label}</span>
    </span>
  );
}
