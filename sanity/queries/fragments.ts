// Reusable GROQ fragments. Keep field selection consistent across queries and
// always include `_key` in array projections.

export const imageFragment = /* groq */ `
  "alt": coalesce(alt, ""),
  asset->{
    _id,
    url,
    metadata { lqip, dimensions }
  }
`

export const instructorRefFragment = /* groq */ `
  _id,
  name,
  "slug": slug.current,
  photo { ${imageFragment} }
`

export const categoryRefFragment = /* groq */ `
  _id,
  title,
  "slug": slug.current
`

// Label-level lesson fields — enough for cards and curriculum lists.
export const lessonRefFragment = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  duration,
  freePreview,
  studentCount,
  keyPoints,
  poster { ${imageFragment} }
`

export const moduleFragment = /* groq */ `
  _key,
  title,
  summary,
  "lessons": lessons[]->{ ${lessonRefFragment} }
`
