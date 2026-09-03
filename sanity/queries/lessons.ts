import {defineQuery} from 'next-sanity'

import {imageFragment} from './fragments'

export const LESSON_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "lesson" && defined(slug.current)]{ "slug": slug.current }
`)

/**
 * Full lesson for the lesson page. The parent course is derived with a reverse
 * reference (a lesson never stores its course — AGENTS.md §8); `modules[]` is
 * returned with lesson `_ref`s so the page can compute the "M.L" label.
 */
export const LESSON_BY_SLUG_QUERY = defineQuery(/* groq */ `
  *[_type == "lesson" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    videoUrl,
    duration,
    freePreview,
    studentCount,
    keyPoints,
    proTip,
    notes,
    poster { ${imageFragment} },
    "resources": resources[]{
      _key,
      resourceType,
      title,
      description,
      url
    },
    "course": *[_type == "course" && references(^._id)][0]{
      _id,
      title,
      "slug": slug.current,
      "instructor": instructor->{ _id, name, "slug": slug.current },
      "modules": modules[]{
        _key,
        title,
        "lessonIds": lessons[]._ref
      }
    }
  }
`)
