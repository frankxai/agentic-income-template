import type { Metadata } from 'next'
import './globals.css'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { site } from '@/lib/site'
import { CatalogProvider } from '@agentic-income/engine/react.js'
import catalog from '@/data/programs.json'

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s · ${site.name}` },
  description: site.description,
  openGraph: { title: site.name, description: site.description, url: site.url, siteName: site.name, type: 'website' },
  twitter: { card: 'summary_large_image', title: site.name, description: site.description },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CatalogProvider catalog={catalog}>
          <Nav />
          <main className="mx-auto max-w-6xl px-6">{children}</main>
          <Footer />
        </CatalogProvider>
      </body>
    </html>
  )
}
