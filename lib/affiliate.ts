import catalog from '@/data/programs.json'
import { createAffiliateHelpers, type Program } from '@agentic-income/engine/catalog-helpers.js'

// Thin per-site binding: the matching/lookup logic lives once in the shared package,
// this file just supplies this site's own vendored catalog. Every existing
// `import { getLink } from '@/lib/affiliate'` call site keeps working unchanged.
export type { Program }
export const { DISCLOSURE, findProgram, getLink, payingPrograms } = createAffiliateHelpers(catalog)
