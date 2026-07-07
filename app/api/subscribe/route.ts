import { NextResponse } from 'next/server'
import { checkRateLimit, clientKeyFromHeaders } from '@agentic-income/engine'

export async function POST(req: Request) {
  const { allowed } = checkRateLimit(clientKeyFromHeaders(req.headers, 'subscribe'), 5, 60_000)
  if (!allowed) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 })
  }

  const { email } = await req.json().catch(() => ({}))
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 })
  }
  console.log('[subscribe] lead captured (template):', email)
  return NextResponse.json({ ok: true })
}