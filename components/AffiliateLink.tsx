import { getLink, findProgram } from '@/lib/affiliate'

/**
 * Renders an affiliate link when we've joined the program (ourLink set),
 * otherwise plain bold text — never a dead link. The catalog is the single
 * source of truth: join a program, set ourLink, and every mention goes live.
 */
export function AffiliateLink({ tool, children }: { tool: string; children?: React.ReactNode }) {
  const href = getLink(tool)
  const label = children ?? findProgram(tool)?.tool ?? tool

  if (!href) return <strong>{label}</strong>

  return (
    <a href={href} target="_blank" rel="sponsored nofollow noopener" className="text-accent underline underline-offset-2">
      {label}
    </a>
  )
}
