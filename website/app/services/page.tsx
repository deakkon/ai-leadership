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
        <p className="v2-eyebrow">Services & engagements</p>
        <h1>
          What needs
          <br />
          to move forward?
        </h1>
        <p>
          Advice on AI investment, a defined software project, or ongoing
          leadership and engineering capacity. Each engagement starts with an
          agreed scope.
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
        <h2>Three kinds of work.</h2>
        <p>
          AI strategy and leadership. Software development. AI workflow
          automation. The package determines the scope and working relationship.
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
              Scope, process & use cases <span aria-hidden="true">↗</span>
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
          Compare packages interactively →
        </a>
      </div>
    </main>
  );
}
