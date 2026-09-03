# Implementation prompt — Vertex home page

## Goal
Replace the current design-system showcase at `app/page.tsx` with the **Vertex home page**, reproducing `desgin/vertex-home.png` exactly on desktop and degrading sensibly to mobile. Presentational only — no data, auth, or analytics wiring (out of scope per AGENTS.md §1/§7).

## Skills read
None required — this is pure UI work (AGENTS.md §3). Read the bundled Next.js docs for App Router page/image conventions (`node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`, `12-images.md`).

## Code inspected
- `app/page.tsx` — current content is a design-system showcase; will be fully replaced.
- `app/layout.tsx` — root layout, Inter + Playfair via `next/font`, `--font-*` vars. Metadata still says "Design System".
- `app/globals.css` — Tailwind v4 `@theme` tokens: `primary-100..500`, `neutral-50..900`, `text-display-1/2`, `text-heading-1..3`, `text-body(-lg)`, `text-small`, `radius-*`, `shadow-*`, `font-display` (Playfair), `font-sans` (Inter).
- `components/icons.tsx` — `Icon` set (`bell`, `search`, `arrow-right`, `clock`, `chart`, `file`, `play`, …), `VertexLogo`. No `star` glyph.
- `components/ui/*` — `Navbar` (rounded card, not the full-bleed bordered bar in the design), `Button` (`primary` h-11), `Input` (`icon` + `trailing` slots), `Kbd`, `CourseCard` (fixed black glyph tile, `glyph?: string`), `Badge`.
- `lib/cn.ts` — `cn` class joiner.
- `public/` — no photo/avatar asset; `next.config.ts` has no `images.remotePatterns`.

## Decisions & assumptions
- **New file `components/home/*` not needed** — build page sections as local components inside `app/page.tsx`, matching the showcase file's existing style.
- **Header**: build inline (full-bleed `border-b`), not the rounded-card `Navbar`, because the design shows a borderless bar flush to the page edges. Links: "Courses" (active, `neutral-900`), "My Learning" (`neutral-700`). Right side: `bell` button + circular avatar.
- **Avatar**: no asset provided → inline SVG portrait placeholder on `bg-primary-100`, `h-9 w-9 rounded-full ring-1 ring-neutral-200`. Avoids `next/image` remote config.
- **Warm paper background**: the reference ground is a warm off-white, and there is no warm token. Use an inline `#F7F4F1` on the page wrapper plus a very faint 45° hatch (`repeating-linear-gradient`, ~0.4 opacity) confined to the side gutters. Cards stay `white`; dividers use `neutral-200`.
- **Hero heading**: Playfair bold, `text-[2.5rem] leading-[1.12] sm:text-[3.5rem]` (reference is ~56px, larger than `display-1`/48px). Two centered lines.
- **Pill**: `INTELLIGENT LEARNING`, `rounded-full border border-primary-200 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-500`.
- **Explore Courses**: `<Button variant="primary" className="h-12 px-6 text-body-lg">` + trailing `arrow-right` icon.
- **Search bar**: reuse `Input` with `icon` (search, size 20) + `trailing={<Kbd>⌘ K</Kbd>}`, `className="h-16 rounded-xl text-body-lg"` inside a `max-w-2xl` centered wrapper; wrapper carries `shadow-sm`.
- **CourseCard** — small extension so the three brand glyphs render:
  - `glyph?: ReactNode` (was `string`), new `glyphClassName?: string` (default `"bg-neutral-900 text-white"`).
  - Make card equal-height: outer `flex h-full flex-col`, meta row gets `mt-auto`. This matches the reference's equal-height cards and does not change the single caller.
  - Next.js → `glyph="N"` (default tile); Docker → `glyph={<DockerMark/>} glyphClassName="bg-transparent"`; TypeScript → `glyph="TS" glyphClassName="bg-[#3178C6] text-white text-body font-bold"`.
- **DockerMark**: inline simplified official Docker whale SVG in `#2496ED`, ~34px, local to `app/page.tsx`.
- **`star` icon**: add one outline path to `components/icons.tsx` (`IconName` union + `outline` map) for the "New courses…" strip.
- **HeroWaves**: decorative equalizer at page bottom — array of ~28 bars, varied heights from a fixed pattern, each filled `linear-gradient(to bottom, var(--color-primary-300), transparent)`, container `[mask-image:linear-gradient(to_bottom,black,transparent)]`, `aria-hidden`, `pointer-events-none`.
- **Metadata**: update `app/layout.tsx` title → `"Vertex — Search your learning in plain English"`, description → hero subcopy.
- Links are `#` placeholders (`next/link` not needed yet — no other routes exist).

## Files to touch
- `app/page.tsx` — replace entirely with the home page (header, hero, All Courses, footer strip, waves).
- `components/ui/card.tsx` — widen `CourseCard` glyph to `ReactNode`, add `glyphClassName`, equal-height layout.
- `components/icons.tsx` — add `star` outline icon.
- `app/layout.tsx` — metadata copy only.
- `prompts/home-page.md` — this file.

## Requirements
- Desktop layout matches the reference: spacing, type, color, the centered hero, 3-up course grid, footer strip, and bottom wave art.
- Content column `mx-auto max-w-5xl px-6`; header bar full-bleed with inner `max-w-5xl`.
- Responsive: nav links hide below `sm`; course grid `grid-cols-1 → sm:grid-cols-2 → lg:grid-cols-3`; hero scales down; no horizontal scroll.
- Reuse existing tokens/components; no new deps.
- All interactive elements are real `<button>`/`<a>` with `aria-label` where icon-only.

## Security considerations
- None. Static page, no user input handling, no secrets, no external requests, no `dangerouslySetInnerHTML`.

## Acceptance criteria
- `app/page.tsx` renders the Vertex home page (no showcase panels remain).
- Three course cards: Next.js for Production / Docker Essentials / TypeScript Deep Dive with the copy and meta (level · duration · modules) from the reference.
- Search field shows the search glyph, the "Ask anything about your learning…" placeholder, and a `⌘ K` hint.
- Page has no console errors; `next/image` config untouched.

## Checks to run (AGENTS.md §13, web workspace)
1. `npx tsc --noEmit` — type check.
2. `npm run lint`.
3. `npm run build` — routes/metadata changed.
4. `npm run dev` and eyeball `/` against the reference.

## Manual test steps
1. `npm run dev`, open `http://localhost:3000`.
2. Confirm header: Vertex logo, "Courses"/"My Learning", bell, avatar.
3. Confirm hero: pill, two-line Playfair headline, subcopy, orange "Explore Courses" button with arrow, large search bar with `⌘ K`.
4. Confirm "All Courses" row with "View all courses" link and the 3 cards (equal height, meta pinned to the bottom).
5. Confirm the "New courses and lessons added every week." strip with star + rules, and the orange wave art fading out at the bottom.
6. Resize to ~375px: columns stack, nav links drop, nothing overflows horizontally.
