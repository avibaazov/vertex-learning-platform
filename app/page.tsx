import type { CSSProperties, ReactNode } from "react";
import { Icon, VertexLogo } from "@/components/icons";
import { Button, CourseCard, Input, Kbd } from "@/components/ui";

/* ============================================================
   Brand art (local to the home page)
   ============================================================ */

function DockerMark() {
  return (
    <svg
      viewBox="0 0 48 48"
      width={36}
      height={36}
      aria-hidden="true"
      fill="#2496ED"
    >
      <rect x="12" y="14" width="6" height="6" rx="1" />
      <rect x="19" y="14" width="6" height="6" rx="1" />
      <rect x="26" y="14" width="6" height="6" rx="1" />
      <rect x="19" y="7" width="6" height="6" rx="1" />
      <rect x="12" y="21" width="6" height="6" rx="1" />
      <rect x="19" y="21" width="6" height="6" rx="1" />
      <rect x="26" y="21" width="6" height="6" rx="1" />
      <rect x="33" y="21" width="6" height="6" rx="1" />
      <path d="M5 28h34c0 6.2-4.4 11-12.5 11H16.5C9.4 39 5 33.2 5 28Z" />
      <path d="M39.5 25.8c1.5-2 1-4.1 0-5.3 2.1.5 3.2 2.7 2.6 4.8 1 .5 2.1.3 2.7-.6-.3 2.2-2.6 3.2-5.3 1.1Z" />
    </svg>
  );
}

function Avatar() {
  return (
    <a
      href="#"
      aria-label="Your account"
      className="block rounded-full ring-1 ring-neutral-200"
    >
      <svg viewBox="0 0 36 36" className="h-9 w-9 rounded-full" aria-hidden="true">
        <circle cx="18" cy="18" r="18" fill="var(--color-primary-100)" />
        <circle cx="18" cy="14.5" r="6" fill="var(--color-primary-300)" />
        <path
          d="M5.5 33c1.7-7.2 6.7-10.5 12.5-10.5S28.8 25.8 30.5 33Z"
          fill="var(--color-primary-300)"
        />
      </svg>
    </a>
  );
}

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
   Header
   ============================================================ */

function Header() {
  return (
    <header className="border-b border-neutral-200 bg-[#F7F4F1]">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <a href="#" aria-label="Vertex home">
            <VertexLogo />
          </a>
          <nav className="hidden items-center gap-8 text-body font-medium sm:flex">
            <a href="#" aria-current="page" className="text-neutral-900">
              Courses
            </a>
            <a
              href="#"
              className="text-neutral-700 transition-colors hover:text-neutral-900"
            >
              My Learning
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Notifications"
            className="text-neutral-700 transition-colors hover:text-neutral-900"
          >
            <Icon name="bell" size={22} />
          </button>
          <Avatar />
        </div>
      </div>
    </header>
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

type HomeCourse = {
  title: string;
  description: string;
  glyph: ReactNode;
  glyphClassName: string;
  level: string;
  duration: string;
  modules: string;
};

const courses: HomeCourse[] = [
  {
    title: "Next.js for Production",
    description:
      "Build scalable, high-performance web applications with Next.js.",
    glyph: "N",
    glyphClassName: "bg-neutral-900 text-white",
    level: "Intermediate",
    duration: "18h 24m",
    modules: "12 modules",
  },
  {
    title: "Docker Essentials",
    description:
      "Containerize applications and streamline your development workflow.",
    glyph: <DockerMark />,
    glyphClassName: "bg-transparent",
    level: "Beginner",
    duration: "10h 12m",
    modules: "8 modules",
  },
  {
    title: "TypeScript Deep Dive",
    description: "Go beyond the basics and write safer, more expressive code.",
    glyph: "TS",
    glyphClassName: "bg-[#3178C6] text-white text-body font-bold",
    level: "Intermediate",
    duration: "14h 36m",
    modules: "10 modules",
  },
];

function AllCourses() {
  return (
    <section className="py-14">
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-display text-[1.9rem] font-bold text-neutral-900">
          All Courses
        </h2>
        <a
          href="#"
          className="inline-flex items-center gap-1.5 text-body font-medium text-primary-500 transition-colors hover:text-primary-400"
        >
          View all courses
          <Icon name="arrow-right" size={16} />
        </a>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course.title} {...course} />
        ))}
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

export default function Home() {
  const paper: CSSProperties = {
    background: "#F7F4F1",
    backgroundImage:
      "repeating-linear-gradient(45deg, rgba(15,23,42,0.035) 0 1px, transparent 1px 9px)",
  };

  return (
    <div className="min-h-full overflow-x-hidden" style={paper}>
      <Header />
      <main className="mx-auto max-w-[1440px] bg-[#F7F4F1] px-6 pb-4">
        <Hero />
        <div className="border-t border-neutral-200" />
        <AllCourses />
        <FooterStrip />
      </main>
      <HeroWaves />
    </div>
  );
}
