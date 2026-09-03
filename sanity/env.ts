export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-09-03'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

/**
 * Server-only viewer token for the private dataset. Never prefixed with
 * NEXT_PUBLIC_ and never imported into a client component (AGENTS.md §12).
 * Not asserted here so `next build` works before it is set; `sanity/lib/client`
 * asserts it at first use.
 */
export const readToken = process.env.SANITY_API_READ_TOKEN

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
