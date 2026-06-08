import { DISCLOSURE } from '@/lib/affiliate'

/** One per page that carries affiliate links — FTC compliance + trust. */
export function AffiliateDisclosure() {
  return (
    <p className="my-6 rounded-lg border border-border bg-surface/60 px-4 py-3 text-sm text-muted">
      <span aria-hidden>🔗 </span>
      {DISCLOSURE}
    </p>
  )
}
