export type Faq = { q: string; a: string }

/**
 * Renders FAQs and emits FAQPage JSON-LD in one place — the schema that wins
 * the "People also ask" boxes and gets lifted into AI answers.
 */
export function FaqSection({ items }: { items: Faq[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <section className="my-8">
      <h2>Frequently asked questions</h2>
      <div className="mt-3 divide-y divide-border rounded-xl border border-border">
        {items.map((f) => (
          <details key={f.q} className="group px-4 py-3">
            <summary className="cursor-pointer list-none font-semibold text-ink marker:hidden">{f.q}</summary>
            <p className="mt-2 text-muted">{f.a}</p>
          </details>
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
    </section>
  )
}
