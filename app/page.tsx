import Link from 'next/link'
import Image from 'next/image'
import { site } from '@/lib/site'
import { sortedPosts } from '@/lib/posts'
import { EmailCapture } from '@/components/EmailCapture'

export default function Home() {
  const featured = sortedPosts.filter((p) => p.featured)
  const heroVisual = '/visuals/backplates/website-growth-loop.png'
  const explainerVisual = '/visuals/income-engine-flow.svg'

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border py-16 sm:py-24">
        <Image
          src={heroVisual}
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          priority
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-65"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-bg)_0%,rgba(7,8,13,0.94)_46%,rgba(7,8,13,0.30)_100%)]" />
        <div className="relative max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Make money with AI agents</p>
          <h1 className="mt-4 max-w-[22rem] text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:max-w-3xl sm:text-6xl">
            {site.tagline}
          </h1>
          <p className="mt-6 max-w-[22rem] text-lg leading-relaxed text-muted sm:max-w-2xl">{site.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/start" className="rounded-lg bg-accent px-6 py-3 font-semibold text-bg hover:opacity-90">
              Start here →
            </Link>
            <Link href="/blog" className="rounded-lg border border-border px-6 py-3 font-semibold text-ink hover:border-accent">
              See the comparisons
            </Link>
          </div>
        </div>
      </section>

      {/* The method */}
      <section className="border-t border-border py-16">
        <h2 className="max-w-[22rem] text-3xl font-bold text-ink sm:max-w-none">The method, in one sentence</h2>
        <p className="mt-4 max-w-[22rem] text-lg text-muted sm:max-w-2xl">
          The AI tools everyone searches for — ChatGPT, Claude, Midjourney — pay nothing. So we rank for them,
          tell you the honest truth, and point you to the <strong className="text-ink">tools that actually pay recurring</strong> when
          they genuinely beat the alternative. You get the real answer; the system earns when you act on it.
        </p>
        <img
          src={explainerVisual}
          alt="Research, comparison, catalog, email capture, and audit stages in one income engine flow."
          className="mt-8 w-full rounded-xl border border-border"
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { n: '01', t: 'Honest comparisons', d: 'Real tool tests in the shape AI search engines cite. The best pick always wins — never the highest payout.' },
            { n: '02', t: 'A shared engine', d: 'One affiliate catalog feeds every post on every site. Join a program once, links go live network-wide.' },
            { n: '03', t: 'It compounds', d: 'Recurring commissions + an owned email list + content that ranks for years = income that runs without you.' },
          ].map((c) => (
            <div key={c.n} className="rounded-xl border border-border glass p-5">
              <div className="text-sm font-bold text-accent">{c.n}</div>
              <div className="mt-2 font-semibold text-ink">{c.t}</div>
              <p className="mt-1.5 text-sm text-muted">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured comparisons */}
      <section className="border-t border-border py-16">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl font-bold text-ink">Start with these</h2>
          <Link href="/blog" className="text-sm font-medium text-accent hover:underline">All comparisons →</Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {featured.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="group rounded-xl border border-border glass p-6 transition hover:border-accent">
              <div className="text-xs font-semibold uppercase tracking-wider text-accent">{p.cluster}</div>
              <h3 className="mt-2 text-lg font-bold text-ink group-hover:text-accent">{p.title}</h3>
              <p className="mt-2 text-sm text-muted">{p.dek}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Network / spokes — renders only when you've added sites to site.network */}
      {site.network.length > 0 && (
        <section className="border-t border-border py-16">
          <h2 className="text-3xl font-bold text-ink">The rest of the network</h2>
          <p className="mt-3 max-w-2xl text-muted">Same engine, different angle. Pick the lens that fits how you think about money.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {site.network.map((n) => (
              <a key={n.url} href={n.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-xl border border-border glass p-5 hover:border-accent">
                <div>
                  <div className="font-semibold text-ink">{n.name}</div>
                  <p className="mt-1 text-sm text-muted">{n.blurb}</p>
                </div>
                <span className="text-accent">→</span>
              </a>
            ))}
          </div>
        </section>
      )}

      <EmailCapture />
    </>
  )
}
