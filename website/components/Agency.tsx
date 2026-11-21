import type { ReactNode } from "react";
import { identity, withBase } from "../lib/site";
import { packages } from "../lib/agency";
export function Wordmark() {
  return (
    <span className="agency-wordmark" aria-label="Hooman in the Loop">
      <span aria-hidden="true">
        h<span className="wordmark-loop">∞</span>man
        <span className="wordmark-tail"> in the loop</span>
        <span className="wordmark-period">.</span>
      </span>
    </span>
  );
}
export function AgencyCTA({
  title,
  description,
}: { title?: ReactNode; description?: ReactNode } = {}) {
  return (
    <section className="agency-cta" id="contact">
      <div>
        <p className="agency-kicker">Start with the problem</p>
        <h2>
          {title ?? (
            <>
              What should your software
              <br />
              make possible?
            </>
          )}
        </h2>
        <p>
          {description ?? (
            <>
              Bring a workflow, a stalled prototype or a product decision.
              <br />
              We’ll work out whether there’s a useful next step together.
            </>
          )}
        </p>
      </div>
      <div className="agency-actions">
        <a
          className="agency-button lime"
          href={identity.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Book an introductory call
        </a>
        <a className="agency-text-link" href={withBase("/contact/")}>
          Send a project brief
        </a>
        <span className="agency-small">
          Berlin · English, German &amp; Croatian
        </span>
      </div>
    </section>
  );
}
export function PageIntro({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <header className="agency-page-intro">
      <p className="agency-kicker">{kicker}</p>
      <h1>{title}</h1>
      <div className="agency-lead">{children}</div>
    </header>
  );
}
export function PackageGrid({ all = false }: { all?: boolean }) {
  return (
    <div className="agency-packages">
      {packages.slice(0, all ? 4 : 3).map((p) => (
        <article className="agency-package" key={p.slug}>
          <p className="agency-kicker">{p.category}</p>
          <h3>
            <a href={withBase(`/services/${p.slug}/`)}>{p.name}</a>
          </h3>
          <p>{p.summary}</p>
          <div className="agency-package-bottom">
            <p className="agency-price">
              {p.price}
              <span>{p.unit} · ex VAT where applicable</span>
            </p>
            <a
              className="agency-text-link"
              href={withBase(`/services/${p.slug}/`)}
            >
              Explore the scope
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}
export function LoopDiagram() {
  return (
    <div className="loop-plate">
      <div className="loop-plate-top">
        <span>THE DELIVERY LOOP</span>
        <span>Human judgment, throughout</span>
      </div>
      <svg
        viewBox="0 0 600 340"
        role="img"
        aria-labelledby="loop-title loop-description"
      >
        <title id="loop-title">Human direction and agent execution</title>
        <desc id="loop-description">
          An infinity loop connects human architecture and review with agent
          implementation and testing. Releases require human approval.
        </desc>
        <path
          className="loop-track"
          d="M300 170C220 30 70 35 70 170S220 310 300 170S530 35 530 170S380 310 300 170Z"
        />
        <path className="loop-highlight" d="M300 170C220 30 70 35 70 170" />
        <circle cx="70" cy="170" r="10" className="loop-human" />
        <circle cx="530" cy="170" r="10" className="loop-agent" />
        <circle cx="300" cy="170" r="17" className="loop-gate" />
        <path d="m293 170 5 5 10-11" className="loop-check" />
        <text x="160" y="166" textAnchor="middle">
          HUMAN
        </text>
        <text x="160" y="188" textAnchor="middle" className="loop-sub">
          Direction · review
        </text>
        <text x="440" y="166" textAnchor="middle">
          AGENTS
        </text>
        <text x="440" y="188" textAnchor="middle" className="loop-sub">
          Build · test
        </text>
      </svg>
      <div className="loop-mobile-legend" aria-hidden="true">
        <span>
          <strong>Human</strong>Direction · review
        </span>
        <span>
          <strong>Agents</strong>Build · test
        </span>
      </div>
      <div className="loop-plate-bottom">
        <span>Architecture. Implementation. Evidence.</span>
        <strong>One accountable lead.</strong>
      </div>
    </div>
  );
}
