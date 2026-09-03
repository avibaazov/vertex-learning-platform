// Dev utility: prove server-side authenticated reads against the private dataset.
// Run:  node --env-file=.env.local scripts/verify-read.mjs
//
// Prints per-type document counts only — no content, no secrets.

import {createClient} from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-09-03'
const token = process.env.SANITY_API_READ_TOKEN

if (!projectId || !dataset) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET')
  process.exit(1)
}
if (!token) {
  console.error('Missing SANITY_API_READ_TOKEN — create a Viewer token in sanity.io/manage')
  process.exit(1)
}

const client = createClient({projectId, dataset, apiVersion, useCdn: false, token})

const counts = await client.fetch(/* groq */ `{
  "course": count(*[_type == "course"]),
  "lesson": count(*[_type == "lesson"]),
  "instructor": count(*[_type == "instructor"]),
  "category": count(*[_type == "category"])
}`)

console.log(`Read OK from ${projectId}/${dataset}:`)
console.log(JSON.stringify(counts, null, 2))
