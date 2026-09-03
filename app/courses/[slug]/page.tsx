import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Icon, type IconName } from "@/components/icons";
import { SiteHeader } from "@/components/site-header";
import {
  Badge,
  Breadcrumbs,
  Button,
  ProgressBar,
  buttonVariants,
} from "@/components/ui";
import {
  CourseCurriculum,
  type CurriculumModule,
} from "@/components/course/curriculum";
import { sanityFetch } from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";
import { COURSE_BY_SLUG_QUERY, COURSE_SLUGS_QUERY } from "@/sanity/queries";
import type {
  COURSE_BY_SLUG_QUERY_RESULT,
  COURSE_SLUGS_QUERY_RESULT,
} from "@/sanity.types";
import {
  formatClock,
  formatCount,
  formatRuntime,
  secondsFrom,
  titleCase,
} from "@/lib/format";

type Params = Promise<{ slug: string }>;

const paper: CSSProperties = {
  background: "#F7F4F1",
  backgroundImage:
    "repeating-linear-gradient(45deg, rgba(15,23,42,0.035) 0 1px, transparent 1px 9px)",
};

/* Learning-outcome icon token → icon set name. */
const OUTCOME_ICON: Record<string, IconName> = {
  code: "code",
  gauge: "gauge",
  layers: "layers",
  puzzle: "puzzle",
  rocket: "rocket",
  shield: "shield",
  sparkles: "sparkles",
  workflow: "workflow",
};

function outcomeIcon(token: string | null | undefined): IconName {
  return (token && OUTCOME_ICON[token]) || "sparkles";
}

async function getCourse(slug: string) {
  return sanityFetch<COURSE_BY_SLUG_QUERY_RESULT>({
    query: COURSE_BY_SLUG_QUERY,
    params: { slug },
  });
}

export async function generateStaticParams() {
  const slugs = await sanityFetch<COURSE_SLUGS_QUERY_RESULT>({
    query: COURSE_SLUGS_QUERY,
  });
  return slugs
    .filter((entry) => Boolean(entry.slug))
    .map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) return { title: "Course not found — Vertex" };
  return {
    title: `${course.title} — Vertex`,
    description: course.summary ?? undefined,
  };
}

export default async function CoursePage({ params }: { params: Params }) {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) notFound();

  const modules = course.modules ?? [];

  const moduleData: CurriculumModule[] = modules.map((mod, i) => {
    const lessons = mod.lessons ?? [];
    const moduleSeconds = lessons.reduce(
      (s, lesson) => s + secondsFrom(lesson.duration),
      0,
    );
    return {
      key: mod._key,
      number: i + 1,
      title: mod.title,
      summary: mod.summary,
      runtimeLabel: formatRuntime(moduleSeconds),
      lessons: lessons.map((lesson, j) => ({
        key: lesson._id,
        label: `Lesson ${i + 1}.${j + 1}`,
        title: lesson.title,
        href: `/lessons/${lesson.slug}`,
        durationLabel: formatClock(secondsFrom(lesson.duration)),
        freePreview: Boolean(lesson.freePreview),
      })),
    };
  });

  const courseSeconds = modules.reduce(
    (sum, mod) =>
      sum +
      (mod.lessons ?? []).reduce(
        (s, lesson) => s + secondsFrom(lesson.duration),
        0,
      ),
    0,
  );
  const runtimeLabel = formatRuntime(courseSeconds);
  const moduleCount = course.moduleCount ?? modules.length;
  const moduleCountLabel = `${moduleCount} module${moduleCount === 1 ? "" : "s"}`;

  const firstLessonSlug = modules
    .flatMap((mod) => mod.lessons ?? [])
    .find((lesson) => lesson.slug)?.slug;
  const continueHref = firstLessonSlug ? `/lessons/${firstLessonSlug}` : "#";

  const level = titleCase(course.level);
  const students = formatCount(course.studentCount);

  const meta: { icon: IconName; text: string }[] = [];
  if (level) meta.push({ icon: "chart", text: level });
  if (runtimeLabel) meta.push({ icon: "clock", text: runtimeLabel });
  if (moduleCount) meta.push({ icon: "file", text: moduleCountLabel });
  if (students) meta.push({ icon: "users", text: `${students} students` });

  const coverAsset = course.coverImage?.asset;
  const coverUrl = coverAsset
    ? urlFor(coverAsset._id).width(680).height(680).fit("crop").url()
    : null;
  const coverLqip = coverAsset?.metadata?.lqip ?? undefined;

  const outcomes = course.learningOutcomes ?? [];

  return (
    <div className="min-h-full overflow-x-hidden" style={paper}>
      <SiteHeader active="courses" />

      <main className="mx-auto max-w-[1440px] px-6 pb-24">
        <div className="mx-auto max-w-[960px]">
          <Breadcrumbs
            className="py-6"
            items={[
              { label: "All Courses", href: "/courses" },
              { label: course.title },
            ]}
          />

          {/* Hero */}
          <section className="grid gap-8 lg:grid-cols-[320px_1fr] lg:gap-12">
            <div className="relative aspect-square w-full max-w-[320px] overflow-hidden rounded-xl bg-neutral-900">
              {coverUrl ? (
                <Image
                  src={coverUrl}
                  alt={course.coverImage?.alt || course.title}
                  fill
                  sizes="(min-width: 1024px) 320px, 100vw"
                  className="object-cover"
                  placeholder={coverLqip ? "blur" : "empty"}
                  blurDataURL={coverLqip}
                  priority
                />
              ) : (
                <span className="absolute inset-0 grid place-items-center font-display text-[5rem] font-bold text-white">
                  {course.title.charAt(0)}
                </span>
              )}
            </div>

            <div>
              {course.popular && (
                <Badge tone="popular" className="bg-primary-100">
                  Popular
                </Badge>
              )}
              <h1 className="mt-4 font-display text-[2.5rem] font-bold leading-[1.1] text-neutral-900 sm:text-[3rem]">
                {course.title}
              </h1>
              {course.summary && (
                <p className="mt-4 max-w-xl text-body-lg text-neutral-500">
                  {course.summary}
                </p>
              )}

              {meta.length > 0 && (
                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
                  {meta.map((item) => (
                    <span
                      key={item.text}
                      className="inline-flex items-center gap-2 text-small text-neutral-500"
                    >
                      <Icon name={item.icon} size={16} />
                      {item.text}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={continueHref} className={buttonVariants("primary")}>
                  Continue Learning
                  <Icon name="arrow-right" size={18} />
                </Link>
                <Button variant="secondary">
                  <Icon name="bookmark" size={18} />
                  Bookmark
                </Button>
              </div>
            </div>
          </section>

          {/* What you'll learn */}
          {outcomes.length > 0 && (
            <section className="mt-14 rounded-xl border border-neutral-200 bg-white/60 p-8">
              <h2 className="font-display text-heading-1 font-bold text-neutral-900">
                What you&rsquo;ll learn
              </h2>
              <div className="mt-6 grid gap-x-10 gap-y-8 sm:grid-cols-2">
                {outcomes.map((outcome) => (
                  <div key={outcome._key} className="flex gap-4">
                    <Icon
                      name={outcomeIcon(outcome.icon)}
                      size={28}
                      className="mt-0.5 text-primary-500"
                    />
                    <div>
                      <h3 className="text-heading-3 font-semibold text-neutral-900">
                        {outcome.title}
                      </h3>
                      {outcome.description && (
                        <p className="mt-1 text-body text-neutral-500">
                          {outcome.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Course content */}
          {moduleData.length > 0 && (
            <section className="mt-16">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <h2 className="font-display text-heading-1 font-bold text-neutral-900">
                  Course Content
                </h2>
                <p className="text-small text-neutral-500">
                  {moduleCountLabel}
                  {runtimeLabel ? ` · ${runtimeLabel}` : ""}
                </p>
              </div>
              <div className="mt-6">
                <CourseCurriculum modules={moduleData} />
              </div>
            </section>
          )}

          {/* Progress (presentational shell — wired to real progress later) */}
          <div className="sticky bottom-4 z-20 mt-16">
            <div className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-4 shadow-lg sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <p className="text-small font-medium text-neutral-500">
                  Your Progress
                </p>
                <ProgressBar value={0} className="mt-1.5" />
              </div>
              <Link
                href={continueHref}
                className={buttonVariants("primary", "shrink-0")}
              >
                Start Learning
                <Icon name="arrow-right" size={18} />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
