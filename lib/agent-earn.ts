// agent-earn — reusable helpers for x402-gated endpoints (the "agent charges per call" starter).
//
// Design spec: agentic-income-skills/skills/income-web3/SKILL.md. Read that file before
// changing the shape of these helpers — it defines the honesty guardrails this module exists
// to enforce (testnet/dry-run first, mandatory spend guardrail, no real key in code, disclose
// price before charging).
//
// x402 flow this module supports:
//   agent → GET resource → 402 { x402: payment terms } → agent settles on-chain →
//   agent → GET resource + proof header → verifyPayment() → 200 { resource }
//
// Zero runtime dependencies. Everything below is Next.js built-ins + Web Crypto + plain TS.

/** Stablecoin asset identifiers this template expects to be priced in. Extend as needed. */
export type PaymentAsset = 'USDC' | 'USDT' | 'DAI'

/**
 * Network identifiers. Testnets are listed first and are the only ones this template's
 * stub code is meant to be exercised against before an operator has done real integration
 * work and given explicit go-ahead for mainnet spend.
 */
export type PaymentNetwork =
  | 'base-sepolia' // testnet — default for this template
  | 'base' // mainnet — do not point production traffic here without explicit operator sign-off
  | 'ethereum-sepolia'
  | 'ethereum'

/** Terms the server quotes back in the 402 body. Amount is a decimal string, e.g. "0.10". */
export interface PaymentTerms {
  /** Decimal amount as a string to avoid floating-point money bugs, e.g. "0.10" for ten cents. */
  amount: string
  asset: PaymentAsset
  network: PaymentNetwork
  /** The wallet address that should receive payment. Never a private key — address only. */
  payTo: string
  /** The resource identifier this quote is for, e.g. "reports/q3-market-scan". */
  resource: string
}

/** The 402 response body shape per the x402 convention: a top-level `x402` key. */
export interface X402PaymentRequiredBody {
  x402: PaymentTerms
}

/**
 * Builds the JSON body for a 402 Payment Required response. Callers wrap this in
 * NextResponse.json(paymentRequired(terms), { status: 402 }).
 */
export function paymentRequired(terms: PaymentTerms): X402PaymentRequiredBody {
  return { x402: terms }
}

/** The proof an agent sends back after settling on-chain, typically via a request header. */
export interface PaymentProof {
  /** On-chain transaction hash / settlement reference the agent is claiming as proof of payment. */
  txHash: string
  /** Network the proof claims settlement happened on. Must match the quoted PaymentTerms.network. */
  network: PaymentNetwork
  /** The resource this payment was for — must match the requested resource, not just any resource. */
  resource: string
  /** Amount the agent claims to have paid — must match or exceed PaymentTerms.amount. */
  amount: string
}

export interface VerificationResult {
  verified: boolean
  reason: string
}

/**
 * STUB — on-chain settlement verification. This is where real x402 integration goes.
 *
 * TODO(production): replace this stub with real verification before accepting any live
 * traffic that gates a real resource. A real implementation needs to, at minimum:
 *   1. Look up `proof.txHash` on `proof.network` via an RPC provider or indexer
 *      (e.g. viem/ethers public client, or a facilitator service such as Coinbase's
 *      x402 facilitator — see https://www.x402.org for the current facilitator list).
 *   2. Confirm the transaction is mined/finalized (respect the chain's confirmation depth —
 *      testnets and L2s differ; don't treat "pending" as paid).
 *   3. Confirm the transfer amount and asset match `terms.amount` / `terms.asset` (compare
 *      as integers in the token's smallest unit, not floats).
 *   4. Confirm the recipient is the operator's `payTo` address — a proof paying a different
 *      address must not verify.
 *   5. Confirm the transaction hasn't already been redeemed for this resource (replay
 *      protection — persist spent tx hashes in real storage, not memory; see
 *      checkSpendGuardrail's daily-cap comment for why in-memory state doesn't survive
 *      serverless cold starts).
 *
 * Until that's wired up, this always returns unverified. Do not remove this stub's failure
 * mode as a shortcut to "make the demo work" — a verifier that defaults to `true` is a free
 * resource, not a paid one.
 */
export async function verifyPayment(_proof: PaymentProof): Promise<VerificationResult> {
  // TODO(production): call a chain client / x402 facilitator here. Suggested deps to add
  // when wiring this up for real (see app/api/agent/README.md for install commands):
  //   - viem or ethers — read the chain, confirm the transfer.
  //   - a x402 facilitator SDK/client, if using a hosted facilitator instead of verifying
  //     directly against RPC.
  return {
    verified: false,
    reason: 'verification not wired — testnet stub',
  }
}

export type SpendDecision =
  | { allowed: true }
  | { allowed: false; reason: string }

/** A single guardrail request to evaluate — what the agent wants to spend, and on what. */
export interface SpendRequest {
  /** Decimal amount as a string, same convention as PaymentTerms.amount. */
  amount: string
  asset: PaymentAsset
  /** The resource or counterparty identifier the spend is for, checked against the allowlist. */
  target: string
}

/**
 * Spend policy the operator sets. This is the MANDATORY guardrail called out in
 * income-web3/SKILL.md — an agent with an unguarded wallet is a liability, not an asset.
 */
export interface SpendPolicy {
  /** Hard cap per single transaction, decimal string in the same asset as the request. */
  perTransactionCap: string
  /** Hard cap on total spend per rolling day, decimal string. */
  dailyCap: string
  /** Exact set of resource/target identifiers the agent is allowed to pay for. */
  allowlist: string[]
}

// Best-effort, non-durable daily spend tracker. This resets on every cold start/deploy and is
// NOT shared across serverless instances or regions — it is a speed bump against accidental
// runaway spend within a single warm instance, not a real ledger. TODO(production): back this
// with a real store (e.g. a database row per operator/day) before relying on the daily cap for
// anything that matters financially.
const dailySpendByKey = new Map<string, { day: string; total: number }>()

function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

function parseAmount(amount: string): number {
  const n = Number(amount)
  return Number.isFinite(n) ? n : NaN
}

/**
 * Enforces the mandatory spend guardrail: per-transaction cap, daily cap (in-memory,
 * best-effort — see dailySpendByKey comment), and an allowlist of what the agent may pay for.
 *
 * `trackingKey` scopes the daily cap — e.g. the operator's wallet address or agent id. Pass
 * something stable across calls for the cap to mean anything.
 */
export function checkSpendGuardrail(
  request: SpendRequest,
  policy: SpendPolicy,
  trackingKey: string
): SpendDecision {
  const amount = parseAmount(request.amount)
  if (!Number.isFinite(amount) || amount <= 0) {
    return { allowed: false, reason: 'invalid_amount' }
  }

  if (!policy.allowlist.includes(request.target)) {
    return { allowed: false, reason: 'target_not_allowlisted' }
  }

  const perTxCap = parseAmount(policy.perTransactionCap)
  if (amount > perTxCap) {
    return { allowed: false, reason: 'exceeds_per_transaction_cap' }
  }

  const dailyCap = parseAmount(policy.dailyCap)
  const day = todayKey()
  const existing = dailySpendByKey.get(trackingKey)
  const spentSoFar = existing && existing.day === day ? existing.total : 0

  if (spentSoFar + amount > dailyCap) {
    return { allowed: false, reason: 'exceeds_daily_cap' }
  }

  dailySpendByKey.set(trackingKey, { day, total: spentSoFar + amount })
  return { allowed: true }
}
