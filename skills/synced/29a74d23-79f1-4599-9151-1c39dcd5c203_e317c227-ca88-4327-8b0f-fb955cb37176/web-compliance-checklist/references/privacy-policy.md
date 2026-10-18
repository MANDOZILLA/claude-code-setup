# Privacy Policy

## Why this applies even at zero users

Not because of CCPA or the big state privacy laws — almost no early-stage project hits their thresholds. It's California's **CalOPPA** (California Online Privacy Protection Act), which has **no revenue or user-count threshold at all**. The only test: does the site collect any personally identifiable info, and is it reachable by California residents? Any US-facing website qualifies by default. This is why virtually every commercial site has a privacy policy regardless of size — it's not optional boilerplate, it's the actual reason.

CalOPPA enforcement is AG-only (no private right of action), capped around $2,500/violation, and not aggressively pursued against tiny sites — but compliance costs approximately nothing (a correct policy, once), so there's no reason to skip it.

## The bigger state laws — usually don't apply yet, check thresholds

~20 US states now have comprehensive privacy laws (2026), but almost all have thresholds that exempt small operators:
- CCPA (California): $25M+ revenue, OR 100,000+ consumers' data, OR 50%+ revenue from selling data
- Most Virginia-model states: similar consumer-count thresholds (often 100,000)
- **Exceptions with no/low revenue threshold: Texas and Montana.** If the project has real users in either state, check applicability even at small scale.

## COPPA — check this explicitly, don't assume it doesn't apply

If the product's userbase could plausibly include anyone under 13 — even incidentally (e.g., a study tool, a game, anything a middle schooler might use even if not the target audience) — COPPA applies and requires verifiable parental consent before collecting their data. This isn't a someday problem: the FTC's amended COPPA rule has an active compliance deadline (April 22, 2026) and enforcement is live. Ask directly: "who realistically uses this, and could any of them be under 13?" Don't take the stated target audience at face value if the product's nature suggests a younger real userbase.

## What the policy needs to actually contain

Generic template = worse than nothing, because now there's a written statement not matching reality (its own violation). The policy must reflect what the product *actually* does:
- What's collected (name, email, payment info, usage data, location, etc.) and via what mechanism (signup form, auth provider, analytics)
- **Every third-party processor personal data flows through** — auth providers, payment processors, LLM/AI API calls (if user data is sent to an LLM API for processing, that's a sub-processor and needs disclosing), analytics, hosting/database providers
- Data retention and deletion practices
- User rights (access/deletion requests) if any state law with a private mechanism applies
- Cookie/tracking disclosure (see cookies section, often folded into this same doc for small products)
- How the operator responds to Do Not Track / Global Privacy Control signals (can legally say "we don't honor DNT" as long as it's disclosed — but if not selling data, GPC compliance is trivial: state plainly that no personal data is sold/shared)

## Ask before writing

- What does this collect, and from whom (which forms, which auth flow)?
- What third-party APIs/services see that data (payment processor, LLM API, analytics, email tool)?
- Any reason to think users could be under 13?
- Any specific states with concentrated userbase (matters for TX/MT threshold check)?
