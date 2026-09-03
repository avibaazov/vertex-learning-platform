import {defineQuery} from 'next-sanity'

import {imageFragment} from './fragments'

export const INSTRUCTORS_QUERY = defineQuery(/* groq */ `
  *[_type == "instructor" && defined(slug.current)] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    expertise,
    photo { ${imageFragment} }
  }
`)

export const INSTRUCTOR_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "instructor" && defined(slug.current)]{ "slug": slug.current }
`)

export const INSTRUCTOR_BY_SLUG_QUERY = defineQuery(/* groq */ `
  *[_type == "instructor" && slug.current == $slug][0]{
    _id,
    name,
    "slug": slug.current,
    expertise,
    bio,
    photo { ${imageFragment} },
    "courses": *[_type == "course" && references(^._id)] | order(title asc) {
      _id,
      title,
      "slug": slug.current,
      summary,
      level,
      coverImage { ${imageFragment} }
    }
  }
`)
