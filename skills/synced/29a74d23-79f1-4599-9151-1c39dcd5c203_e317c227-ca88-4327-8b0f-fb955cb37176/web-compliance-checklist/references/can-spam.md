# CAN-SPAM (Cold / Outbound Email)

## Kill the "B2B is exempt" myth immediately

There is no B2B exemption. A single hand-written email to one business prospect is fully in scope if its primary purpose is commercial. Liability lands on **both** the company whose product is being promoted and whoever actually sends the email — building a separate tool to send it doesn't create legal distance.

## Required in every commercial email sent to US recipients

1. Accurate "From" name/address — no spoofing or misleading sender info
2. Non-deceptive subject line (a "Re:" on a cold email that isn't actually a reply is a violation)
3. Clear identification as an ad, unless the recipient already opted in
4. A valid physical postal address — a USPS-registered PO box or commercial mail-receiving agency address is fine; **don't use a home address**, especially if the operator is a minor
5. A working one-click opt-out — cannot require login, cannot require more than one page/action
6. Opt-outs processed within 10 business days (automate this — manual processing will eventually miss the deadline)
7. Monitoring of any third party (agency, tool, affiliate) sending on your behalf — outsourcing doesn't outsource liability

## Build implication

Since these requirements are mechanical (footer content, unsubscribe link behavior, suppression list), bake them into the sending pipeline/tool itself rather than trusting each individual email draft to include them correctly. A suppression list synced across every send path is the standard fix for opt-out compliance at scale.

## Practical risk calibration

Statutory penalties are large on paper (tens of thousands per email, adjusted annually), but real FTC/state enforcement targets high-volume, repeat, deceptive senders — not small-scale outbound with a compliant footer. The fixes above cost nothing to build; there's no reason to skip them regardless of current volume.

## International note

CAN-SPAM only covers US recipients. Emailing EU residents brings GDPR into play (generally requires an opt-in/legitimate-interest basis, not just an opt-out mechanism) and Canadian recipients trigger CASL (opt-in required absent an existing business relationship). Don't assume the CAN-SPAM checklist covers international sends.

## Ask before writing

- Who sends this, and on whose behalf (matters for the shared-liability point)?
- What tool/pipeline sends it — is there a single suppression list, or multiple disconnected ones?
- Any international recipients?
