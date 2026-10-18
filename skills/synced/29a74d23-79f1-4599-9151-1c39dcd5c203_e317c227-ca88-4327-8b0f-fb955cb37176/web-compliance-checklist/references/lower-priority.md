# Lower Priority — Real, But Don't Solve These Before Launch

These are genuine exposure, not fake risks — but treating them as launch blockers for a pre-revenue project is a common overcorrection. Flag them, do the free version now, revisit seriously once there's real traffic/revenue.

## Website Accessibility (ADA / WCAG)

There is no small-business exemption under ADA Title III — company size doesn't create a carve-out, and courts increasingly reference WCAG 2.1 AA as the practical standard even though it's only formally codified for government (Title II) sites, not private business. Litigation is real and demand-letter-driven, disproportionately targeting e-commerce. A lot of the "thousands of lawsuits" statistics circulating come from accessibility-vendor blogs with a product to sell — treat exact figures skeptically, but the underlying legal exposure is genuine.

**Do now (free)**: semantic HTML, alt text on images, keyboard-navigable forms and interactive elements, reasonable color contrast. This is close to zero-cost if the code isn't sloppy to begin with.

**Don't do now**: paid accessibility audits, overlay widgets (courts and plaintiffs' firms have specifically called these out as insufficient — they don't fix underlying code and some firms target sites that already have one installed). Revisit with a real audit once there's meaningful traffic or revenue.

## Sales Tax Nexus

See `payment-processing.md`. Not relevant below roughly $100k in sales to any single state. Stripe Tax or similar automates this later — no reason to build for it now.

## GDPR / International Privacy

Irrelevant unless deliberately marketing to or operating in the EU/UK. Don't build EU-style consent flows preemptively for a US-only product — see `cookies.md`.

## Web Scraping Legal Exposure (if the product involves scraping)

Different lane entirely from data-privacy compliance — this is contract/CFAA territory with whatever site is being scraped, not a "personal data" question. Scraping publicly accessible data has generally held up against Computer Fraud and Abuse Act claims (see *hiQ Labs v. LinkedIn*), but breach-of-contract exposure under the source site's own Terms of Service is separate and real. Worth knowing about, not worth solving preemptively — the practical risk is usually a cease-and-desist or IP block, not a lawsuit, unless scraping at meaningful commercial scale against a site that has explicitly litigated this before.
