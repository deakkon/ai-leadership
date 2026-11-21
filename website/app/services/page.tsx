import { AgencyCTA, PackageGrid, PageIntro } from "../../components/Agency";
import { pageMetadata } from "../../lib/agency";
export const metadata = pageMetadata(
  "Software delivery, AI automation & fractional leadership",
  "Choose a discovery sprint, a focused software build, an ongoing delivery partnership or fractional AI / CTO leadership.",
  "/services/",
);
export default function Services() {
  return (
    <main id="main" className="agency-main">
      <PageIntro kicker="Ways to work together" title="Start where you are.">
        <p>
          A useful decision. A bounded release. A steady delivery cadence.
          Choose the engagement that fits the problem.
        </p>
      </PageIntro>
      <PackageGrid all />
      <section className="agency-section agency-prose">
        <h2>Clear scope before commitment.</h2>
        <p>
          Discovery is useful when the work is ambiguous; it is not mandatory
          when a release is already well defined. Your proposal names the
          outcome, dependencies, acceptance tests, human oversight and delivery
          allocation.
        </p>
        <h3>Development costs and production costs are separate.</h3>
        <p>
          Our development tooling is covered by the project quote or agreed
          allowance. Your hosting, external services and production AI usage run
          in your own accounts, with budgets and alerts agreed before launch.
        </p>
        <h3>Support has its own scope.</h3>
        <p>
          Every build includes handover and a defined defect-remediation window.
          Ongoing monitoring, incident response and enhancement work are agreed
          separately. No 24/7 service is implied.
        </p>
      </section>
      <AgencyCTA />
    </main>
  );
}
