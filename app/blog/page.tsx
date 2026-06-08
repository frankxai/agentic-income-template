import type { Metadata } from 'next'
import Link from 'next/link'
import { sortedPosts } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'AI Tool Comparisons',
  description: 'Honest, AEO-ready comparisons of the AI tools that actually make creators money.',
}

export default function BlogIndex() {
  return (
    <div className="py-14">
      <h1 className="text-4xl font-extrabold tracking-tight text-ink">Comparisons</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Every post is a real test in the shape AI search engines cite — direct answer, sortable table, the honest pick.
      </p>
      <div className="mt-10 space-y-4">
        {sortedPosts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="group block rounded-xl border border-border glass p-6 transition hover:border-accent">
            <div className="flex items-center gap-3 text-xs text-muted">
              <span className="font-semibold uppercase tracking-wider text-accent">{p.cluster}</span>
              <span>·</span>
              <time>{p.date}</time>
            </div>
            <h2 className="mt-2 text-xl font-bold text-ink group-hover:text-accent">{p.title}</h2>
            <p className="mt-2 text-muted">{p.dek}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
