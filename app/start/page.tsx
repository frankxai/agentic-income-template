import type { Metadata } from 'next'
import Link from 'next/link'
import { payingPrograms } from '@/lib/affiliate'
import { EmailCapture } from '@/components/EmailCapture'

export const metadata: Metadata = {
  title: 'Start Here',
  description: 'The 3-step path to building an income system with AI agents — what to build, in what order, and why it compounds.',
}

export default function Start() {
  const top = payingPrograms().slice(0, 6)

  return (
    <div className="py-14">
      <h1 className="text-4xl font-extrabold tracking-tight text-ink">Start here</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        You don't need an audience or a product to begin. You need one honest comparison that ranks, the right
        recurring-payer tools behind it, and an email list that turns readers into a relationship. Here's the order.
      </p>

      <ol className="mt-10 space-y-6">
        {[
          { t: 'Pick one tool category you actually use', d: 'Voice, video, writing, coding — whatever you have real opinions about. Authentic beats broad. You can only recommend honestly what you\'ve touched.' },
          { t: 'Write the comparison in the citable shape', d: 'Direct answer up top, sortable table, the honest pick, a real FAQ. That structure is what ranks and what AI search engines lift verbatim.' },
          { t: 'Place recurring-payer links, then build the list', d: 'Link the tools that pay every month — not one-time bounties. Add one email capture. Now every reader is either income or a future relationship.' },
        ].map((s, i) => (
          <li key={s.t} className="flex gap-4 rounded-xl border border-border glass p-5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent/15 font-bold text-accent">{i + 1}</span>
            <div>
              <div className="font-semibold text-ink">{s.t}</div>
              <p className="mt-1 text-sm text-muted">{s.d}</p>
            </div>
          </li>
        ))}
      </ol>

      <h2 className="mt-14 text-2xl font-bold text-ink">The recurring-payer shortlist</h2>
      <p className="mt-2 max-w-2xl text-muted">The programs worth building around — ranked. Recurring commissions are what make the income passive.</p>
      <div className="mt-6 overflow-hidden rounded-xl border border-border glass">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-muted">
            <th className="px-4 py-3">Tool</th><th className="px-4 py-3">Commission</th><th className="px-4 py-3">Recurring</th>
          </tr></thead>
          <tbody>
            {top.map((p) => (
              <tr key={p.tool} className="border-t border-border">
                <td className="px-4 py-3 font-semibold text-ink">{p.tool}</td>
                <td className="px-4 py-3 text-ink">{p.commission}</td>
                <td className="px-4 py-3 text-muted">{p.recurring}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10">
        <Link href="/blog" className="font-medium text-accent hover:underline">See the comparisons in action →</Link>
      </div>

      <EmailCapture headline="Want the build order as a checklist?" sub="I'll send the exact step-by-step I use to ship a ranking comparison in an afternoon." />
    </div>
  )
}
