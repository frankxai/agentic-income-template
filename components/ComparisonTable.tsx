'use client'

import { useState } from 'react'
import { getLink } from '@/lib/affiliate'

export type Row = {
  tool: string
  verdict: string
  price: string
  recurring?: string
  pick?: boolean
}

type SortKey = 'tool'

/**
 * The money component: an honest, sortable tool table. The "Try" cell only
 * renders a CTA when we've joined that program (ourLink set) — otherwise the
 * tool is still listed and recommended, just without a link. Honesty first.
 */
export function ComparisonTable({ rows, caption }: { rows: Row[]; caption?: string }) {
  const [sort, setSort] = useState<SortKey>('tool')
  const [asc, setAsc] = useState(true)

  const sorted = [...rows].sort((a, b) => {
    const cmp = a[sort].localeCompare(b[sort])
    return asc ? cmp : -cmp
  })

  const toggle = (key: SortKey) => {
    if (key === sort) setAsc(!asc)
    else { setSort(key); setAsc(true) }
  }

  return (
    <div className="my-7 overflow-hidden rounded-xl border border-border glass">
      {caption && <div className="border-b border-border px-4 py-2.5 text-sm font-medium text-muted">{caption}</div>}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-left text-muted">
              <Th onClick={() => toggle('tool')} active={sort === 'tool'} asc={asc}>Tool</Th>
              <th className="px-4 py-3 font-semibold">Verdict</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">Recurring</th>
              <th className="px-4 py-3 font-semibold">Try</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => {
              const href = getLink(r.tool)
              return (
                <tr key={r.tool} className={`border-t border-border ${r.pick ? 'bg-accent/[0.05]' : ''}`}>
                  <td className="px-4 py-3 font-semibold text-ink">
                    {r.tool}
                    {r.pick && <span className="ml-2 rounded bg-accent/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent">Top pick</span>}
                  </td>
                  <td className="px-4 py-3 text-muted">{r.verdict}</td>
                  <td className="px-4 py-3 text-ink">{r.price}</td>
                  <td className="px-4 py-3 text-muted">{r.recurring ?? '—'}</td>
                  <td className="px-4 py-3">
                    {href ? (
                      <a href={href} target="_blank" rel="sponsored nofollow noopener" className="rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-bg hover:opacity-90">
                        Try →
                      </a>
                    ) : (
                      <span className="text-xs text-muted/60">—</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Th({ children, onClick, active, asc }: { children: React.ReactNode; onClick: () => void; active: boolean; asc: boolean }) {
  return (
    <th className="px-4 py-3 font-semibold">
      <button onClick={onClick} className="inline-flex items-center gap-1 hover:text-ink">
        {children}
        <span className="text-[10px] opacity-60">{active ? (asc ? '▲' : '▼') : '↕'}</span>
      </button>
    </th>
  )
}
