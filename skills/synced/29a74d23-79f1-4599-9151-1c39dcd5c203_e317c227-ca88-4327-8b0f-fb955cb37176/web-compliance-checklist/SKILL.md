---
name: web-compliance-checklist
description: >
  Determine what legal/compliance work a website or app actually needs:
  privacy policy, terms of service, cookie handling, payment processing
  (PCI/recurring billing), cold email (CAN-SPAM), accessibility,
  minor-operator issues, sales tax. Use this whenever the user is about to
  launch, monetize, add payments/subscriptions to, add auth/data collection
  to, or send outbound email from any project, even if they do not use the
  word compliance. Trigger on phrases like: can I charge money for this, add
  Stripe, launch this, is this legal, add a login or signup, send cold
  emails, who needs a privacy policy, or any pre-launch checklist request.
  This is a general-purpose decision tree, not tied to any specific product;
  apply it fresh to whatever project is being discussed by asking what the
  project actually does, not by assuming.
---

# Web Compliance Checklist

A decision tree for figuring out what compliance work a given site/app genuinely needs, based on what it actually does — not a generic "add a privacy policy" reflex, and not a full legal audit for a project with zero users.

**How to use this**: don't dump the whole reference doc on the user. Ask/determine which triggers apply (see below), then only pull in the relevant `references/*.md` file for depth. Most projects hit 2-4 branches, not all of them.

## Step 1 — Establish the facts

Before anything else, figure out:
1. Does it collect ANY personal info (email, name, IP via analytics, account signup)? → almost always yes if there's a login or a form.
2. Does it charge money, and if so, one-time or recurring?
3. Does it send outbound/cold email to people who didn't sign up first?
4. Is the operator (or a co-founder/owner) a minor?
5. Could its userbase plausibly include anyone under 13, even incidentally?
6. Is it US-only, or does it have (or want) EU/UK/international users?

Don't guess — ask if unclear. Getting this wrong means giving advice for the wrong risk profile.

## Step 2 — Route to the branches that apply

| If... | Then read | Priority |
|---|---|---|
| Collects any personal info via a US-reachable website | `references/privacy-policy.md` | **Do this now, regardless of scale** — CalOPPA's threshold is zero |
| Charges money at all | `references/payment-processing.md` | Now, before first transaction |
| Charges *recurring*/subscription | `references/terms-of-service.md` (recurring billing section) | Before first charge — this is a product/UX requirement, not just text |
| Sends unsolicited outbound email (cold email, scraped-list outreach) | `references/can-spam.md` | Now — build it into the sending pipeline, not an afterthought |
| Operator is a minor | `references/minor-operator.md` | First — this blocks Stripe/LLC/contracts and should be resolved before anything else |
| Userbase could include under-13s | `references/coppa.md` | Now if true — enforcement is active, not a future date |
| Public-facing site with real traffic ambition | `references/lower-priority.md` (accessibility) | Cheap fixes now (alt text, semantic HTML), real audit later |
| Approaching real revenue ($50k+/yr in any one state) | `references/lower-priority.md` (sales tax) | Not yet — flag and move on |
| Has or wants EU/UK users | `references/lower-priority.md` (GDPR) | Not yet unless deliberately targeting |

## Step 3 — Give the actual answer

For each branch that applies, the referenced file has: what the law/rule actually requires, why it applies at this stage (or doesn't), and the specific build/text implication — not just "you need a privacy policy," but what has to be *in* it and what has to be *built*, not just written.

Always distinguish, out loud, between:
- **Blocking** — can't legally operate/charge without this (e.g., minor + Stripe, CalOPPA privacy policy, CAN-SPAM footer)
- **Real but not urgent** — true exposure, doesn't need solving before launch (e.g., accessibility audit, sales tax nexus, GDPR)

Don't let the second category bloat the response or stall a launch. This is a known failure mode: treating a complete legal audit as a prerequisite for shipping. It isn't.

## Step 4 — Caveat once, don't repeat it

State once, plainly, near the end: this is not legal advice, and the actual privacy policy/ToS text should come from a real generator (Termly, GetTerms) at minimum, or an attorney for anything with real money moving through it. Don't caveat every individual point — that's noise.

## Notes on staying current

Several of the specific figures in the reference files (penalty amounts, state counts, thresholds) change yearly — state privacy law counts grow, FTC rulemaking status shifts, PCI DSS versions update. If the conversation suggests real money is about to move (first Stripe transaction, first real customer), do a fresh web search on anything time-sensitive (current FTC negative-option rule status, current state privacy law count, current CAN-SPAM penalty figure) rather than trusting the reference files verbatim if they're more than ~6 months old.
