# Vertex Studio

Standalone Sanity Studio for Vertex — the content model and authoring environment.
Kept separate from the Next.js app (`../`) so it gets fast Vite dev/builds, Studio
auto-updates, and TypeGen watch mode (AGENTS.md §5).

## Run

```bash
cd studio
npm install
npm run dev        # http://localhost:3333
```

Env is read from the repo root (`../.env.local`, `../.env`). Required:

- `SANITY_STUDIO_PROJECT_ID` (falls back to `NEXT_PUBLIC_SANITY_PROJECT_ID`)
- `SANITY_STUDIO_DATASET` (falls back to `NEXT_PUBLIC_SANITY_DATASET`)

## Types

```bash
npm run typegen    # extract schema.json + generate ../sanity.types.ts
```

Runs automatically during `npm run dev` / `npm run build` (`typegen.enabled` in
`sanity.cli.ts`). `../sanity.types.ts` is committed; `schema.json` is not.

## Deploy

```bash
npm run deploy     # deploy the Studio application (requires `npx sanity login`)
```

A deployed Studio is required before the Sanity Context MCP will serve this dataset
(AGENTS.md §12).

## Schema

| Type | Kind | Notes |
|------|------|-------|
| `course` | document | marketing fields, `learningOutcomes[]`, `instructor`/`category` refs, ordered `modules[]` |
| `module` | object | embedded in `course.modules[]`; ordered `lessons[]` refs. "Module 5" is derived from order, not stored |
| `lesson` | document | `videoUrl`, `notes` (Portable Text), `keyPoints[]`, `proTip`, `resources[]`. No parent-course field — derive via `references(^._id)` |
| `instructor` | document | `photo`, `expertise[]`, `bio` (Portable Text) |
| `category` | document | `title`, `slug`, `description` |
| `portableText` | object | shared rich text for `lesson.notes` + `instructor.bio` |
| `learningOutcome` / `lessonResource` | object | embedded list items |
