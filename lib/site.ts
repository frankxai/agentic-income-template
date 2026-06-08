/**
 * Per-site brand config — the ONLY file you change to make this template yours.
 * Swap these values, write your posts, deploy. Everything else (components, the
 * affiliate engine binding, post infrastructure) works as-is.
 */
export const site = {
  name: 'Your Income Site',
  domain: 'example.com',
  url: 'https://example.com',
  role: 'hub', // 'hub' | 'spoke'
  tagline: 'Build a system that earns.',
  description:
    'Honest AI-tool comparisons that help people choose well — and earn recurring affiliate income when they act on the recommendation.',
  author: 'Your Name',
  // Cross-link your other sites here (hub↔spoke) for topical authority + referral flow.
  network: [
    // { name: 'My Other Site', url: 'https://othersite.com', blurb: 'A different angle, same engine.' },
  ] as { name: string; url: string; blurb: string }[],
  nav: [
    { label: 'Comparisons', href: '/blog' },
    { label: 'Start Here', href: '/start' },
  ],
} as const

export type Site = typeof site
