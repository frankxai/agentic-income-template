'use client'

import { useState } from 'react'

/**
 * Email capture — the owned-audience asset. This is a template stub: submitting
 * only flips local state, and the email is NOT stored or sent anywhere. Wire the
 * form's onSubmit to your ESP (Systeme.io / Resend / Buttondown) endpoint before
 * launch — until then the success message says so honestly.
 */
export function EmailCapture({ headline = 'Get the stack that earns', sub = 'One email when a new tool actually beats what you\'re paying for. No noise.' }: { headline?: string; sub?: string }) {
  const [done, setDone] = useState(false)

  return (
    <div className="my-8 rounded-2xl border border-border glass px-6 py-7 text-center">
      <h3 className="text-xl font-bold text-ink">{headline}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">{sub}</p>
      {done ? (
        <p className="mt-4 text-sm font-medium text-accent">Form received — this template isn't wired to an email provider yet. Connect yours in components/EmailCapture.tsx.</p>
      ) : (
        <form
          className="mx-auto mt-4 flex max-w-md flex-col gap-2 sm:flex-row"
          onSubmit={(e) => { e.preventDefault(); setDone(true) }}
        >
          <input
            type="email"
            required
            placeholder="you@email.com"
            aria-label="Email address"
            autoComplete="email"
            name="email"
            className="flex-1 rounded-lg border border-border bg-bg px-4 py-2.5 text-sm text-ink outline-none focus:border-accent"
          />
          <button type="submit" className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-bg hover:opacity-90">
            Send it
          </button>
        </form>
      )}
    </div>
  )
}
