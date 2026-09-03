import type { CSSProperties } from "react";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { SiteHeader } from "@/components/site-header";
import { CourseGrid } from "@/components/course/course-grid";
import { Button, Input, Kbd } from "@/components/ui";
import { sanityFetch } from "@/sanity/lib/fetch";
import { COURSES_QUERY } from "@/sanity/queries";
import type { COURSES_QUERY_RESULT } from "@/sanity.types";

const HOME_COURSE_COUNT = 3;

const WAVE = [
  26, 44, 68, 36, 86, 58, 32, 78, 50, 94, 42, 28, 0, 0, 32, 62, 40, 88, 52, 100,
  38, 72, 30, 56, 84, 46, 24, 50,
];

function HeroWaves() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative left-1/2 mt-16 h-44 w-screen max-w-[100vw] -translate-x-1/2 overflow-hidden [mask-image:linear-gradient(to_bottom,black,transparent)]"
    >
      <div className="mx-auto flex h-full max-w-[1440px] items-end gap-1.5 px-6">
        {WAVE.map((h, i) => (
          <span
            key={i}
            className="flex-1 rounded-t-sm"
            style={{
              height: `${h}%`,
              background:
                "linear-gradient(to bottom, var(--color-primary-300), var(--color-primary-200) 45%, transparent)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   Hero
   ============================================================ */

function Hero() {
  return (
    <section className="py-16 text-center sm:py-24">
      <span className="inline-flex items-center rounded-full border border-primary-200 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-500">
        Intelligent Learning
      </span>

      <h1 className="mx-auto mt-8 max-w-3xl font-display text-[2.5rem] font-bold leading-[1.12] text-neutral-900 sm:text-[3.5rem]">
        Search your learning in plain English.
      </h1>

      <p className="mx-auto mt-5 max-w-xl text-body-lg text-neutral-500">
        Vertex understands what you want to learn and finds the exact lessons
        across all your courses.
      </p>

      <div className="mt-9">
        <Button variant="primary" className="h-12 px-6 text-body-lg">
          Explore Courses
          <Icon name="arrow-right" size={18} />
        </Button>
      </div>

      <div className="mx-auto mt-10 max-w-2xl">
        <Input
          type="search"
          placeholder="Ask anything about your learning…"
          aria-label="Ask anything about your learning"
          icon={<Icon name="search" size={20} className="text-neutral-500" />}
          trailing={
            <Kbd>
              <span aria-hidden="true">⌘</span> K
            </Kbd>
          }
          className="h-16 rounded-xl pl-12 text-body-lg shadow-sm"
        />
      </div>
    </section>
  );
}

/* ============================================================
   All Courses
   ============================================================ */

function AllCourses({ courses }: { courses: COURSES_QUERY_RESULT }) {
  return (
    <section className="py-14">
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-display text-[1.9rem] font-bold text-neutral-900">
          All Courses
        </h2>
        <Link
          href="/courses"
          className="inline-flex items-center gap-1.5 text-body font-medium text-primary-500 transition-colors hover:text-primary-400"
        >
          View all courses
          <Icon name="arrow-right" size={16} />
        </Link>
      </div>

      <div className="mt-8">
        <CourseGrid courses={courses.slice(0, HOME_COURSE_COUNT)} />
      </div>
    </section>
  );
}

/* ============================================================
   Footer strip
   ============================================================ */

function FooterStrip() {
  return (
    <div className="flex items-center gap-4 pt-8 text-body text-neutral-500">
      <span className="h-px flex-1 bg-neutral-200" />
      <Icon name="star" size={16} className="text-primary-500" />
      <span>New courses and lessons added every week.</span>
      <span className="h-px flex-1 bg-neutral-200" />
    </div>
  );
}

/* ============================================================
   Page
   ============================================================ */

export default async function Home() {
  const paper: CSSProperties = {
    background: "#F7F4F1",
    backgroundImage:
      "repeating-linear-gradient(45deg, rgba(15,23,42,0.035) 0 1px, transparent 1px 9px)",
  };

  const courses = await sanityFetch<COURSES_QUERY_RESULT>({
    query: COURSES_QUERY,
  });

  return (
    <div className="min-h-full overflow-x-hidden" style={paper}>
      <SiteHeader active="courses" />
      <main className="mx-auto max-w-[1440px] bg-[#F7F4F1] px-6 pb-4">
        <Hero />
        <div className="border-t border-neutral-200" />
        <AllCourses courses={courses} />
        <FooterStrip />
      </main>
      <HeroWaves />
    </div>
  );
}
