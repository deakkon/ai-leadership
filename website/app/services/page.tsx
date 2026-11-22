import { packages, pageMetadata } from "../../lib/agency";
import { serviceGuides } from "../../lib/service-guides";
import { withBase } from "../../lib/site-config";
export const metadata = pageMetadata(
  "Services & engagements",
  "Explore AI leadership, technical discovery, focused software builds and ongoing delivery engagements.",
  "/services/",
);
export default function Services() {
  return (
    <main id="main" className="v2-main v2-detail">
      <header className="v2-page-heading">
        <h1>
          AI strategy and
          <br />
          software development.
        </h1>
        <p>
          I help you decide where AI fits, build software and automate
          workflows. Start with the problem below, then compare packages for
          scope and pricing.
        </p>
      </header>
      <section
        className="v2-section"
        aria-label="Find the service for your priorities"
      >
        <div className="v2-evidence-grid">
          {serviceGuides.map((guide) => (
            <a
              className="v2-service-card"
              href={withBase(`/services/${guide.slug}/`)}
              key={guide.slug}
            >
              <h2>{guide.title}</h2>
              <p>{guide.fit}</p>
              <span>Explore this service</span>
            </a>
          ))}
        </div>
      </section>
      <div className="v2-services-intro">
        <h2>Choose the support you need.</h2>
        <p>
          Assess one opportunity, deliver a release, or agree ongoing leadership
          or engineering support.
        </p>
      </div>
      <div className="v2-offers-grid" id="packages">
        {packages.map((p, i) => (
          <a
            className="v2-service-offer"
            key={p.slug}
            href={withBase(`/services/${p.slug}/`)}
          >
            <h2>{p.name}</h2>
            <p>{p.summary}</p>
            <span className="v2-offer-time">{p.timeline}</span>
            <div className="v2-offer-price">
              <strong>{p.price}</strong>
              <span>{p.unit} · ex VAT where applicable</span>
            </div>
            <span className="v2-link">
              See package details <span aria-hidden="true">↗</span>
            </span>
          </a>
        ))}
      </div>
      <div className="v2-detail-note">
        <p>
          Production hosting and model usage are separate. Support, specialist
          capacity and final scope are agreed in writing.
        </p>
        <a className="v2-link" href={withBase("/#v2-packages")}>
          Compare packages
        </a>
      </div>
    </main>
  );
}
