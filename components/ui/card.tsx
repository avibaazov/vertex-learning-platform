import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "@/components/icons";
import { Badge } from "./badge";

/* ---- Base surface ------------------------------------------------------- */

export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-neutral-200 bg-white p-5 shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

function MetaItem({
  icon,
  children,
}: {
  icon: IconName;
  children: ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-small text-neutral-500">
      <Icon name={icon} size={14} />
      {children}
    </span>
  );
}

/* ---- Course card ------------------------------------------------------- */

export interface CourseCardProps {
  title: string;
  description: string;
  glyph?: string;
  level?: string;
  duration?: string;
  modules?: string;
}

export function CourseCard({
  title,
  description,
  glyph = "N",
  level = "Intermediate",
  duration = "18h 24m",
  modules = "12 modules",
}: CourseCardProps) {
  return (
    <Card className="flex flex-col gap-4">
      <span className="grid h-12 w-12 place-items-center rounded-md bg-neutral-900 text-heading-3 font-semibold text-white">
        {glyph}
      </span>
      <div className="space-y-1">
        <h3 className="text-heading-3 font-semibold text-neutral-900">{title}</h3>
        <p className="text-body text-neutral-500">{description}</p>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-neutral-100 pt-3">
        <MetaItem icon="chart">{level}</MetaItem>
        <MetaItem icon="clock">{duration}</MetaItem>
        <MetaItem icon="file">{modules}</MetaItem>
      </div>
    </Card>
  );
}

/* ---- Video lesson card ------------------------------------------------- */

export interface VideoLessonCardProps {
  title: string;
  description: string;
  lesson?: string;
  timestamp?: string;
}

export function VideoLessonCard({
  title,
  description,
  lesson = "Lesson 5.1",
  timestamp = "12:45",
}: VideoLessonCardProps) {
  return (
    <Card className="flex flex-col gap-3">
      <Badge tone="video">Video</Badge>
      <div className="space-y-1">
        <h3 className="text-heading-3 font-semibold text-neutral-900">{title}</h3>
        <p className="text-body text-neutral-500">{description}</p>
      </div>
      <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
        <span className="text-small text-neutral-500">
          {lesson} · {timestamp}
        </span>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-body font-medium text-primary-500 hover:text-primary-400"
        >
          <Icon name="play" size={16} />
          Watch from {timestamp}
        </button>
      </div>
    </Card>
  );
}

/* ---- Lesson card ----------------------------------------------------- */

export interface LessonCardProps {
  title: string;
  description: string;
  module?: string;
}

export function LessonCard({
  title,
  description,
  module = "Module 5",
}: LessonCardProps) {
  return (
    <Card className="flex flex-col gap-3">
      <Badge tone="lesson">Lesson</Badge>
      <div className="space-y-1">
        <h3 className="text-heading-3 font-semibold text-neutral-900">{title}</h3>
        <p className="text-body text-neutral-500">{description}</p>
      </div>
      <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
        <span className="text-small text-neutral-500">{module}</span>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-body font-medium text-primary-500 hover:text-primary-400"
        >
          View lesson
          <Icon name="external-link" size={16} />
        </button>
      </div>
    </Card>
  );
}

/* ---- Resource card ------------------------------------------------------- */

export interface ResourceCardProps {
  title: string;
  description: string;
  meta?: string;
}

export function ResourceCard({
  title,
  description,
  meta = "PDF · 1.2 MB",
}: ResourceCardProps) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-neutral-100 text-neutral-500">
          <Icon name="file" size={20} />
        </span>
        <div className="space-y-1">
          <h3 className="text-heading-3 font-semibold text-neutral-900">
            {title}
          </h3>
          <p className="text-body text-neutral-500">{description}</p>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
        <span className="text-small text-neutral-500">{meta}</span>
        <button
          type="button"
          aria-label="Open resource"
          className="text-primary-500 hover:text-primary-400"
        >
          <Icon name="external-link" size={18} />
        </button>
      </div>
    </Card>
  );
}
