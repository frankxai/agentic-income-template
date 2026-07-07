// The pay-per-call endpoint — the "your agent charges for X" starter from
// agentic-income-skills/skills/income-web3/SKILL.md. An agent requests a resource, gets a 402
// with payment terms, settles on-chain, then re-requests with proof and gets served.
//
// DRY-RUN / TESTNET POSTURE: verifyPayment() in lib/agent-earn.ts is a stub that always
// returns unverified. No real wallet spend happens anywhere in this file or its helpers —
// there is no code path here that moves money. Wiring real verification (and therefore real
// settlement) requires the operator's explicit go-ahead; see app/api/agent/README.md.

import { NextResponse } from 'next/server'
import {
  paymentRequired,
  verifyPayment,
  type PaymentNetwork,
  type PaymentProof,
  type PaymentTerms,
} from '@/lib/agent-earn'
import { checkRateLimit, clientKeyFromHeaders } from '@agentic-income/engine'

// Header the agent sends its payment proof in. Not a standardized x402 header name yet —
// treat this as this template's convention, and confirm against whatever facilitator/spec
// revision you integrate against in production.
const PAYMENT_PROOF_HEADER = 'x-payment-proof'

// TODO(production): move pricing/payTo per resource into real config (env vars, a database,
// or the catalog data this template already loads elsewhere) instead of a hardcoded map.
// payTo below is a placeholder testnet-style address — never a real operator wallet checked
// into source. Replace via environment variable, and never commit the value that replaces it.
const RESOURCE_CATALOG: Record<string, { amount: string; description: string }> = {
  'sample-report': {
    amount: '0.10',
    description: 'Sample report resource — replace with a real priced output before going live.',
  },
}

const DEFAULT_NETWORK: PaymentNetwork = 'base-sepolia' // testnet default — see README before changing
const PLACEHOLDER_PAY_TO = '0x0000000000000000000000000000000000000000' // TODO(production): set via env var, never hardcode a real address here

function buildTerms(resource: string, amount: string): PaymentTerms {
  return {
    amount,
    asset: 'USDC',
    network: DEFAULT_NETWORK,
    payTo: PLACEHOLDER_PAY_TO,
    resource,
  }
}

function parseProofHeader(raw: string | null, resource: string): PaymentProof | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (
      typeof parsed?.txHash === 'string' &&
      typeof parsed?.network === 'string' &&
      typeof parsed?.amount === 'string'
    ) {
      return {
        txHash: parsed.txHash,
        network: parsed.network as PaymentNetwork,
        resource,
        amount: parsed.amount,
      }
    }
  } catch {
    // fall through to null — malformed proof is treated as no proof
  }
  return null
}

export async function GET(req: Request, { params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params

  const { allowed } = checkRateLimit(clientKeyFromHeaders(req.headers, 'agent-earn'), 30, 60_000)
  if (!allowed) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 })
  }

  const listing = RESOURCE_CATALOG[resource]
  if (!listing) {
    return NextResponse.json({ ok: false, error: 'unknown_resource' }, { status: 404 })
  }

  const terms = buildTerms(resource, listing.amount)
  const proof = parseProofHeader(req.headers.get(PAYMENT_PROOF_HEADER), resource)

  if (!proof) {
    // Disclose price and terms up front — same disclosure standard as an affiliate link.
    return NextResponse.json(paymentRequired(terms), { status: 402 })
  }

  const verification = await verifyPayment(proof)
  if (!verification.verified) {
    return NextResponse.json(
      { ...paymentRequired(terms), error: verification.reason },
      { status: 402 }
    )
  }

  // TODO(production): plug in the real agent output here — a generated report, a scored
  // data feed, an analysis, whatever this endpoint is actually charging for. Keep the
  // resource genuinely valuable per the network's honesty standard: don't sell a thin
  // wrapper, sell an outcome.
  return NextResponse.json({
    ok: true,
    resource,
    data: 'your valuable resource goes here — TODO: replace with real agent output',
  })
}
