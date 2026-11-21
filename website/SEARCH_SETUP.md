# Search and AI discovery setup

Prepared 21 November 2026. Google Search Console and Bing Webmaster account verification and sitemap submission remain pending owner sign-in. No traffic, ranking, indexing or AI citation results are claimed. No visitor analytics script was added.

## Connect when ready

1. Sign in to [Google Search Console](https://search.google.com/search-console). Add the **URL-prefix** property `https://deakkon.github.io/ai-leadership/`, including the project path. Do not attempt DNS verification of `github.io`.
2. Select HTML-tag verification and copy only the tag's `content` value. In this GitHub repository's Settings → Secrets and variables → Actions → Variables, create `GOOGLE_SITE_VERIFICATION` with that public value. It is an ownership token, not an account password or API credential.
3. For [Bing Webmaster Tools](https://www.bing.com/webmasters/), use its available site verification flow for the same site URL. For HTML meta-tag verification, create the repository variable `BING_SITE_VERIFICATION` using only its `content` value. If importing an already verified Google property is offered, that is an alternative to a separate Bing token.
4. Run the repository's **Deploy to GitHub Pages** workflow from Actions after saving variables. Tokens are incorporated at build time. Confirm the live homepage source contains the expected `google-site-verification` / `msvalidate.01` tag, then finish verification in each account. Keep the tags after verification.
5. Submit the absolute sitemap URL: `https://deakkon.github.io/ai-leadership/sitemap.xml`. Inspect the homepage and the AI strategy, software development and workflow automation pages using the account tools. Request indexing where supported. Submission does not guarantee indexing.

For local builds, the same optional variables can be supplied in `.env.local`; `.env.example` contains empty configuration examples. Never put account passwords or private credentials in them. With no tokens configured, the site emits no placeholder verification tags.

[Google ownership guidance](https://support.google.com/webmasters/answer/9008080?hl=en), [Bing ownership guidance](https://www2.bing.com/webmasters/help/add-and-verify-site-12184f8b).

## Hosting detail: robots.txt

The project exports `/ai-leadership/robots.txt`, but crawlers consult a host-root file at `https://deakkon.github.io/robots.txt`. The project file cannot control that host. The root returned 404 during the audit; absence of a robots file does not itself block crawling. Do not describe the project-path file as an effective policy.

For a deliberate crawl/training policy, manage the account's root Pages site or deploy on an owned, cleared custom domain. Recheck the actual host-root response then. Manual sitemap submission above works without changing root hosting. Do not change DNS, create another repository or enable model-training crawlers merely to complete verification.

[Google robots placement guidance](https://developers.google.com/crawling/docs/robots-txt/create-robots-txt).

## What has been prepared

- Static HTML service guides for AI strategy, custom software development and AI workflow automation; linked from home, services, relevant articles and the sitemap.
- Unique service metadata, canonical URLs retaining the GitHub Pages path, visible answers to buying questions and breadcrumbs.
- Consistent Organization and founder Person entities across pages; article attribution points to the founder page. Schema describes visible content; it does not establish accreditation or legal clearance.
- Existing `llms.txt` updated as a convenient summary. It is not required by Google and is not a ranking or citation guarantee.
- Export and verification-configuration tests run before Pages deployment.

Google says existing SEO fundamentals apply to its AI features and that no special AI file or schema is required. [Google AI discovery guidance](https://developers.google.com/search/docs/appearance/ai-features).

## Measurement once accounts are connected

Record the connection date, submitted sitemap status and inspected URLs first. Review weekly for the first month, then monthly:

- Index coverage and crawl/canonical errors for the service pages.
- Search impressions, clicks, CTR and relevant queries, separated by page and country. Use the actual reporting window; low-volume early figures can be noisy.
- Qualified enquiries and booked calls, recorded in the existing sales process with a self-reported source and relevant service interest. Email/booking interactions are not measured automatically by the website.
- Which opportunities turn into paid work, delivery margin and founder hours; do not optimize rankings independently of buyer fit.

For AI discovery, periodically record a small, consistent set of relevant questions, engine/model, date, answer and cited URL. Manual spot checks describe those observations only. They do not prove general visibility or attribution. Keep absent data unreported rather than filling a dashboard with invented zeros.

Next content work: a genuinely useful executive investment checklist and a clearly labeled worked decision memo, then permissioned case evidence. Avoid bulk location pages, invented testimonials or claims of guaranteed AI citations.
