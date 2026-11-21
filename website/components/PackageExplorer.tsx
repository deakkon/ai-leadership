"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { packages } from "../lib/agency";
import type { PackageStory } from "../lib/package-stories";
import { withBase } from "../lib/site";
import AnimatedChapter, { chapterItem } from "./AnimatedChapter";

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
  const sections = useRef<(HTMLDivElement | null)[]>([]);
  const pendingScroll = useRef<number | null>(null);
  const reducedMotion = useReducedMotion() !== false;
  const itemVariants = chapterItem(reducedMotion);
  useEffect(() => setEnhanced(true), []);

  function goTo(index: number) {
    pendingScroll.current = index;
    setActive(index);
    requestAnimationFrame(() => {
      sections.current[index]
        ?.querySelector<HTMLButtonElement>(".package-chapter-trigger")
        ?.focus({ preventScroll: true });
    });
  }

  function finishOpening(index: number) {
    if (pendingScroll.current !== index) return;
    pendingScroll.current = null;
    sections.current[index]?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
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
          <motion.li key={item} variants={itemVariants}>
            {item}
          </motion.li>
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
          <motion.li key={phase.title} variants={itemVariants}>
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
          </motion.li>
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
          <motion.article
            className="package-example"
            key={example.title}
            variants={itemVariants}
          >
            <h3>{example.title}</h3>
            <dl>
              <dt>The situation</dt>
              <dd>{example.problem}</dd>
              <dt>Approach</dt>
              <dd>{example.approach}</dd>
              <dt>A useful outcome</dt>
              <dd>{example.outcome}</dd>
            </dl>
          </motion.article>
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
      <nav
        className="package-progress"
        data-package-progress
        aria-label="Explore package sections"
      >
        <ol>
          {chapters.map((chapter, index) => (
            <li key={chapter.id}>
              {enhanced ? (
                <button
                  type="button"
                  aria-current={active === index ? "step" : undefined}
                  onClick={() => goTo(index)}
                >
                  <span className="package-progress-number">0{index + 1}</span>
                  {["Scope", "Process", "Examples", "Investment"][index]}
                  {active === index && (
                    <motion.span
                      className="package-progress-active"
                      layoutId={
                        reducedMotion ? undefined : "package-progress-active"
                      }
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 32,
                      }}
                    />
                  )}
                </button>
              ) : (
                <a href={`#explore-${chapter.id}`}>
                  <span className="package-progress-number">0{index + 1}</span>
                  {["Scope", "Process", "Examples", "Investment"][index]}
                </a>
              )}
            </li>
          ))}
        </ol>
      </nav>
      {chapters.map((chapter, index) => (
        <AnimatedChapter
          key={chapter.id}
          {...chapter}
          index={index}
          expanded={active === index}
          enhanced={enhanced}
          reducedMotion={reducedMotion}
          sectionRef={(node) => {
            sections.current[index] = node;
          }}
          onSelect={() => {
            if (active === index) {
              pendingScroll.current = null;
              setActive(null);
            } else goTo(index);
          }}
          onExpanded={() => finishOpening(index)}
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
        </AnimatedChapter>
      ))}
    </section>
  );
}
