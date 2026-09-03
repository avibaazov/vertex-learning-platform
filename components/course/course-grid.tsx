import Link from "next/link";

import { CourseCard } from "@/components/ui";
import { urlFor } from "@/sanity/lib/image";
import type { COURSES_QUERY_RESULT } from "@/sanity.types";
import { formatRuntime, titleCase } from "@/lib/format";

/**
 * Responsive grid of course cards, each linking to its detail page. Shared by the
 * home page (sliced to a few) and the `/courses` catalog (all of them).
 */
export function CourseGrid({ courses }: { courses: COURSES_QUERY_RESULT }) {
  if (courses.length === 0) return null;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => {
        const asset = course.coverImage?.asset;
        const imageUrl = asset
          ? urlFor(asset._id).width(640).height(360).fit("crop").url()
          : undefined;

        return (
          <Link
            key={course._id}
            href={`/courses/${course.slug}`}
            className="group block h-full"
          >
            <CourseCard
              title={course.title}
              description={course.summary ?? ""}
              imageUrl={imageUrl}
              imageAlt={course.coverImage?.alt || course.title}
              imageLqip={asset?.metadata?.lqip ?? undefined}
              glyph={course.title.charAt(0)}
              level={titleCase(course.level) ?? ""}
              duration={formatRuntime(course.durationSeconds ?? 0) ?? ""}
              modules={`${course.moduleCount ?? 0} modules`}
            />
          </Link>
        );
      })}
    </div>
  );
}
