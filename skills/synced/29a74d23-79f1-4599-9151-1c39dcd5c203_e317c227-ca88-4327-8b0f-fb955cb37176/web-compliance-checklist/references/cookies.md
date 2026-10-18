# Cookies

## Don't over-build this

A full EU-style cookie consent banner (accept/reject buttons, granular category toggles) is a GDPR/ePrivacy obligation — it only applies if the product is targeting or actively monitoring EU/UK residents. A US-only product that occasionally gets an incidental EU visitor does not need one. Building a consent-management platform for a pre-revenue product is wasted engineering time.

## What actually applies to US-only products

A growing number of US states (12+ as of 2026: CA, CO, CT, DE, MD, MN, MT, NE, NH, NJ, OR, TX) require honoring the **Global Privacy Control (GPC)** browser signal as a valid opt-out of personal data sale/sharing. This is trivially satisfied for most small products: if the product doesn't sell or share personal data with third parties for advertising/monetization purposes, state that plainly in the privacy policy — there's nothing to opt out of, and the GPC obligation is moot.

## Minimum viable compliance

A short section in the privacy policy listing:
- What cookies/local storage are used and why (session/auth cookies, payment processor cookies, any analytics)
- A plain statement on whether personal data is sold/shared (usually "no")
- How Do Not Track / GPC signals are handled

That's sufficient for a US-facing product without ad-tech or data-sale business models. Escalate to a real consent banner only if: (a) EU/UK users are being actively targeted, or (b) third-party ad networks/data brokers get added to the stack.
