"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { Badge, buttonVariants } from "@/components/ui";
import { cn } from "@/lib/cn";

export interface CurriculumLesson {
  key: string;
  label: string;
  title: string;
  href: string;
  durationLabel: string | null;
  freePreview: boolean;
}

export interface CurriculumModule {
  key: string;
  number: number;
  title: string;
  summary: string | null;
  runtimeLabel: string | null;
  lessons: CurriculumLesson[];
}

const COLLAPSED_COUNT = 6;

export function CourseCurriculum({ modules }: { modules: CurriculumModule[] }) {
  const [open, setOpen] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);

  const hasOverflow = modules.length > COLLAPSED_COUNT;
  const visible = showAll ? modules : modules.slice(0, COLLAPSED_COUNT);

  function toggle(key: string) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  return (
    <div className="relative">
      {/* Connecting rail behind the number markers */}
      <span
        aria-hidden="true"
        className="absolute left-4 top-6 bottom-6 w-px bg-neutral-200"
      />

      <ul className="relative border-y border-neutral-200 divide-y divide-neutral-200">
        {visible.map((mod) => {
          const isOpen = open.has(mod.key);
          const panelId = `module-panel-${mod.key}`;
          return (
            <li key={mod.key}>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(mod.key)}
                className="flex w-full items-center gap-4 py-5 text-left"
              >
                <span className="relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-neutral-300 bg-[#F7F4F1] text-small font-semibold text-neutral-700">
                  {mod.number}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-heading-3 font-semibold text-neutral-900">
                    {mod.title}
                  </span>
                  {mod.summary && (
                    <span className="mt-0.5 block text-body text-neutral-500">
                      {mod.summary}
                    </span>
                  )}
                </span>
                {mod.runtimeLabel && (
                  <span className="shrink-0 text-small text-neutral-500">
                    {mod.runtimeLabel}
                  </span>
                )}
                <Icon
                  name="chevron-down"
                  size={18}
                  className={cn(
                    "shrink-0 text-neutral-400 transition-transform duration-150",
                    isOpen && "rotate-180",
                  )}
                />
              </button>

              {isOpen && (
                <ul id={panelId} className="space-y-1 pb-5 pl-12">
                  {mod.lessons.map((lesson) => (
                    <li key={lesson.key}>
                      <Link
                        href={lesson.href}
                        className="flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-white"
                      >
                        <Icon
                          name="play-circle"
                          size={18}
                          className="shrink-0 text-primary-500"
                        />
                        <span className="min-w-0 flex-1 text-body text-neutral-700">
                          <span className="text-neutral-500">{lesson.label}</span>
                          {" · "}
                          {lesson.title}
                        </span>
                        {lesson.freePreview && (
                          <Badge tone="popular" className="shrink-0">
                            Free preview
                          </Badge>
                        )}
                        {lesson.durationLabel && (
                          <span className="shrink-0 text-small tabular-nums text-neutral-500">
                            {lesson.durationLabel}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>

      {hasOverflow && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className={buttonVariants("secondary")}
          >
            {showAll ? "Show fewer" : `Show all ${modules.length} modules`}
            <Icon
              name="chevron-down"
              size={16}
              className={cn("transition-transform duration-150", showAll && "rotate-180")}
            />
          </button>
        </div>
      )}
    </div>
  );
}
