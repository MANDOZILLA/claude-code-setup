# Terms of Service

## No blanket law forces a ToS the way CalOPPA forces a privacy policy

But the moment there's recurring/subscription billing, federal and state law effectively require specific *behavior*, not just text.

## Recurring billing — this is a product requirement, not just legal text

**ROSCA** (Restore Online Shoppers' Confidence Act) is a federal law, still fully in force, requiring for any negative-option/auto-renewing charge:
1. Clear, upfront disclosure of all material terms (price, that it renews, how to cancel) *before* collecting billing info
2. Express informed consent before charging (a checkbox the user actively checks — not pre-checked, not buried)
3. A simple mechanism to stop future charges

The FTC's more aggressive "click-to-cancel" rule was vacated by the 8th Circuit in July 2025 on a procedural technicality (the FTC skipped a required cost-benefit analysis) and the FTC is mid-rulemaking on a replacement as of 2026 — treat this as **unsettled, check current status before relying on its absence**. What hasn't gone anywhere: ROSCA itself, and ~30 states with their own automatic-renewal laws (California's is the strictest and often the reference point even for non-CA-based operators, since it's usually cheaper to build one compliant flow than a per-state one).

**Practical implication**: cancellation needs to be at least as easy as signup. If signup is self-serve online, cancellation needs a self-serve button in the product — "email us to cancel" is a real legal risk, not just bad UX.

## Standard clauses to include

- Liability limitation / warranty disclaimer
- IP ownership (who owns user-generated content vs. the platform)
- Acceptable use policy
- Termination rights (both directions)
- Arbitration clause + class-action waiver (standard, reduces litigation exposure)
- Governing law / venue
- If the product uses AI/ML output that informs user decisions (forecasts, recommendations, generated content used for real decisions) — an explicit disclaimer that outputs are estimates, not guarantees, and the user owns the resulting decision. This is not boilerplate — it's the actual liability shield when the model is sometimes wrong, which it will be.
- Refund policy — no law mandates specific terms for digital subscriptions, but silence is worse than a stated policy ("no refunds after X days" is legal and sufficient); ROSCA/state ARLs require *disclosing* cancellation/refund terms upfront, not any particular generosity.

## Ask before writing

- One-time or recurring billing?
- What jurisdiction/state is the operator based in (governing law)?
- Does the product produce AI-generated output that users act on materially?
- Is there user-generated content, and who should own it?
