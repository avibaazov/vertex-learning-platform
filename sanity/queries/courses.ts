import {defineQuery} from 'next-sanity'

import {
  categoryRefFragment,
  imageFragment,
  instructorRefFragment,
  moduleFragment,
} from './fragments'

const courseCardFragment = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  summary,
  level,
  price,
  popular,
  studentCount,
  coverImage { ${imageFragment} },
  "instructor": instructor->{ ${instructorRefFragment} },
  "category": category->{ ${categoryRefFragment} },
  "moduleCount": count(modules),
  "lessonCount": count(modules[].lessons[])
`

// Catalog grid.
export const COURSES_QUERY = defineQuery(/* groq */ `
  *[_type == "course" && defined(slug.current)] | order(popular desc, title asc) {
    ${courseCardFragment}
  }
`)

export const COURSES_COUNT_QUERY = defineQuery(/* groq */ `
  count(*[_type == "course" && defined(slug.current)])
`)

export const COURSE_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "course" && defined(slug.current)]{ "slug": slug.current }
`)

// Course detail — cards fields plus outcomes and the full curriculum.
export const COURSE_BY_SLUG_QUERY = defineQuery(/* groq */ `
  *[_type == "course" && slug.current == $slug][0]{
    ${courseCardFragment},
    "learningOutcomes": learningOutcomes[]{
      _key,
      icon,
      title,
      description
    },
    "modules": modules[]{ ${moduleFragment} }
  }
`)
