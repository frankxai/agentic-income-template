import { site } from '@/lib/site'

export function ArticleJsonLd({ title, description, slug, date }: { title: string; description: string; slug: string; date: string }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    datePublished: date,
    dateModified: date,
    author: { '@type': 'Person', name: site.author },
    publisher: { '@type': 'Organization', name: site.name, url: site.url },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${site.url}/blog/${slug}` },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}
