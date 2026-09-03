import type { InputHTMLAttributes, SelectHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/icons";

const fieldBase =
  "h-11 w-full rounded-md border border-neutral-200 bg-white px-4 text-body text-neutral-900 " +
  "placeholder:text-neutral-500 transition-colors " +
  "focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100 " +
  "disabled:bg-neutral-100 disabled:text-neutral-500";

/* ---- Search / text input --------------------------------------------------- */

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Leading icon slot. Pass `null` to hide the default search glyph. */
  icon?: ReactNode;
  /** Trailing adornment, e.g. a keyboard shortcut hint. */
  trailing?: ReactNode;
}

export function Input({
  className,
  icon = <Icon name="search" size={18} className="text-neutral-500" />,
  trailing,
  ...props
}: InputProps) {
  return (
    <div className="relative">
      {icon && (
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
          {icon}
        </span>
      )}
      <input
        className={cn(
          fieldBase,
          icon ? "pl-10" : undefined,
          trailing ? "pr-16" : undefined,
          className,
        )}
        {...props}
      />
      {trailing && (
        <span className="absolute inset-y-0 right-3 flex items-center">
          {trailing}
        </span>
      )}
    </div>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex items-center gap-1 rounded-sm border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 text-small font-medium text-neutral-500">
      {children}
    </kbd>
  );
}

/* ---- Select -------------------------------------------------------------- */

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        className={cn(fieldBase, "appearance-none pr-10", className)}
        {...props}
      >
        {children}
      </select>
      <Icon
        name="chevron-down"
        size={18}
        className="pointer-events-none absolute inset-y-0 right-3 my-auto text-neutral-500"
      />
    </div>
  );
}
