import createMDX from '@next/mdx'

const securityHeaders = [
  // Baseline hardening only — deliberately no Content-Security-Policy here yet.
  // A real CSP needs every external domain this site actually loads allowlisted and
  // tested first; get that wrong and it silently breaks fonts/analytics/images instead
  // of failing loudly. Do that as its own reviewed change per fork.
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  experimental: {
    mdxRs: true,
    // The shared package is a symlinked sibling repo (pnpm "link:" dependency) — its real
    // path is outside this project's root, which Next otherwise refuses to process.
    externalDir: true,
  },
  transpilePackages: ['@agentic-income/engine'],
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}

const withMDX = createMDX({})

export default withMDX(nextConfig)
