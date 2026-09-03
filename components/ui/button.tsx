import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "text";

const base =
  "inline-flex h-11 items-center justify-center gap-2 rounded-md px-4 text-body font-medium " +
  "transition-colors duration-150 select-none " +
  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-100 " +
  "disabled:cursor-not-allowed";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-500 text-white hover:bg-primary-400 active:bg-primary-500 " +
    "disabled:bg-primary-200 disabled:text-white",
  secondary:
    "border border-primary-500 text-primary-500 bg-white hover:bg-primary-100 " +
    "disabled:border-primary-200 disabled:text-primary-300 disabled:bg-white",
  tertiary:
    "text-primary-500 hover:bg-primary-100 hover:text-primary-400 " +
    "disabled:text-primary-300 disabled:hover:bg-transparent",
  text:
    "px-2 text-primary-500 hover:text-primary-400 " +
    "disabled:text-primary-300",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(base, variants[variant], className)}
      {...props}
    />
  );
}
