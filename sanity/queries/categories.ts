import {defineQuery} from 'next-sanity'

import {imageFragment} from './fragments'

export const CATEGORIES_QUERY = defineQuery(/* groq */ `
  *[_type == "category" && defined(slug.current)] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    "courseCount": count(*[_type == "course" && references(^._id)])
  }
`)

export const CATEGORY_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "category" && defined(slug.current)]{ "slug": slug.current }
`)

export const CATEGORY_BY_SLUG_QUERY = defineQuery(/* groq */ `
  *[_type == "category" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    description,
    "courses": *[_type == "course" && references(^._id)] | order(popular desc, title asc) {
      _id,
      title,
      "slug": slug.current,
      summary,
      level,
      price,
      popular,
      coverImage { ${imageFragment} }
    }
  }
`)
