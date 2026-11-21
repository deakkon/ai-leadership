"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { packages } from "../lib/agency";
import type { PackageStory } from "../lib/package-stories";
import { withBase } from "../lib/site";

type Package = (typeof packages)[number];
const chapters = [
  {
    id: "scope",
    title: "What you get",
    note: "Fit, outcomes and deliverables",
  },
  {
    id: "journey",
    title: "How it works",
    note: "From the first conversation to the next decision",
  },
  {
    id: "examples",
    title: "Where it helps",
    note: "Three situations this engagement can address",
  },
  {
    id: "investment",
    title: "Investment & boundaries",
    note: "Costs, responsibilities and what sits outside the scope",
  },
] as const;

export default function PackageExplorer({
  offer,
  story,
}: {
  offer: Package;
  story: PackageStory;
}) {
  const [active, setActive] = useState<number | null>(0);
  const [enhanced, setEnhanced] = useState(false);
  const details = useRef<(HTMLDetailsElement | null)[]>([]);
  const reducedMotion = useReducedMotion() !== false;
  useEffect(() => setEnhanced(true), []);

  function goTo(index: number) {
    setActive(index);
    requestAnimationFrame(() => {
      const section = details.current[index];
      section?.querySelector("summary")?.focus({ preventScroll: true });
      section?.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      });
    });
  }

  const content = [
    <div key="scope" className="package-scope">
      <p className="package-outcome">{offer.outcome}</p>
      <h3>A useful fit when</h3>
      <p>{offer.audience}</p>
      <h3>Included in the engagement</h3>
      <ul>
        {offer.deliverables.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div className="package-takeaway">
        <span>The decision at the end</span>
        <p>{offer.acceptance}</p>
      </div>
    </div>,
    <div key="journey">
      <p>
        Each stage has a clear purpose and an output you can review. The final
        proposal sets the dates, dependencies and people involved.
      </p>
      <ol className="package-phases">
        {story.phases.map((phase, index) => (
          <li key={phase.title}>
            <span className="package-phase-number" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h3>{phase.title}</h3>
              <p>{phase.description}</p>
              <p className="package-phase-output">
                <strong>You leave with:</strong> {phase.output}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>,
    <div key="examples">
      <p className="package-example-note">
        <strong>Illustrative scenarios</strong> — these show potential
        applications, not client case studies or guaranteed results. Each needs
        its own agreed scope.
      </p>
      <div className="package-examples">
        {story.examples.map((example) => (
          <article className="package-example" key={example.title}>
            <h3>{example.title}</h3>
            <dl>
              <dt>The situation</dt>
              <dd>{example.problem}</dd>
                <dt>Approach</dt>
              <dd>{example.approach}</dd>
              <dt>A useful outcome</dt>
              <dd>{example.outcome}</dd>
            </dl>
          </article>
        ))}
      </div>
    </div>,
    <div key="investment">
      <h3>Scope and dependencies</h3>
      <p>{offer.exclusions}</p>
      <h3>Payment and agreement</h3>
      <p>
        {offer.payment} The proposal sets start dates, responsibilities,
        confidentiality, IP rights and cancellation terms.
      </p>
      <h3>AI and infrastructure costs</h3>
      <p>{offer.usage}</p>
      <h3>Human accountability</h3>
      <p>
        Jurica owns technical direction and release review. Agents work on
        bounded tasks with tests and review. Specialist involvement is named in
        the delivery plan.
      </p>
      <h3>After handover</h3>
      <p>
        For implementation work, we propose a 30-day window for reporting
        deviations from agreed acceptance criteria. Enhancements and ongoing
        operations need a separate scope. Contractual terms and statutory rights
        remain governed by the signed agreement and applicable law.
      </p>
      <a className="agency-button" href={withBase("/contact/")}>
        Discuss this engagement
      </a>
    </div>,
  ];

  return (
    <section
      className="package-explorer"
      data-package-explorer
      aria-labelledby="package-explorer-title"
    >
      <header className="package-explorer-header">
        <div>
          <p className="agency-kicker">A closer look</p>
          <h2 id="package-explorer-title">Explore the engagement.</h2>
        </div>
        <p>Open any section, or follow the journey in order.</p>
      </header>
      {chapters.map((chapter, index) => (
        <details
          key={chapter.id}
          id={`explore-${chapter.id}`}
          className="package-chapter"
          open={active === index}
          ref={(node) => {
            details.current[index] = node;
          }}
        >
          <summary
            onClick={(event) => {
              event.preventDefault();
              if (active === index) setActive(null);
              else goTo(index);
            }}
          >
            <span className="package-chapter-number" aria-hidden="true">
              0{index + 1}
            </span>
            <span className="package-chapter-label">
              <span>{chapter.title}</span>
              <span>{chapter.note}</span>
            </span>
            <span className="package-chapter-toggle" aria-hidden="true"></span>
          </summary>
          <motion.div
            className="package-chapter-body"
            initial={false}
            animate={{ y: reducedMotion || active === index ? 0 : 8 }}
            transition={{ duration: reducedMotion ? 0 : 0.22, ease: "easeOut" }}
          >
            {content[index]}
            {enhanced && (
              <nav
                className="package-chapter-controls"
                aria-label={`${chapter.title} navigation`}
              >
                {index > 0 ? (
                  <button
                    type="button"
                    className="agency-text-link"
                    onClick={() => goTo(index - 1)}
                  >
                    ← Previous section
                  </button>
                ) : (
                  <span className="agency-small">01 / 04</span>
                )}
                {index < chapters.length - 1 ? (
                  <button
                    type="button"
                    className="agency-button small"
                    onClick={() => goTo(index + 1)}
                  >
                    Next: {chapters[index + 1].title}{" "}
                    <span aria-hidden="true">→</span>
                  </button>
                ) : (
                  <a
                    className="agency-text-link"
                    href={withBase("/services/#packages")}
                  >
                    Compare the packages →
                  </a>
                )}
              </nav>
            )}
          </motion.div>
        </details>
      ))}
    </section>
  );
}
