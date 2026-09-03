# Implementation prompt — Home "All Courses" trim + cover images + /courses catalog

## Goal
1. Home page shows **only the first 3** seeded courses; "View all courses" links to a
   new **`/courses` catalog page** that lists them all.
2. Course cards show the **course cover image** as a 16:9 banner, falling back to the
   current dark letter tile when a course has no image.
Keep it simple — reuse the existing grid/card, no redesign.

## Skills read
- None. Continues the approved `prompts/home-courses-wiring.md` work (read-wiring + a
  presentational route).

## Code / data inspected
- `app/page.tsx` — `Home` (async server) fetches `COURSES_QUERY` and renders
  `AllCourses({ courses })`, which maps every course onto `<CourseCard>` wrapped in
  `<Link href={/courses/<slug>}>`. "View all courses" is `<a href="#">`.
- `components/ui/card.tsx` — `CourseCard({ title, description, glyph, glyphClassName,
  level, duration, modules })`. Renders `<Card>` (`rounded-lg border bg-white p-5`,
  no `overflow-hidden`) with a 48px glyph tile, title, description, and a `chart`/
  `clock`/`file` meta row (`mt-auto`, so it pins to the card bottom). Only consumer is
  `app/page.tsx`.
- `sanity/queries/courses.ts` — `COURSES_QUERY` returns per course incl.
  `coverImage { "alt", asset->{ _id, url, metadata { lqip, dimensions } } }`,
  `moduleCount`, `durationSeconds`, `level`, `summary`, `slug`, `_id`.
- `sanity/lib/image.ts` — `urlFor(source)`. `sanity/lib/fetch.ts` — `sanityFetch<T>({query})`.
- `lib/format.ts` — `formatRuntime`, `titleCase`.
- `app/courses/[slug]/page.tsx` — course detail; breadcrumb currently links
  "All Courses" → `/`. `app/courses/[slug]/not-found.tsx` — "Browse all courses" → `/`.
- `next.config.ts` — `images.remotePatterns` allows `cdn.sanity.io`.
- Seed: 10 courses, each has a `coverImage` (picsum asset) uploaded to `cdn.sanity.io`.

## Decisions & assumptions
- **New `components/course/course-grid.tsx`** (server): `CourseGrid({ courses:
  COURSES_QUERY_RESULT })` renders the responsive grid (`sm:grid-cols-2
  lg:grid-cols-3`, `gap-6`) of `<Link href={/courses/<slug>}><CourseCard/></Link>`,
  doing the course→props mapping (incl. `urlFor(asset._id).width(640).height(360)
  .fit('crop').url()` and `metadata.lqip`) in one place. Returns `null` when empty.
  Both the home page and `/courses` use it.
- **`CourseCard`** gains optional `imageUrl?`, `imageAlt?`, `imageLqip?`. When
  `imageUrl` is set it renders a `next/image` (`fill`, `object-cover`,
  `placeholder="blur"` when lqip) inside
  `<div class="relative -mx-5 -mt-5 aspect-[16/9] overflow-hidden rounded-t-lg
  bg-neutral-900">` — negative margins bleed it to the card edges past `Card`'s `p-5`,
  `rounded-t-lg` matches `Card`'s radius. When `imageUrl` is absent it renders the
  existing 48px glyph tile unchanged. Card stays `flex h-full flex-col gap-4`, so the
  meta row still pins to the bottom and cards stay equal height.
- **`app/page.tsx`**: `AllCourses` renders the heading + `<CourseGrid courses={courses
  .slice(0, 3)} />`. "View all courses" becomes `<Link href="/courses">`. Drop the
  now-unused `CourseCard` / `formatRuntime` / `titleCase` imports (moved into
  `CourseGrid`); the fetch, ordering (`popular desc, title asc`), and the rest of the
  page are unchanged. Top 3 = the 3 highest-priority courses from the existing order.
- **New `app/courses/page.tsx`** (async server, static metadata): paper background +
  `<SiteHeader active="courses" />`, an `<h1>All Courses</h1>` with an "N courses"
  subline, then `<CourseGrid courses={courses} />` for all of them. No filters, no
  pagination, no breadcrumb — "keep it simple". Coexists with `app/courses/[slug]/`.
- **Breadcrumb consistency**: point the course-detail breadcrumb "All Courses" and the
  course not-found "Browse all courses" at `/courses` instead of `/`.
- Leave the `SiteHeader` "Courses" nav link at `/` (home) — out of scope to change nav
  semantics here.

## Files to touch
- `components/course/course-grid.tsx` — NEW. Shared linked grid + mapping.
- `components/ui/card.tsx` — `CourseCard`: optional cover-image banner + `next/image`.
- `app/page.tsx` — slice to 3, use `CourseGrid`, "View all courses" → `/courses`,
  prune imports.
- `app/courses/page.tsx` — NEW. Catalog listing all courses.
- `app/courses/[slug]/page.tsx` — breadcrumb href → `/courses`.
- `app/courses/[slug]/not-found.tsx` — link href → `/courses`.
- `prompts/courses-catalog-and-cards.md` — this file.

## Requirements
- Home "All Courses" shows exactly 3 cards; "View all courses" navigates to `/courses`.
- `/courses` lists every seeded course in the same card grid, each linking to its
  detail page.
- Each card shows its seeded `coverImage` as a 16:9 top banner; courses without an
  image fall back to the letter tile. No layout break, cards stay equal height.
- No `CourseCard` behaviour change when `imageUrl` is not passed.
- No new dependencies.

## Security considerations
- All fetches run in server components via the `server-only` client; no token to the
  browser. Images restricted to `cdn.sanity.io` (already configured). No user input,
  no writes, no `dangerouslySetInnerHTML`.

## Acceptance criteria
- `/` renders 3 course cards, each with a cover image, and a working "View all
  courses" link.
- `/courses` renders 10 course cards; clicking one opens `/courses/<slug>`.
- `/courses/<slug>` breadcrumb "All Courses" and the not-found page's button both go
  to `/courses`.
- `npx tsc --noEmit`, `npm run lint`, `npm run build` pass.

## Checks to run (AGENTS.md §13, web)
1. `npx tsc --noEmit`
2. `npm run lint`
3. `npm run build` (new route)
4. `npm run dev` — eyeball `/` and `/courses`.

## Manual test steps
1. `npm run dev`; open `http://localhost:3000/`.
2. "All Courses" shows 3 cards, each with a cover photo, level · runtime · modules,
   equal height; meta rows aligned.
3. Click "View all courses" → `/courses` with all 10 cards.
4. Click a card → its `/courses/<slug>` page; breadcrumb "All Courses" → back to
   `/courses`.
5. Visit `/courses/does-not-exist` → not-found; "Browse all courses" → `/courses`.
6. Resize to ~375px: single column, images scale, no horizontal scroll.
