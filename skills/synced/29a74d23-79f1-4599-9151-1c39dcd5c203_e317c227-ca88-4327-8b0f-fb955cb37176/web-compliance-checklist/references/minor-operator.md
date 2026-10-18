# Minor Operator

Resolve this first — it blocks or complicates almost everything else (payment processing, contracts, business entity formation) and one fix generally solves multiple problems at once.

## Payment processors require an adult

Stripe's actual account agreement: anyone under 18 must add an adult "Representative" (parent or legal guardian) to the account. Both the minor and the adult agree to be bound by the terms, and the adult is contractually responsible and liable for the account's actions and compliance. This is a hard requirement, not a workaround to find a way past — other major processors (Square, PayPal, etc.) have similar age-of-majority requirements for the primary account holder.

## LLC formation

State rules on whether a minor can be a formation "organizer" are inconsistent across sources — don't trust a single listicle, including this one, on which specific states restrict it. What's consistent everywhere: **every state allows a minor to *own* an LLC interest, but none allow a minor to *manage* the LLC or sign contracts on its behalf.** An adult fiduciary is required regardless of state — a parent/guardian as organizer and manager, structured manager-managed, with the minor as the economic (non-managing) member is the standard, state-agnostic fix. This sidesteps the whole "which states restrict this" question entirely, since it's needed either way to produce a legally enforceable signer.

## Why this matters even where the law is silent

Even in a state that technically permits a minor to sign as an LLC organizer, contracts a minor personally signs (with a payment processor, a customer, a vendor) are generally voidable by the minor. This is exactly why counterparties (Stripe, banks, serious vendors) require an adult regardless of what the state's LLC statute says — the contract-law issue is separate from and broader than the entity-formation issue.

## Sequencing

1. Get a parent/guardian to agree to be the Stripe Representative and (if forming an LLC) the organizer/manager — one conversation covers both.
2. Everything downstream (charging money, signing vendor agreements, opening a business bank account) becomes straightforward once this is resolved.
3. This is not legal advice for the specific operating agreement — a real attorney or formation service should draft that document once real revenue justifies it.

## Ask before writing

- Is there a parent/guardian willing to be added as the account representative / LLC manager?
- What state would the entity be formed in (usually where the minor resides)?
- Is real revenue imminent (determines urgency of LLC vs. operating informally a bit longer)?
