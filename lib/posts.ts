/**
 * Curated post registry — drives the blog index, ordering, and metadata.
 * Content lives in app/blog/<slug>/page.mdx. Add an entry here per post.
 */
export type Post = {
  slug: string
  title: string
  dek: string
  query: string
  date: string
  cluster: 'coding' | 'creator' | 'local' | 'aeo' | 'income'
  tools: string[]
  featured?: boolean
}

export const posts: Post[] = [
  {
    slug: 'best-ai-writing-assistants',
    title: 'Best AI Writing Assistants 2026 (Honest Comparison)',
    dek: 'An example post showing the shape: direct answer, sortable table, the honest pick, real FAQ. Replace it with your own.',
    query: 'best ai writing assistant',
    date: '2026-01-01',
    cluster: 'creator',
    tools: ['Copy.ai', 'Jasper', 'Writesonic', 'Rytr'],
    featured: true,
  },
]

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug)
}

export const sortedPosts = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1))
