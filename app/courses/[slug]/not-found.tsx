import type { CSSProperties } from "react";
import Link from "next/link";

import { SiteHeader } from "@/components/site-header";
import { buttonVariants } from "@/components/ui";

const paper: CSSProperties = {
  background: "#F7F4F1",
  backgroundImage:
    "repeating-linear-gradient(45deg, rgba(15,23,42,0.035) 0 1px, transparent 1px 9px)",
};

export default function CourseNotFound() {
  return (
    <div className="min-h-full overflow-x-hidden" style={paper}>
      <SiteHeader active="courses" />
      <main className="mx-auto flex max-w-[960px] flex-col items-center px-6 py-32 text-center">
        <p className="text-small font-semibold uppercase tracking-[0.18em] text-primary-500">
          404
        </p>
        <h1 className="mt-4 font-display text-[2.5rem] font-bold text-neutral-900">
          Course not found
        </h1>
        <p className="mt-3 max-w-md text-body-lg text-neutral-500">
          We couldn&rsquo;t find that course. It may have moved or been unpublished.
        </p>
        <Link href="/courses" className={buttonVariants("primary", "mt-8")}>
          Browse all courses
        </Link>
      </main>
    </div>
  );
}
