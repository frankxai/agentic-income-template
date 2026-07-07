import { normalizeAnalyticsEvent, forwardAnalyticsEvent as forward, type AnalyticsEvent } from '@agentic-income/engine/analytics.js'
import { site } from '@/lib/site'

// Thin per-site binding: validation/allow-list logic lives once in the shared package;
// this file just binds the site host for outbound forwarding.
export type { AnalyticsEvent }
export { normalizeAnalyticsEvent }

export function forwardAnalyticsEvent(event: AnalyticsEvent): Promise<boolean> {
  return forward(event, site.domain)
}
