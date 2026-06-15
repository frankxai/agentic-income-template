#!/usr/bin/env node
// Runs the shared affiliate audit from affiliate-agent-skills against this site's posts.
// The engine repo is the single source of truth (not vendored here), so this shim
// resolves it as a sibling repo — override with AFFILIATE_ENGINE — and fails with a
// clear message when it's absent, instead of a cryptic module-not-found.
// Dev-only convenience: not part of CI or the production build.
import { existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const engine = process.env.AFFILIATE_ENGINE
  ? resolve(process.env.AFFILIATE_ENGINE)
  : join(here, '..', '..', 'affiliate-agent-skills')
const script = join(engine, 'scripts', 'affiliate-audit.mjs')

if (!existsSync(script)) {
  console.error(
    `✗ affiliate audit engine not found at ${script}\n` +
    `  clone frankxai/affiliate-agent-skills as a sibling repo, or set\n` +
    `  AFFILIATE_ENGINE=/path/to/affiliate-agent-skills`
  )
  process.exit(1)
}

// Forward any extra args; default to auditing the blog posts in write mode.
const args = process.argv.slice(2)
const passthrough = args.length ? args : ['--content=./app/blog', '--write']
const res = spawnSync('node', [script, ...passthrough], { stdio: 'inherit' })
process.exit(res.status ?? 0)
