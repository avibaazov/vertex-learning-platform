"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/icons";

function pageItems(total: number, current: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const items: (number | "…")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) items.push("…");
  for (let p = start; p <= end; p++) items.push(p);
  if (end < total - 1) items.push("…");
  items.push(total);
  return items;
}

const cell =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-md px-2 text-body font-medium transition-colors";

export interface PaginationProps {
  totalPages?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
}

export function Pagination({
  totalPages = 8,
  defaultPage = 1,
  onPageChange,
}: PaginationProps) {
  const [page, setPage] = useState(defaultPage);

  const go = (next: number) => {
    const clamped = Math.min(totalPages, Math.max(1, next));
    setPage(clamped);
    onPageChange?.(clamped);
  };

  return (
    <nav aria-label="Pagination" className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => go(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className={cn(
          cell,
          "text-neutral-500 hover:bg-neutral-100 disabled:opacity-40 disabled:hover:bg-transparent",
        )}
      >
        <Icon name="chevron-left" size={18} />
      </button>

      {pageItems(totalPages, page).map((item, i) =>
        item === "…" ? (
          <span
            key={`gap-${i}`}
            className={cn(cell, "text-neutral-500")}
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => go(item)}
            aria-current={item === page ? "page" : undefined}
            className={cn(
              cell,
              item === page
                ? "border border-primary-500 text-primary-500"
                : "text-neutral-700 hover:bg-neutral-100",
            )}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => go(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
        className={cn(
          cell,
          "text-neutral-500 hover:bg-neutral-100 disabled:opacity-40 disabled:hover:bg-transparent",
        )}
      >
        <Icon name="chevron-right" size={18} />
      </button>
    </nav>
  );
}
