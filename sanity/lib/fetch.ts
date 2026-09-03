import 'server-only'

import type {QueryParams} from 'next-sanity'

import {client} from './client'

/**
 * Typed server-only fetch helper (AGENTS.md §5). Wraps `client.fetch` with
 * Next.js cache controls. We deliberately do NOT use `next-sanity`'s
 * `defineLive` / `<SanityLive />` because it needs a browser-side token, which
 * AGENTS.md §7/§12 forbid.
 *
 * Pass `tags` to opt a query into future webhook-driven `revalidateTag`.
 */
export async function sanityFetch<const QueryString extends string>({
  query,
  params = {},
  revalidate = 60,
  tags = [],
}: {
  query: QueryString
  params?: QueryParams
  revalidate?: number | false
  tags?: string[]
}) {
  return client.fetch(query, params, {
    next: {
      revalidate: tags.length ? false : revalidate,
      tags,
    },
  })
}
