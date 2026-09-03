import 'server-only'

import {createClient} from 'next-sanity'

import {apiVersion, dataset, projectId, readToken} from '../env'

if (!readToken) {
  throw new Error(
    'Missing environment variable: SANITY_API_READ_TOKEN (server-only viewer token for the private dataset)'
  )
}

/**
 * Server-only read client. The dataset is private, so a token is required even
 * through the CDN. `perspective: 'published'` + `stega: false` keep drafts and
 * stega markers out of rendered output and metadata.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  token: readToken,
  perspective: 'published',
  stega: false,
})
