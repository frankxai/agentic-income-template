'use client'

import { useState } from 'react'

/**
 * Email capture — the owned-audience asset. Currently posts to a no-op handler;
 * wire `action` to your ESP (Systeme.io / Resend) endpoint when ready.
 */
export function EmailCapture({ headline = 'Get the stack that earns', sub = 'One high-signal email when a tool that compounds is available. No noise.' }: { headline?: string; sub?: string }) {
  const [done, setDone] = useState(false)

  return (
    <div className="my-10 card text-center">
      <h3 className="text-2xl font-semibold tracking-tight">{headline}</h3>
      <p className="mx-auto mt-2 max-w-md text-[15px] text-muted">{sub}</p>

      {done ? (
        <p className="mt-5 text-accent font-medium">You’re in. Check your inbox for the latest payer brief.</p>
      ) : (
        <form
          className="mx-auto mt-5 flex max-w-md flex-col gap-3 sm:flex-row"
          onSubmit={async (e) => {
            e.preventDefault()
            const form = e.currentTarget
            const email = (form.elements.namedItem('email') as HTMLInputElement).value
            try { await fetch('/api/subscribe', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email }) }) } catch {}
            setDone(true)
          }}
        >
          <input name="email" type="email" required placeholder="you@email.com" className="flex-1 rounded-xl border border-border bg-bg px-5 py-3 text-sm outline-none focus:border-accent" />
          <button type="submit" className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-bg">Subscribe</button>
        </form>
      )}

      <div className="mt-4 text-[11px] text-muted">
        Highest-converting partner: <a href="https://go.agenticincome.ai/systeme" target="_blank" rel="sponsored" className="text-accent underline">Systeme.io (60% lifetime recurring)</a>.
      </div>
    </div>
  )
}
