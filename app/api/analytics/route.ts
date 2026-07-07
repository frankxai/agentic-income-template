import { NextResponse } from 'next/server'
import { forwardAnalyticsEvent, normalizeAnalyticsEvent } from '@/lib/analytics'
import { checkRateLimit, clientKeyFromHeaders } from '@agentic-income/engine'

export async function POST(req: Request) {
  const { allowed } = checkRateLimit(clientKeyFromHeaders(req.headers, 'analytics'), 30, 60_000)
  if (!allowed) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 })
  }

  const body = await req.json().catch(() => null)
  const event = normalizeAnalyticsEvent(body)

  if (!event) {
    return NextResponse.json({ ok: false, error: 'invalid_event' }, { status: 400 })
  }

  const forwarded = await forwardAnalyticsEvent(event)
  return NextResponse.json({ ok: true, forwarded })
}
