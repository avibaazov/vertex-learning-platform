# Implementation prompt — Vertex course detail page

## Goal
Build the **course detail page** at `app/courses/[slug]/page.tsx`, reproducing
`desgin/vertex-course.png` on desktop and degrading sensibly to mobile, wired to
the **seeded Sanity content** through the existing server-only read layer. Read
only — no auth gating, no progress backend, no analytics (all separate tasks per
AGENTS.md §1/§7).

## Skills read
- None invoked. This is UI + read-wiring (AGENTS.md §3/§5). Consulted bundled Next
  docs: `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`
  (PageProps helper, `PageProps<'/courses/[slug]'>`), `.../03-api-reference/04-functions/generate-static-params.md`.

## Code / data inspected
- `app/page.tsx` — home page. Declares a local `Header` + `AuthControls` (Clerk
  `Show`/`SignInButton`/`UserButton`), warm `#F7F4F1` paper background with a 45°
  hatch, `max-w-[1440px]` content column, `HeroWaves`. Header links are `#`.
- `app/layout.tsx` — `ClerkProvider`, Inter + Playfair via `next/font` (`--font-inter`,
  `--font-playfair`).
- `app/globals.css` — Tailwind v4 `@theme` tokens: `primary-100..500`, `neutral-50..900`,
  `text-display-1/2`, `text-heading-1..3`, `text-body(-lg)`, `text-small`, `radius-*`,
  `shadow-*`, `font-display` (Playfair), `font-sans` (Inter). No warm/paper token.
- `components/ui/*` — `Button` (`primary`/`secondary`/`tertiary`/`text`, renders a
  `<button>`, `h-11`), `Badge` (`tone="popular"` = outlined primary pill), `Breadcrumbs`
  (`items: {label, href?}[]`, last = current), `ProgressBar` (`value` 0–100, `showLabel`),
  `Card`. Barrel at `components/ui/index.ts`.
- `components/icons.tsx` — `Icon` (24px grid, 2px stroke) + `IconName` union +
  `outline`/`filled` maps, `VertexLogo`. Has `chart`, `clock`, `file`, `bookmark`,
  `chevron-down`, `play`, `arrow-right`, `user` (single). **Missing**: `users`, and the
  learning-outcome glyphs.
- `lib/cn.ts` — `cn` class joiner.
- `sanity/lib/fetch.ts` — `sanityFetch({query, params, revalidate=60, tags})`, `server-only`.
- `sanity/lib/client.ts` — server-only read client, token from `SANITY_API_READ_TOKEN`,
  `perspective: 'published'`. `sanity/lib/image.ts` — `urlFor`.
- `sanity/queries/courses.ts` — **`COURSE_BY_SLUG_QUERY` already returns everything this
  page needs**: `_id, title, slug, summary, level, price, popular, studentCount,
  coverImage{alt,asset->{url,metadata}}, instructor{...}, category{...}, moduleCount,
  lessonCount, learningOutcomes[]{_key,icon,title,description},
  modules[]{_key,title,summary,lessons[]->{_id,title,slug,duration,freePreview,
  studentCount,keyPoints,poster}}`. Also `COURSE_SLUGS_QUERY` → `{slug}[]`.
- `sanity.types.ts` — `COURSE_BY_SLUG_QUERY_RESULT` / `COURSE_SLUGS_QUERY_RESULT` are
  already generated and exported. **No query or TypeGen change is required.**
- Seed (`studio/seed/seed.ndjson`, already imported — `verify-read` shows course 10 /
  lesson 120 / instructor 5 / category 6):
  - `lesson.duration` is stored as an **integer number of seconds** (e.g. `350`), even
    though the schema types it `string`. TypeGen therefore says `string | null` but the
    runtime value is a number → format defensively with `Number(v)`.
  - `course.level` values are **lowercase** (`"intermediate"`); TypeGen says
    `"Beginner"|"Intermediate"|"Advanced"` → title-case for display.
  - Learning-outcome `icon` tokens present across courses: `code, gauge, layers, puzzle,
    rocket, shield, sparkles, workflow`.
  - Course total runtime and per-module runtime are **not stored** → derive by summing
    lesson `duration`s (AGENTS.md §8: numbers shown in the UI are derived from order/data).
  - Lessons use a `thumbnail` field in the seed, not the schema's `poster` — irrelevant
    here (the course page shows no lesson thumbnails).
  - Test course: `nextjs-app-router-in-depth` — popular, level `intermediate`,
    studentCount `18240`, 4 modules × 3 lessons, total ≈ `1h 59m`.
- `next.config.ts` — `images.remotePatterns` already allows `cdn.sanity.io`.
- No `middleware.ts` yet; browsing is public (AGENTS.md §7) — this page needs no gate.

## Decisions & assumptions
- **Route**: `app/courses/[slug]/page.tsx`, `async` server component, typed with
  `PageProps<'/courses/[slug]'>` (await `params`). Add `generateStaticParams` from
  `COURSE_SLUGS_QUERY` and `generateMetadata` (title = course title, description =
  summary). `notFound()` when the course is null, with a local
  `app/courses/[slug]/not-found.tsx`.
- **Fetch**: `sanityFetch({ query: COURSE_BY_SLUG_QUERY, params: { slug } })`. No new
  query, no TypeGen run.
- **Shared header**: extract the home page's `Header` + `AuthControls` into
  `components/site-header.tsx` (`<SiteHeader active="courses" | "learning" />`), convert
  its logo/"Courses" links to `next/link` → `/`, keep "My Learning" as `#` (no route
  yet). Update `app/page.tsx` to render `<SiteHeader active="courses" />` and drop its
  local copies. Behaviour/appearance unchanged on the home page.
- **Cover art** (per user): render the seeded `coverImage` via `urlFor(...).width(680).height(680).fit('crop').url()` in a `next/image` with `metadata.lqip` as `blurDataURL`. If a course has no `coverImage`, fall back to a dark tile showing the course title's first letter (Playfair, like the mock). Rounded `rounded-xl`, square-ish, `~320px` on desktop.
- **Meta row**: `chart` → title-cased level; `clock` → derived total runtime
  (`formatRuntime`); `file` → `{moduleCount} modules`; `users` (new icon) →
  `{formatCount(studentCount)} students`. Any missing datum is omitted, not faked.
- **CTAs in the hero**: "Continue Learning" is a `next/link` styled as a primary button
  pointing at `/lessons/<first lesson slug>` (per user — correct once the lesson page
  lands; 404s until then). "Bookmark" is an inert presentational `<Button variant="secondary">`
  with the `bookmark` icon (no bookmark backend — AGENTS.md §7).
  - To style a `Link` as a button without duplicating classes, refactor
    `components/ui/button.tsx` to export a `buttonVariants(variant, className?)` helper
    (the `base + variants[variant]` string); `Button` keeps its exact current output.
- **"What you'll learn"**: outer `Card` wrapper containing the section title and a
  `sm:grid-cols-2` grid of outcome items (icon tile + title + description). Map the
  `icon` token → `IconName` via a small local `OUTCOME_ICON` record; unknown tokens fall
  back to `sparkles`. Icons render in `text-primary-500`.
- **Icons to add to `components/icons.tsx`** (outline only, 24px/2px, simple geo paths):
  `users`, `code`, `gauge`, `layers`, `puzzle`, `rocket`, `shield`, `sparkles`,
  `workflow`. Extend the `IconName` union and the `outline` map only.
- **Course Content**: heading + right-aligned `{moduleCount} modules · {formatRuntime(total)}`.
  Curriculum is a client component `components/course/curriculum.tsx` (`'use client'`):
  - Props are plain serialisable data: `modules: { key, index, title, summary,
    runtimeLabel, lessons: { key, label, title, slug, durationLabel, freePreview }[] }[]`,
    computed on the server.
  - Each module row: a numbered circle (with a connecting vertical rail behind the
    circles), title, summary, `runtimeLabel`, and a `chevron-down` that rotates when open.
  - Clicking a row toggles it open, revealing its lessons — each `Lesson {m}.{n}` label,
    title, `durationLabel`, a `Free preview` `Badge` when `freePreview`, linking to
    `/lessons/<slug>`.
  - When `modules.length > 6`, collapse to the first 6 with a centered
    "Show all {n} modules" / "Show fewer" toggle button (matches the mock; seeded courses
    have 4 modules so it stays hidden for them).
- **Sticky progress bar** (per user — presentational shell at 0%): a `sticky bottom-4`
  rounded card, `shadow-lg`, containing "Your Progress" + `<ProgressBar value={0} />`
  ("0% complete") and a `next/link` primary button "Start Learning" →
  `/lessons/<first lesson slug>`. Server-rendered, no state. Rewire to real progress in
  the progress-tracking task.
- **Formatting helpers** — new `lib/format.ts`:
  - `formatRuntime(totalSeconds)` → `"1h 59m"`, `"45m"`, `"2h"` (drop `0m`), `null` for
    non-positive/NaN.
  - `formatCount(n)` → `Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 })`
    lower-cased (`18240` → `"18.2k"`).
  - `titleCase(s)` → capitalise first letter.
  - `secondsFrom(v: string | number | null | undefined)` → `Number(v)` guarded to a
    finite ≥ 0, else 0 (absorbs the schema/seed type mismatch in one place).
- **Layout / background**: reuse the home page's `#F7F4F1` paper wrapper + hatch and
  `max-w-[1440px] px-6` column. Content sub-column `max-w-[960px] mx-auto` to match the
  mock's centered body. No `HeroWaves` on this page.
- **Responsive**: hero is `lg:grid-cols-[320px_1fr]`, stacks below `lg` (image first);
  outcomes `grid-cols-1 → sm:grid-cols-2`; module row meta wraps under the title on
  mobile; sticky bar stacks label over button on narrow; no horizontal scroll.
- Instructor/category are returned by the query but the reference shows neither on this
  page, so neither is rendered (AGENTS.md §3 — the image is the source of truth).

## Files to touch
- `app/courses/[slug]/page.tsx` — NEW. Server page, `generateStaticParams`,
  `generateMetadata`, data fetch, all static sections, server-side per-module/total
  runtime computation.
- `app/courses/[slug]/not-found.tsx` — NEW. Minimal "course not found" with a link home.
- `components/site-header.tsx` — NEW. Extracted shared header + `AuthControls`, `active`
  prop, `next/link` nav.
- `app/page.tsx` — use `<SiteHeader active="courses" />`; remove local `Header` /
  `AuthControls`. No visual change.
- `components/icons.tsx` — add the 9 outline icons + union entries.
- `components/course/curriculum.tsx` — NEW. `'use client'` accordion + show-all toggle.
- `components/ui/button.tsx` — export `buttonVariants(variant, className?)`; `Button`
  reuses it (output identical).
- `lib/format.ts` — NEW. `formatRuntime`, `formatCount`, `titleCase`, `secondsFrom`.
- `prompts/course-page.md` — this file.

## Requirements
- Desktop matches `desgin/vertex-course.png`: breadcrumb, split hero (cover + title
  block), POPULAR badge, meta row with 4 items, primary + secondary CTAs, "What you'll
  learn" card with a 2×2 outcome grid, "Course Content" with numbered connected module
  rows + per-module runtime + chevrons, and the sticky "Your Progress" bar.
- Every rendered value comes from the seeded course (or is derived from it). Nothing is
  invented; missing optional fields are omitted gracefully.
- Reuse existing tokens/components; the only new primitives are the 9 icons and the
  `buttonVariants` export. No new dependencies.
- Icon-only controls have `aria-label`; the accordion uses real `<button>`s with
  `aria-expanded`; `next/image` gets `alt` + `sizes`.
- `/courses/<unknown>` renders the not-found page.

## Security considerations
- All Sanity reads go through `sanityFetch` / the `server-only` client; the read token
  never reaches the browser (AGENTS.md §12).
- The client component `curriculum.tsx` receives only derived course text (titles,
  slugs, duration labels) — no tokens, no PII, no raw documents.
- No `dangerouslySetInnerHTML`, no Portable Text on this page, no user input, no writes.
- Images are restricted to `cdn.sanity.io` (already configured).

## Acceptance criteria
- `/courses/nextjs-app-router-in-depth` shows: breadcrumb `All Courses / Next.js App
  Router in Depth`; the seeded cover image; `POPULAR`; the title in Playfair; the
  summary; meta `Intermediate · 1h 59m · 4 modules · 18.2k students`.
- "Continue Learning" and "Start Learning" link to `/lessons/<first lesson slug>` of the
  course (they 404 until the lesson page exists — expected/noted).
- "What you'll learn" lists the course's 4 outcomes with mapped orange icons.
- "Course Content" header reads `4 modules · 1h 59m`; four rows numbered 1–4 each with
  the module title, summary, and its own runtime; expanding a row reveals its lessons as
  `Lesson m.n` + title + duration, each linking to `/lessons/<slug>`.
- Sticky bar shows `0% complete` and a working "Start Learning" link.
- `/courses/does-not-exist` → not-found page.
- Home page (`/`) is visually unchanged after the header extraction.

## Checks to run (AGENTS.md §13 — web workspace)
1. `npx tsc --noEmit`
2. `npm run lint`
3. `npm run build` (new route + shared component)
4. `npm run dev` and eyeball `/courses/nextjs-app-router-in-depth` vs the reference,
   plus `/` for the header regression.

## Manual test steps
1. `npm run dev`; open `http://localhost:3000/courses/nextjs-app-router-in-depth`.
2. Header: Vertex logo, "Courses" active, "My Learning", bell, Clerk auth control.
3. Breadcrumb `All Courses` (→ `/`) ` / Next.js App Router in Depth` (current).
4. Hero: cover image left, `POPULAR` pill, Playfair title, summary, meta row
   (`Intermediate · 1h 59m · 4 modules · 18.2k students`), orange "Continue Learning →"
   and outlined "Bookmark".
5. Click "Continue Learning" → URL `/lessons/<first lesson slug>` (404 page for now — expected).
6. "What you'll learn": one `Card`, four outcome cells, each with an orange glyph, title,
   description.
7. "Course Content": right caption `4 modules · 1h 59m`; rows 1–4 with a connected
   number rail, titles, summaries, per-module runtime, chevrons.
8. Expand module 3 ("Data Fetching and Caching") → three lessons, `Lesson 3.1/3.2/3.3`,
   titles, durations; a `Free preview` badge on any free lesson; links go to
   `/lessons/<slug>`.
9. Sticky bar pinned at the bottom: "Your Progress", bar at `0% complete`, "Start
   Learning" button.
10. Open `http://localhost:3000/courses/does-not-exist` → "course not found".
11. Open `/` → home page identical to before.
12. Resize to ~375px: hero stacks (image first), outcomes single-column, module meta
    wraps, sticky bar stacks, no horizontal scroll.
