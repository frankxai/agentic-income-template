import type { MetadataRoute } from 'next'
import { site } from '@/lib/site'
import { posts } from '@/lib/posts'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/blog', '/start'].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }))
  const postRoutes = posts.map((p) => ({
    url: `${site.url}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))
  return [...routes, ...postRoutes]
}
