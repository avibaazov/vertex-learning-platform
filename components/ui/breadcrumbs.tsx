import { Fragment } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/icons";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({
  items,
  className,
}: {
  items: Crumb[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-2 text-body">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <Fragment key={item.label}>
              <li>
                {isLast || !item.href ? (
                  <span
                    className={cn(
                      isLast
                        ? "font-medium text-neutral-900"
                        : "text-neutral-500",
                    )}
                    aria-current={isLast ? "page" : undefined}
                  >
                    {item.label}
                  </span>
                ) : (
                  <a
                    href={item.href}
                    className="text-neutral-500 transition-colors hover:text-primary-500"
                  >
                    {item.label}
                  </a>
                )}
              </li>
              {!isLast && (
                <li aria-hidden="true">
                  <Icon
                    name="chevron-right"
                    size={16}
                    className="text-neutral-300"
                  />
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
