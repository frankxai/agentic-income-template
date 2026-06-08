import type { MDXComponents } from 'mdx/types'
import { AffiliateLink } from '@/components/AffiliateLink'
import { AffiliateDisclosure } from '@/components/AffiliateDisclosure'
import { ComparisonTable } from '@/components/ComparisonTable'
import { AnswerBox } from '@/components/AnswerBox'
import { FaqSection } from '@/components/FaqSection'
import { ArticleJsonLd } from '@/components/ArticleJsonLd'

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
