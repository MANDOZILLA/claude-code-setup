# Payment Processing

## PCI compliance — stay in SAQ A, it's nearly free

The self-assessment tier depends entirely on integration method, not business size:
- **SAQ A** (simplest — ~20-30 yes/no questions, no external auditor, no meaningful cost): qualifies if card data never touches the operator's own server. This includes a fully-hosted checkout page (redirect to the processor's domain) **and** modern embedded card fields (e.g., current Stripe Elements/Payment Element, Braintree hosted fields) — as long as the card-entry UI is rendered by the processor's own script running client-side in the browser, not constructed by the operator's server.
- **SAQ A-EP or SAQ D** (much heavier — full audits, penetration testing): only triggered by legacy integrations that post raw card data through the operator's own server/API before it reaches the processor. Avoid this pattern entirely — there's no reason to build it when hosted checkout or modern Elements exist for free.

**Rule of thumb for whoever's building the integration**: never let raw card numbers touch your own backend. Use the processor's hosted or current SDK-based checkout. That alone keeps PCI scope minimal regardless of which processor (Stripe, Square, Braintree, etc.).

**2025/2026-specific**: PCI DSS v4.0.1 added a requirement (independent of SAQ tier) to inventory and monitor scripts running on the payment page itself — third-party analytics, A/B testing scripts, anything — to guard against skimming/injection attacks (Magecart-style). This applies even at SAQ A and is genuinely new, not legacy advice.

## Recurring billing / negative-option compliance

See `terms-of-service.md` — ROSCA and state auto-renewal laws require upfront disclosure, active consent, and self-serve cancellation. This is a build requirement (a real cancel button in the product), not just contract text.

## Refund policy

No law mandates specific refund terms for digital subscriptions. A stated policy (even "no refunds after X days") satisfies the disclosure requirement; silence does not.

## Sales tax — usually not relevant yet

Economic nexus thresholds are typically $100,000 in sales per state (post-*Wayfair*). SaaS/digital product taxability varies by state (e.g., NY and TX generally tax SaaS; CA, FL, MO generally don't). **Don't build anything for this until approaching six figures of revenue in any single state.** When it becomes real, Stripe Tax (or similar) automates collection — this is a "flip a switch later" problem, not a "build now" problem.

## Ask before writing

- Which payment processor, and hosted checkout vs. embedded fields vs. custom form?
- One-time or recurring?
- Rough revenue/geographic concentration (for the sales-tax "not yet" gut check)?
