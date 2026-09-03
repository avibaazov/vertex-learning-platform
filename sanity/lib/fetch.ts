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
 *
 * TypeGen does not overload the client methods in this project, so pass the
 * generated `*_QUERY_RESULT` type explicitly:
 *   sanityFetch<COURSE_BY_SLUG_QUERY_RESULT>({ query: COURSE_BY_SLUG_QUERY, ... })
 */
export async function sanityFetch<TResult = unknown>({
  query,
  params = {},
  revalidate = 60,
  tags = [],
}: {
  query: string
  params?: QueryParams
  revalidate?: number | false
  tags?: string[]
}): Promise<TResult> {
  return client.fetch<TResult>(query, params, {
    next: {
      revalidate: tags.length ? false : revalidate,
      tags,
    },
  })
}
