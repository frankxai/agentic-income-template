#!/usr/bin/env node
// Vendors the shared affiliate catalog from affiliate-agent-skills into this site.
// Run after the engine catalog changes (e.g. when an ourLink is set on joining a program).
// The vendored copy is what Vercel builds against — the engine repo is not present at deploy.
import { copyFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const src = join(here, '..', '..', 'affiliate-agent-skills', 'data', 'programs.json')
const dest = join(here, '..', 'data', 'programs.json')

if (!existsSync(src)) {
  console.error(`✗ engine catalog not found at ${src}\n  clone frankxai/affiliate-agent-skills as a sibling repo first.`)
  process.exit(1)
}
copyFileSync(src, dest)
console.log(`✓ synced catalog → data/programs.json`)
