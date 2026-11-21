import { AgencyCTA, PackageGrid, PageIntro } from "../../components/Agency";
import { pageMetadata } from "../../lib/agency";
import { serviceGuides } from "../../lib/service-guides";
import { withBase } from "../../lib/site";
export const metadata = pageMetadata(
  "Software delivery, AI automation & fractional leadership",
  "Choose a discovery sprint, a focused software build, an ongoing delivery partnership or fractional AI / CTO leadership.",
  "/services/",
);
export default function Services() {
  return (
    <main id="main" className="agency-main">
      <PageIntro
        kicker="Services & packages"
        title="Find the right engagement."
      >
        <p>
          Advice on an AI investment, a software project or ongoing technical
          leadership. Explore the services and packages to see what fits.
        </p>
      </PageIntro>
      <section
        className="agency-section"
        aria-label="Find the service for your priorities"
      >
        <h2>What needs to move forward?</h2>
        <div className="service-tiles">
          {serviceGuides.map((guide) => (
            <a
              className="service-tile"
              key={guide.slug}
              href={withBase(`/services/${guide.slug}/`)}
              aria-labelledby={`service-${guide.slug}-title`}
            >
              <p className="agency-kicker">{guide.kicker}</p>
              <h3 id={`service-${guide.slug}-title`}>{guide.title}</h3>
              <p>{guide.fit}</p>
              <span className="agency-text-link">
                Explore this service <span aria-hidden="true">↗</span>
              </span>
            </a>
          ))}
        </div>
      </section>
      <section
        className="agency-section"
        id="packages"
        aria-labelledby="packages-title"
      >
        <div className="agency-section-head">
          <p className="agency-kicker">Choose an engagement</p>
          <h2 id="packages-title">Choose a package.</h2>
          <p>
            Explore each package for its scope, working process, example use
            cases and commercial terms.
          </p>
        </div>
        <PackageGrid all />
      </section>
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
