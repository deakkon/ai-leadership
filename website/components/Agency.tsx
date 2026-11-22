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
        <h2>{title ?? <>What are you working on?</>}</h2>
        <p>
          {description ?? (
            <>
              Tell me what you want to improve. We can discuss the problem,
              whether I’m a fit and which kind of support you need.
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
          Write a project brief
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
export function PackageGrid({
  all = false,
  slugs,
}: {
  all?: boolean;
  slugs?: readonly string[];
}) {
  return (
    <div className="agency-packages">
      {(slugs
        ? packages.filter((p) => slugs.includes(p.slug))
        : packages.slice(0, all ? 4 : 3)
      ).map((p) => (
        <a
          className="agency-package"
          key={p.slug}
          href={withBase(`/services/${p.slug}/`)}
          aria-labelledby={`package-${p.slug}-title`}
        >
          <p className="agency-kicker">{p.category}</p>
          <h3 id={`package-${p.slug}-title`}>{p.name}</h3>
          <p>{p.summary}</p>
          <div className="agency-package-bottom">
            <p className="agency-price">
              {p.price}
              <span>{p.unit} · ex VAT where applicable</span>
            </p>
            <span className="agency-text-link package-card-link">
              See package details <span aria-hidden="true">↗</span>
            </span>
          </div>
        </a>
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
