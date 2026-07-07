import Link from 'next/link'
import { site } from '@/lib/site'

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 glass">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-ink">
          <img src="/brand/logo-monogram-3d.jpg" alt="Agentic Income" className="h-7 w-7 object-contain" />
          {site.name}
        </Link>
        <div className="flex items-center gap-5 text-sm text-muted">
          {site.nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-ink">{item.label}</Link>
          ))}
        </div>
      </nav>
    </header>
  )
}
