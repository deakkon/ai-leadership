import { packages, pageMetadata } from "../../../lib/agency";
import { withBase } from "../../../lib/site-config";
export const metadata = pageMetadata(
  "Services & engagements — V2",
  "Explore AI leadership, technical discovery, focused software builds and ongoing delivery engagements.",
  "/v2/services/",
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
      <div className="v2-services-intro">
        <h2>Three kinds of work.</h2>
        <p>
          AI strategy and leadership. Software development. AI workflow
          automation. The package determines the scope and working relationship.
        </p>
      </div>
      <div className="v2-offers-grid">
        {packages.map((p, i) => (
          <a
            className="v2-service-offer"
            key={p.slug}
            href={withBase(`/v2/services/${p.slug}/`)}
          >
            <span className="v2-eyebrow">
              0{i + 1} / {p.category}
            </span>
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
        <a className="v2-link" href={withBase("/v2/#v2-packages")}>
          Compare packages interactively →
        </a>
      </div>
    </main>
  );
}
