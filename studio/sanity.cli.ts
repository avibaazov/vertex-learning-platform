import path from 'node:path'

import {config as loadEnv} from 'dotenv'
import {defineCliConfig} from 'sanity/cli'

// The CLI (`sanity deploy`, `sanity typegen`, `sanity schema extract`) runs in plain
// Node, so load the repo-root env files explicitly. `sanity dev` / `sanity build`
// run through Vite and pick these up via `vite.envDir` below.
loadEnv({path: path.resolve(__dirname, '../.env.local')})
loadEnv({path: path.resolve(__dirname, '../.env')})

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset =
  process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

if (!projectId) {
  throw new Error('Missing SANITY_STUDIO_PROJECT_ID (or NEXT_PUBLIC_SANITY_PROJECT_ID)')
}

export default defineCliConfig({
  api: {projectId, dataset},
  /**
   * Auto-update the deployed Studio to the latest bugfixes/features without a redeploy.
   * https://www.sanity.io/docs/studio/latest-version-of-sanity
   */
  deployment: {autoUpdates: true},
  typegen: {
    enabled: true,
    schema: './schema.json',
    generates: '../sanity.types.ts',
    // Scan the web app's queries; skip studio/ and node_modules.
    path: '../{app,components,lib,sanity}/**/*.{ts,tsx}',
  },
  vite: {
    // Load .env* from the repo root when running `sanity dev` / `sanity build`.
    envDir: '..',
  },
})
