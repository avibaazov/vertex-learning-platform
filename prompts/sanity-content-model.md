# Implementation prompt — Sanity content model, standalone Studio, and web read layer

## Goal
Stand up the content backbone for Vertex:

1. A **standalone `studio/` workspace** (its own npm project) holding the Sanity schema and desk
   structure for the five content types in scope: `course`, `lesson`, `instructor`, `category`, and
   the embedded `module` object. No frontend code, no agent/search config, no video or progress
   documents (all out of scope per AGENTS.md §1/§8 — those are later tasks).
2. The **web read layer**: a server‑only Sanity client, a typed `sanityFetch` helper reading the
   private dataset with a token, reusable GROQ fragments, and typed queries for catalog / course /
   lesson / instructor / category. Plus TypeGen wiring so query results are typed.

Migrate away from the embedded Studio that is currently scaffolded (user decision: **split to
standalone `studio/`**, per AGENTS.md §5/§6 and `sanity-best-practices` → `nextjs.md` §5 /
`project-structure.md`).

No pages, no UI, no auth changes, no analytics. Pages/components already in `components/ui` (e.g.
`CourseCard`, `LessonCard`) are **not** touched — this task only makes their data available.

## Skills read
- `sanity-best-practices` → `SKILL.md`, `references/schema.md`, `references/nextjs.md`,
  `references/typegen.md`, `references/project-structure.md`, `references/groq.md`.
- AGENTS.md §5 (workspace split + boundaries), §6 (stack / do‑not list), §7 (grounded search,
  Portable Text not markdown, Clerk, private dataset), §8 (the data shapes — **authoritative** for
  the required fields/relationships), §12 (private dataset, token stays server‑side; Context MCP
  needs a *deployed* Studio), §13 (checks).
- Next.js bundled docs: `node_modules/next/dist/docs/01-app/...` for App Router server/client
  boundary and `fetch` caching (`03-api-reference/.../fetch`, `revalidateTag`). No routes are added
  here, so this is background only.
- Not needed: `create-agent-with-sanity-context` / `dial-your-context` / `shape-your-agent` — those
  are for the search task. The bundled ecommerce reference under
  `agent/skills/create-agent-with-sanity-context/references/ecommerce/` was used only as a *shape*
  reference for schema files, the studio `sanity.cli.ts` env pattern, and the GROQ fragment pattern.

## Code inspected
- `sanity.config.ts` (repo root) — embedded Studio config: `'use client'`, `basePath: '/studio'`,
  `structureTool` + `visionTool`, imports `./sanity/schemaTypes` (empty) and `./sanity/structure`.
- `sanity.cli.ts` (repo root) — `defineCliConfig` from `NEXT_PUBLIC_SANITY_*`.
- `app/studio/[[...tool]]/page.tsx` — `<NextStudio config={config} />` from `next-sanity/studio`.
- `sanity/env.ts` — exports `apiVersion` (default `'2026-09-03'`), `dataset`, `projectId` via
  `assertValue`. No token.
- `sanity/schemaTypes/index.ts` — `schema = { types: [] }` (empty).
- `sanity/structure.ts` — default `S.documentTypeListItems()`.
- `sanity/lib/client.ts` — `createClient` from `next-sanity`, `useCdn: true`, **no token**.
- `sanity/lib/live.ts` — `defineLive({ client })` exporting `sanityFetch` + `SanityLive`. Not
  rendered anywhere (`grep` for `<SanityLive` / `SanityLive` in `app/` → only this file).
- `sanity/lib/image.ts` — `urlFor` via `@sanity/image-url` (projectId/dataset only — client‑safe).
- `package.json` — deps: `@clerk/nextjs`, `@sanity/image-url`, `@sanity/vision`, `next 16.3.4`,
  `next-sanity ^13.3.4`, `react/react-dom 19.2.8`, `sanity ^5.31.2`, `styled-components ^6.5.3`.
  Scripts: `dev/build/start/lint` only.
- `.env.local` — `NEXT_PUBLIC_SANITY_DATASET="production"`, `NEXT_PUBLIC_SANITY_PROJECT_ID="f1xc8l6s"`,
  Clerk keys. **No `SANITY_API_READ_TOKEN`, no `SANITY_STUDIO_*`.**
- `.env.example` — **does not exist** (AGENTS.md §12 wants it committed and canonical).
- `.gitignore` — ignores `.env*` with no exception; ignores `*.tsbuildinfo`, `next-env.d.ts`.
- `tsconfig.json` — `include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ...]`, `paths: { "@/*": ["./*"] }`.
  Root‑level `sanity.types.ts` will be picked up by `**/*.ts` automatically.
- `proxy.ts` — Next 16 middleware (renamed from `middleware.ts`); `clerkMiddleware()` public‑by‑default.
  Matcher already excludes `_next` + static assets. **No change** (Studio route leaves the app, so no
  new matcher entry needed).
- `components/ui/card.tsx` — `CourseCard` needs `{title, description, level, duration, modules}`;
  `LessonCard`/`VideoLessonCard` need `{title, description, module|lesson, timestamp}`. Field names
  in the model are chosen to resolve to these cleanly.
- `app/page.tsx` — home page; uses only Clerk + `components/ui`. Does **not** import `sanity` or
  `styled-components`.
- `next.config.ts` — empty config (no `images.remotePatterns`).

## Decisions & assumptions

### Workspace split
- New `studio/` is a **standalone npm project** (its own `package.json` + `node_modules`), not an npm
  workspace. `project-structure.md`: "No workspace tooling is required — each app manages its own
  dependencies." This also avoids two React copies colliding under a hoisted root.
- Move into `studio/`: schema types, desk structure, `sanity.config.ts`, `sanity.cli.ts`. **Delete**
  from the web app: `app/studio/`, root `sanity.config.ts`, root `sanity.cli.ts`,
  `sanity/schemaTypes/`, `sanity/structure.ts`, `sanity/lib/live.ts`.
- Web keeps `next-sanity` (for `createClient` + `defineQuery`) and `@sanity/image-url`. **Remove**
  `sanity`, `@sanity/vision`, `styled-components` from web `package.json` (all only needed by the
  embedded Studio; confirmed unused elsewhere by grep). Add `server-only`.
- Studio env: Vite exposes only `SANITY_STUDIO_*`. Studio configs read
  `SANITY_STUDIO_PROJECT_ID` / `SANITY_STUDIO_DATASET`, loaded from the repo‑root env file via
  `vite: { envDir: '..' }` (for `sanity dev/build`) and `dotenv` in `sanity.cli.ts` (for the CLI /
  `sanity deploy` / typegen, which run in plain Node). Fallback to `NEXT_PUBLIC_SANITY_*` if the
  `SANITY_STUDIO_*` names are absent. Add both names to `.env.local` and `.env.example`.

### Data layer (web)
- `sanity/lib/client.ts` → **server‑only** (`import 'server-only'` at top). `createClient` with
  `projectId`, `dataset`, `apiVersion`, `useCdn: true`, `token: readToken`,
  `perspective: 'published'`, `stega: false`. The token is required for the private dataset even
  through the CDN. `useCdn: true` is fine for read‑only catalog content; `generateStaticParams`
  callers can `.withConfig({ useCdn: false })` later.
- **Not using `next-sanity`'s `defineLive` / `<SanityLive/>`.** It requires a *browser* token to do
  live updates client‑side, which AGENTS.md §7/§12 forbid ("The browser never holds a token").
  Instead: a hand‑rolled typed `sanityFetch` in `sanity/lib/fetch.ts` (server‑only) that calls
  `client.fetch(query, params, { next: { revalidate, tags } })`. Default `revalidate: 60`. Callers
  pass `tags` for future webhook‑driven `revalidateTag` (webhook route is a later task; not built
  now). This matches AGENTS.md §5 "a server only Sanity client and fetch helper" and
  `nextjs.md` §3 "Manual `sanityFetch` Helper".
- `sanity/env.ts` — add `export const readToken = process.env.SANITY_API_READ_TOKEN` (no
  `NEXT_PUBLIC_`). Do **not** `assertValue` it at module load (keeps `next build` working before the
  token is set); assert inside `client.ts` with a clear message so a missing token fails loudly at
  first fetch, per `nextjs.md` §7 (401 → check `SANITY_API_READ_TOKEN`).
- `sanity/lib/image.ts` — unchanged (client‑safe).
- Queries live in `sanity/queries/` (`fragments.ts`, `courses.ts`, `lessons.ts`, `instructors.ts`,
  `categories.ts`, `index.ts`). All wrapped in `defineQuery` (from `next-sanity`) with a
  `/* groq */` prefix. Unique, scoped names (`typegen.md` §"Unique Query Names"). `_key` included in
  every array projection (`schema.md` §4A). References expanded with `->`.
- Module/lesson numbering ("Module 5", "Lesson 5.1") is **derived from array order in the frontend**,
  never stored (AGENTS.md §8). Queries return `modules[]` and `modules[].lessons[]` in authored
  order with `_key`. `LESSON_BY_SLUG_QUERY` also resolves the parent course via
  `*[_type == "course" && references(^._id)][0]` (a lesson does not store its parent — §8) and
  returns that course's `modules[]{ title, "lessonIds": lessons[]._ref }` so a lesson page can
  compute its own `M.L` label later.

### TypeGen
- Configured in `studio/sanity.cli.ts`: `typegen: { enabled: true }`, plus explicit
  `schema: './schema.json'`, `generates: '../sanity.types.ts'`, and
  `path: '../{app,components,lib,sanity}/**/*.{ts,tsx}'` so it scans the web app's queries but not
  `studio/` or `node_modules`. `overloadClientMethods: true` (default) so `client.fetch(QUERY)` is
  auto‑typed.
- `sanity schemas extract` runs with `--enforce-required-fields` so `rule.required()` becomes
  non‑optional in the generated types (`typegen.md` §"Required Fields").
- **Commit** `sanity.types.ts` (repo root) — Option A in `typegen.md` §2 (types available right after
  pull; no CI typegen step needed). `.gitignore` gets `studio/schema.json` (intermediate artifact).
- Root `tsconfig.json` `include` already matches `sanity.types.ts` via `**/*.ts` — no change.

### Schema modeling (from AGENTS.md §8; field details chosen per `schema.md`)
- Every document/object gets an `@sanity/icons` icon via subpath import
  (`@sanity/icons/DocumentText` etc. — v5 removed root named exports, `schema.md` §4B).
- `defineType` / `defineField` / `defineArrayMember` everywhere (`schema.md` §2).
- Binary states that could grow → `options.list` radio, not bare boolean, **except** the two the
  brief literally calls "flags" (`course.popular`, `lesson.freePreview`) which stay `boolean` with
  `initialValue: false`.
- Slugs: `type: 'slug'`, `options.source: 'title'`/`'name'`, `validation: rule.required()`
  (Sanity enforces per‑type uniqueness by default).
- Rich text (`lesson.notes`, `instructor.bio`) uses one shared `portableText` object type — block
  style + bold/italic/link annotation + bullet/number lists (mirrors the ecommerce ref's `block`
  config). Markdown is never used for content (AGENTS.md §7).
- `previews` with meaningful `subtitle`/`media` on every type for Studio UX.

#### `category` (document, `TagIcon`)
| field | type | notes |
|---|---|---|
| `title` | string | required |
| `slug` | slug | required, source `title` |
| `description` | text | rows 3 |

#### `instructor` (document, `UserIcon`)
| field | type | notes |
|---|---|---|
| `name` | string | required |
| `slug` | slug | required, source `name` |
| `photo` | image | `options.hotspot: true`, nested `alt` string field |
| `expertise` | array of string | `options.layout: 'tags'` |
| `bio` | `portableText` | short bio, rendered on the instructor page later |

#### `lesson` (document, `PlayIcon`)
| field | type | notes |
|---|---|---|
| `title` | string | required |
| `slug` | slug | required, source `title` |
| `videoUrl` | url | required; `rule.uri({ scheme: ['http','https'] })`. Provider parsing (YouTube/Vimeo/Bunny) is the video‑pipeline task — not validated here beyond being a URL |
| `poster` | image | hotspot + `alt`; thumbnail/poster |
| `duration` | string | e.g. `"14:32"` — human label the cards show. (Assumption: a display string is enough now; the transcript pipeline works in `startSeconds` on separate `video` docs, out of scope.) `rule.regex(/^\d{1,2}:\d{2}(:\d{2})?$/)` warning |
| `freePreview` | boolean | `initialValue: false` — a *label*, not access control (§7) |
| `studentCount` | number | `rule.min(0)`; display only |
| `keyPoints` | array of string | "In this lesson you will…" list |
| `proTip` | text | optional single pro tip |
| `notes` | `portableText` | the Notes tab content |
| `resources` | array of `lessonResource` | see object below |

#### `lessonResource` (object, `LinkIcon`)
`resourceType` (string, radio list: `pdf` / `link` / `code` / `download` / `article`), `title`
(string, required), `description` (text), `url` (url, required, http/https).

#### `learningOutcome` (object, `CheckmarkCircleIcon`)
`icon` (string — icon token/name the UI maps; free string per §8 "an icon"), `title` (string,
required), `description` (text).

#### `module` (object, `FolderIcon`) — embedded in `course`, **not a document** (§8)
`title` (string, required), `summary` (text), `lessons` (array of
`defineArrayMember({ type: 'reference', to: [{ type: 'lesson' }] })`, `rule.min(1)` warning).
`preview` shows `title` + lesson count.

#### `course` (document, `DocumentTextIcon`), field groups: Content / Marketing / Curriculum
| field | type | notes |
|---|---|---|
| `title` | string | required, group Content |
| `slug` | slug | required, source `title`, group Content |
| `summary` | text | marketing blurb, group Marketing |
| `coverImage` | image | hotspot + `alt`, group Marketing |
| `level` | string | radio list `Beginner` / `Intermediate` / `Advanced`, group Marketing |
| `price` | number | `rule.min(0)`, group Marketing (USD, display) |
| `popular` | boolean | `initialValue: false`, group Marketing |
| `studentCount` | number | `rule.min(0)`, display, group Marketing |
| `learningOutcomes` | array of `learningOutcome` | "What you'll learn", group Marketing |
| `instructor` | reference → `instructor` | required, group Content |
| `category` | reference → `category` | required, group Content |
| `modules` | array of `module` | ordered, `rule.min(1)`, group Curriculum |

`course.preview`: title + `instructor.name` subtitle + `coverImage` media.

### Desk structure (`studio/structure.ts`)
Explicit ordered list with icons: **Courses**, **Lessons**, **Instructors**, **Categories**
(`S.documentTypeListItem(...)` for each). `module` / object types are not listed (embedded). No
singletons yet (the agent‑context singleton is a later task). `visionTool` stays enabled for GROQ
testing in‑Studio.

### `next.config.ts`
Add `images.remotePatterns` for `{ protocol: 'https', hostname: 'cdn.sanity.io' }` so future
`next/image` usage of Sanity assets works. Harmless now; part of enabling the data layer.

## Files to touch

### New — `studio/` workspace
- `studio/package.json` — deps `sanity`, `@sanity/vision`, `@sanity/icons`, `react`, `react-dom`,
  `styled-components`; devDeps `typescript`, `@types/react`, `@sanity/eslint-config-studio`,
  `eslint`, `dotenv`. Scripts: `dev` (`sanity dev`), `build` (`sanity build`), `deploy`
  (`sanity deploy`), `lint` (`eslint .`), `typecheck` (`tsc --noEmit`),
  `typegen` (`sanity schema extract --path=schema.json --enforce-required-fields && sanity typegen generate`).
- `studio/tsconfig.json` — standard Studio config (`target`/`module` `ESNext`, `moduleResolution`
  `bundler`, `jsx: react-jsx`, `strict`, `skipLibCheck`, `include: ["."]`).
- `studio/sanity.config.ts` — `defineConfig` (no `'use client'`, no `basePath`), `name: 'default'`,
  `title: 'Vertex'`, projectId/dataset from `SANITY_STUDIO_*` (fallback `NEXT_PUBLIC_SANITY_*`),
  `plugins: [structureTool({ structure }), visionTool()]`, `schema: { types: schemaTypes }`,
  `vite: { envDir: '..' }`.
- `studio/sanity.cli.ts` — load `../.env.local` via `dotenv`; `defineCliConfig({ api: { projectId,
  dataset }, autoUpdates: true, typegen: { enabled: true, schema: './schema.json',
  generates: '../sanity.types.ts', path: '../{app,components,lib,sanity}/**/*.{ts,tsx}' },
  vite: { envDir: '..' } })`.
- `studio/eslint.config.mjs` — re‑export `@sanity/eslint-config-studio`.
- `studio/structure.ts` — the explicit desk list above.
- `studio/schemaTypes/index.ts` — `export const schemaTypes = [portableText, learningOutcome,
  lessonResource, module, category, instructor, lesson, course]` (objects before documents that use
  them, per ecommerce ref).
- `studio/schemaTypes/objects/portableText.ts`
- `studio/schemaTypes/objects/learningOutcome.ts`
- `studio/schemaTypes/objects/lessonResource.ts`
- `studio/schemaTypes/objects/module.ts`
- `studio/schemaTypes/documents/category.ts`
- `studio/schemaTypes/documents/instructor.ts`
- `studio/schemaTypes/documents/lesson.ts`
- `studio/schemaTypes/documents/course.ts`
- `studio/.gitignore` — `node_modules`, `dist`, `schema.json`, `.sanity`.
- `studio/README.md` — one paragraph: how to run (`npm i && npm run dev` → :3333), env it reads,
  `npm run typegen`, `npm run deploy`.

### New — web
- `sanity/lib/fetch.ts` — `server-only`; typed `sanityFetch<QueryString>` wrapper.
- `sanity/queries/fragments.ts` — `imageFragment`, `instructorRefFragment`, `categoryRefFragment`,
  `lessonRefFragment` (label‑level fields for cards), `moduleFragment`.
- `sanity/queries/courses.ts` — `COURSES_QUERY` (catalog cards: title, slug, summary, coverImage,
  level, price, popular, studentCount, instructor→name/slug/photo, category→title/slug,
  `"moduleCount": count(modules)`, `"lessonCount": count(modules[].lessons[])`),
  `COURSE_BY_SLUG_QUERY` (full: + learningOutcomes, + `modules[]{ _key, title, summary,
  lessons[]->{ ...lessonRefFragment } }`), `COURSE_SLUGS_QUERY`, `COURSES_COUNT_QUERY`.
- `sanity/queries/lessons.ts` — `LESSON_BY_SLUG_QUERY` (all lesson fields incl. `notes`, `resources`,
  `keyPoints`, `proTip`; + parent `"course": *[_type=="course" && references(^._id)][0]{ title,
  "slug": slug.current, modules[]{ _key, title, "lessonIds": lessons[]._ref } }`),
  `LESSON_SLUGS_QUERY`.
- `sanity/queries/instructors.ts` — `INSTRUCTORS_QUERY`, `INSTRUCTOR_BY_SLUG_QUERY` (+ `"courses":
  *[_type=="course" && references(^._id)]{ _id, title, "slug": slug.current, coverImage }`).
- `sanity/queries/categories.ts` — `CATEGORIES_QUERY`, `CATEGORY_BY_SLUG_QUERY` (+ its courses).
- `sanity/queries/index.ts` — re‑export all.
- `scripts/verify-read.mjs` — tiny script: `createClient` from `next-sanity`, counts each type,
  prints JSON. Run with `node --env-file=.env.local scripts/verify-read.mjs`. Committed as a dev
  utility (not a route). If `next-sanity`'s ESM entry misbehaves under bare Node, fall back to
  importing `@sanity/client` directly (it is a transitive dep of `next-sanity`).
- `.env.example` — new, committed. Canonical var list (Sanity public vars + `SANITY_API_READ_TOKEN`
  + `SANITY_STUDIO_*` + all Clerk vars already in `.env.local`), values blank except the non‑secret
  Sanity project id/dataset.

### Modified — web
- `sanity/env.ts` — add `readToken` export (no assert at load).
- `sanity/lib/client.ts` — `server-only`; add token + `perspective`/`stega`; assert token present.
- `sanity/schemaTypes/` + `sanity/structure.ts` + `sanity/lib/live.ts` — **deleted** (moved to studio).
- `app/studio/` — **deleted** (whole `[[...tool]]` route).
- `sanity.config.ts`, `sanity.cli.ts` (repo root) — **deleted** (moved to studio).
- `package.json` — drop `sanity`, `@sanity/vision`, `styled-components`; add `server-only`; add
  scripts `studio` (`npm --prefix studio run dev`), `studio:deploy`, `studio:typegen`.
- `next.config.ts` — add `images.remotePatterns` for `cdn.sanity.io`.
- `.gitignore` — add `!.env.example` exception; add `studio/schema.json` and `/schema.json`.
- `package-lock.json` — regenerated by `npm install` after dep changes.
- `prompts/sanity-content-model.md` — this file.

### Generated (committed)
- `sanity.types.ts` (repo root) — from `cd studio && npm run typegen`.

## Requirements
- Studio runs standalone on `:3333` (`cd studio && npm run dev`), independent of `next dev`.
- All five types visible in the desk with icons and useful previews; required‑field validation blocks
  saving incomplete `course` / `lesson` / `instructor` / `category`.
- `module` is an embedded object inside `course.modules[]` — no standalone "Module" document type.
- Web never imports `sanity`, `@sanity/vision`, or a Studio bundle; `sanity/lib/*` and
  `sanity/queries/*` are server‑only and carry no client‑exposed token.
- `SANITY_API_READ_TOKEN` is read only from `process.env` on the server, never prefixed
  `NEXT_PUBLIC_`, never imported into a client component.
- Every GROQ query is `defineQuery`‑wrapped, uniquely named, includes `_key` in array projections,
  and resolves references with `->`.
- `sanity.types.ts` contains `Course`, `Lesson`, `Instructor`, `Category`, `Module` and a
  `*_QUERYResult` type per query; `client.fetch(SOME_QUERY)` is inferred (no manual generic).
- `.env.example` exists, is committed, and lists every variable the app and Studio read.
- `npx tsc --noEmit`, `npm run lint`, and `npm run build` all pass in the web app; `tsc --noEmit`,
  `lint`, and `build` pass in `studio/`.

## Security considerations
- **Token isolation**: `SANITY_API_READ_TOKEN` server‑only. `sanity/lib/client.ts` and
  `sanity/lib/fetch.ts` start with `import 'server-only'` so any accidental client import is a build
  error. No `defineLive`/`browserToken` (would ship a token to the browser).
- **Private dataset**: client uses `perspective: 'published'` and `stega: false` — no draft content
  or stega markers leak into rendered output / metadata (`nextjs.md` §4).
- **No secrets in git**: `.env.local` stays ignored; only `.env.example` (blank secrets) is
  committed. Verify the read token is not echoed into `sanity.types.ts`, `package-lock.json`, or any
  committed file.
- **Studio auth**: Sanity project auth is unchanged; the Studio deploy is gated by Sanity login.
  No Clerk involvement (browsing/content is public per §7; Studio is separate).
- **Input validation**: schema `url` fields restrict scheme to http/https; numeric fields `min(0)`.
- **No new runtime routes**, so no new attack surface in the Next app. `proxy.ts` unchanged.
- `scripts/verify-read.mjs` reads the token from `--env-file` at the developer's discretion and only
  prints counts — no content, no secret, in its output.

## Acceptance criteria
1. `studio/` is a standalone project; `cd studio && npm install && npm run dev` opens Studio at
   `http://localhost:3333` with Courses / Lessons / Instructors / Categories in the desk.
2. Repo root no longer has `sanity.config.ts`, `sanity.cli.ts`, `app/studio/`, `sanity/schemaTypes/`,
   `sanity/structure.ts`, or `sanity/lib/live.ts`. `npm run build` (web) succeeds without them.
3. Creating one of each type in Studio enforces the required fields from §8; a `course` can embed a
   `module` that references existing `lesson` documents; numbering is nowhere stored.
4. `cd studio && npm run typegen` writes `../sanity.types.ts` with the five type interfaces and one
   result type per query, `--enforce-required-fields` applied.
5. In the web app, importing a query from `@/sanity/queries` and calling
   `sanityFetch({ query: COURSES_QUERY })` type‑checks with a fully‑typed return and no manual
   generic.
6. `node --env-file=.env.local scripts/verify-read.mjs` (with a real `SANITY_API_READ_TOKEN`) prints
   per‑type counts from the private dataset — proving server‑side authenticated reads work.
7. `.env.example` is committed and complete; `git status` shows no `.env.local` / token leakage.
8. Web: `npx tsc --noEmit`, `npm run lint`, `npm run build` pass. Studio: `npm run typecheck`,
   `npm run lint`, `npm run build` pass.

## Checks to run (AGENTS.md §13)
**Web workspace (repo root):**
1. `npm install` (after dep changes) — lockfile updates.
2. `npx tsc --noEmit`
3. `npm run lint`
4. `npm run build` (server code + config changed)
5. `node --env-file=.env.local scripts/verify-read.mjs` (needs the token set — see Needs your attention)

**Studio workspace (`studio/`):**
6. `npm install`
7. `npm run typecheck` (`tsc --noEmit`)
8. `npm run lint`
9. `npm run build`
10. `npm run typegen` — confirm `../sanity.types.ts` regenerates; diff it.
11. `npm run deploy` — deploy the Studio application (AGENTS.md §12: the Context MCP only serves a
    dataset with a *deployed* Studio; needed for the later search task). Requires Sanity login —
    see Needs your attention.

Live MCP verification is **not** applicable to this task (no search/ingestion code yet).

## Manual test steps
1. `cd studio && npm install && npm run dev`. Open `http://localhost:3333`. Confirm the desk shows
   **Courses, Lessons, Instructors, Categories**, each with an icon.
2. Create a **Category** (title + slug + description). Create an **Instructor** (name, slug, photo,
   a couple of expertise tags, a line of bio). Save — confirm required fields are enforced.
3. Create two **Lessons** (title, slug, a real YouTube URL, duration like `12:45`, a couple of key
   points, a short Portable Text note, one resource). Toggle `freePreview` on one.
4. Create a **Course**: title, slug, summary, level, price, mark `popular`, add two
   `learningOutcomes`, pick the instructor + category, add one **module** with a title/summary and
   both lessons referenced in order. Save — confirm it validates and the preview shows the
   instructor as subtitle.
5. In Studio → **Vision**, run `*[_type == "course"]{ title, "modules": modules[]{ title,
   "lessons": lessons[]->title } }` and confirm the nested lessons resolve.
6. `npm run typegen` in `studio/`. Open `../sanity.types.ts`; confirm `Course`, `Lesson`,
   `Instructor`, `Category`, `Module`, and `COURSE_BY_SLUG_QUERYResult` (etc.) exist.
7. Back in the repo root, set `SANITY_API_READ_TOKEN` in `.env.local`, then
   `node --env-file=.env.local scripts/verify-read.mjs`. Confirm it prints counts (`course: 1,
   lesson: 2, instructor: 1, category: 1`).
8. `npx tsc --noEmit && npm run lint && npm run build` at the repo root — all green.
9. `git status` — `studio/` is the only new tracked dir plus `sanity.types.ts`, `.env.example`,
   updated `sanity/lib`, `sanity/queries`, `package.json`, `next.config.ts`, `.gitignore`; **no**
   `.env.local`, **no** `schema.json`.

## Needs your attention (before checks 5 / 11 can pass)
- **Sanity read token**: create a **Viewer** token at
  `https://www.sanity.io/manage/project/f1xc8l6s/api` and put it in `.env.local` as
  `SANITY_API_READ_TOKEN=...`. Until then, `npm run build` still passes but any `sanityFetch` at
  runtime throws a clear "missing token" error.
- **Sanity login + CORS**: `npx sanity login` (interactive), then
  `npx sanity cors add http://localhost:3000 --credentials` and the same for the production URL, and
  `cd studio && npm run deploy` to publish the Studio app. I can't do the interactive login here.
- Confirm the deployed Studio hostname you want (defaults to `<project>.sanity.studio`) — needed
  later for the Context MCP.
