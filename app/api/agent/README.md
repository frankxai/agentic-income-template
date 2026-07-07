# agent-earn: the pay-per-call endpoint

This is the "your agent charges per call" starter from the `income-web3` layer —
the sharpest edge of the `disrupt` lens. Instead of monetizing an audience
(affiliate, products), this endpoint monetizes what an agent *produces*: it sells
one call's worth of output for stablecoin, gated by HTTP 402, with no accounts,
API keys, or invoicing.

## The flow

```
GET /api/agent/<resource>
  → 402 Payment Required   { x402: { amount, asset, network, payTo, resource } }
  ← agent settles on-chain (stablecoin, e.g. USDC)
GET /api/agent/<resource>  (+ x-payment-proof header)
  → verifyPayment() checks the settlement
  → 200 { the resource }   — if verified
  → 402 again              — if not
```

`amount` is priced in cents-to-dollars — the unit economics x402 exists for.
Card rails can't do a $0.10 charge profitably; stablecoin settlement can.
**Disclose the price before the charge is made** — the 402 response *is* that
disclosure; don't hide pricing behind a support page.

## What's here right now — dry-run / testnet only

- `lib/agent-earn.ts` — `paymentRequired()`, `verifyPayment()`, `checkSpendGuardrail()`,
  and the `PaymentTerms` / `PaymentProof` / `SpendPolicy` types.
- `app/api/agent/[resource]/route.ts` — the gated route. One sample resource
  (`sample-report`, priced at `$0.10`) is wired in as a placeholder.

**No real wallet spend happens anywhere in this code.** `verifyPayment()` is a
stub that always returns `{ verified: false, reason: 'verification not wired — testnet stub' }`.
The route's `payTo` is a zero address placeholder. Nothing here can move real
money until an operator wires real chain verification and swaps in a real payout
address — deliberately, not by accident.

## Testing it right now

```bash
curl -i http://localhost:3000/api/agent/sample-report
# → 402, body: { "x402": { "amount": "0.10", "asset": "USDC", "network": "base-sepolia", ... } }

curl -i http://localhost:3000/api/agent/sample-report \
  -H 'x-payment-proof: {"txHash":"0xtest","network":"base-sepolia","amount":"0.10"}'
# → still 402 today — verifyPayment() is an honest stub, not a demo that fakes success
```

That second call staying a 402 is correct behavior, not a bug — see "Wiring it
for real" below.

## The mandatory guardrail: `checkSpendGuardrail()`

Per `income-web3/SKILL.md`, an agent with an unguarded wallet is a liability,
not an asset. `checkSpendGuardrail()` in `lib/agent-earn.ts` enforces, before
any spend an *operator's own agent* makes (as the payer, not just as this
endpoint's seller side):

- a hard **per-transaction cap**
- a hard **daily cap** — tracked in-memory, best-effort, and explicitly **not
  durable**: it resets on cold start and isn't shared across instances/regions.
  Treat it as a speed bump, not a ledger. Back it with a real store (a database
  row per operator/day) before relying on it for anything that matters.
- an **allowlist** of exactly what the agent may pay for

Call this guardrail on every outbound spend path before this template's future
agent-to-agent commerce work goes anywhere near a real wallet.

## Wiring it for real: what to install and where it plugs in

Nothing below is installed. Per the constraints this scaffold was built under,
these are documented, not added to `package.json`:

- **A chain client** — `viem` or `ethers`, to read the target chain and confirm
  a transfer actually happened (`npm install viem` or `npm install ethers`).
- **An x402 facilitator client**, if you'd rather verify through a hosted
  facilitator than raw RPC — check https://www.x402.org for the current
  facilitator list (membership includes Coinbase/Circle infra this network
  already touches).
- **An agent wallet with policy controls** — e.g. Coinbase Agentic Wallets /
  AgentCore Payments (launched Feb 2026) for policy-based spending limits and
  an audit trail on the *paying* side, if this operator's agent is also going
  to be the one spending, not just the one getting paid.

**The plug-in point for real on-chain verification is `verifyPayment()` in
`lib/agent-earn.ts`.** That function's doc comment spells out the five things
a real implementation must check (tx mined/confirmed, amount + asset match,
recipient matches `payTo`, network matches, and replay protection against
reusing the same tx hash for multiple calls). Swap the stub body for a real
chain lookup there; nothing else in this endpoint needs to change shape.

## The hard rules (non-negotiable, not just style)

- **Never a real private key in code, ever.** Not in this repo, not in an env
  var checked into source, not in a comment "for reference." Custody and keys
  are the operator's. Treat a key like Frank's `reality.md`: never commit,
  never transmit.
- **Never a real spend without the operator's explicit go-ahead for that
  specific spend.** Testnet and dry-run first, always — this scaffold ships
  entirely on that side of the line.
- **No token launches, no "agent coin," no yield/staking promises.** This
  layer sells services for stablecoin. Speculation is a different, off-thesis
  business.
- **Price disclosure before the charge** — the 402 body already does this;
  don't build a version that charges silently.

## Where this goes next

- Real resource behind the placeholder: swap the `sample-report` stub output
  for whatever the operator's agent actually produces (a research report, a
  scored feed, a generated asset) — priced honestly, not as a thin wrapper.
- Real verification: implement `verifyPayment()` per the TODOs in
  `lib/agent-earn.ts`.
- Agent-to-agent commerce: only after the single-endpoint case is earning for
  real. Two agents transacting to complete a task neither could alone is the
  frontier case in the design spec — build it once there's a working single
  payer/payee loop to extend, not before.
