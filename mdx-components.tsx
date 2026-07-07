import type { MDXComponents } from 'mdx/types'
import { AffiliateLink, AffiliateDisclosure, ComparisonTable, AnswerBox, FaqSection } from '@agentic-income/engine/react.js'
import { ArticleJsonLd } from '@/components/ArticleJsonLd'

// AffiliateLink/AffiliateDisclosure/ComparisonTable read this site's catalog via
// CatalogProvider (wrapped around the app in app/layout.tsx), not a factory call.
// Components available inside every .mdx post without an import.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    AffiliateLink,
    AffiliateDisclosure,
    ComparisonTable,
    AnswerBox,
    FaqSection,
    ArticleJsonLd,
    wrapper: ({ children }) => <article className="prose-ai mx-auto py-12">{children}</article>,
    ...components,
  }
}
