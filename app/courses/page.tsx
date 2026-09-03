import type { CSSProperties } from "react";
import type { Metadata } from "next";

import { SiteHeader } from "@/components/site-header";
import { CourseGrid } from "@/components/course/course-grid";
import { sanityFetch } from "@/sanity/lib/fetch";
import { COURSES_QUERY } from "@/sanity/queries";
import type { COURSES_QUERY_RESULT } from "@/sanity.types";

const paper: CSSProperties = {
  background: "#F7F4F1",
  backgroundImage:
    "repeating-linear-gradient(45deg, rgba(15,23,42,0.035) 0 1px, transparent 1px 9px)",
};

export const metadata: Metadata = {
  title: "All Courses — Vertex",
  description: "Browse every course on Vertex.",
};

export default async function CoursesPage() {
  const courses = await sanityFetch<COURSES_QUERY_RESULT>({
    query: COURSES_QUERY,
  });

  return (
    <div className="min-h-full overflow-x-hidden" style={paper}>
      <SiteHeader active="courses" />
      <main className="mx-auto max-w-[1440px] px-6 pb-24">
        <div className="py-10">
          <h1 className="font-display text-[2.5rem] font-bold text-neutral-900">
            All Courses
          </h1>
          <p className="mt-2 text-body-lg text-neutral-500">
            {courses.length} course{courses.length === 1 ? "" : "s"} across every
            track.
          </p>
        </div>
        <CourseGrid courses={courses} />
      </main>
    </div>
  );
}
