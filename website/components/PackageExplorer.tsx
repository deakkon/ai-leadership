"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { packageComparisonPath, type packages } from "../lib/agency";
import type { PackageStory } from "../lib/package-stories";
import { withBase } from "../lib/site";
import AnimatedChapter, { chapterItem } from "./AnimatedChapter";

type Package = (typeof packages)[number];
const chapters = [
  {
    id: "scope",
    title: "What you get",
    note: "Who it’s for and what’s included",
  },
  {
    id: "journey",
    title: "How it works",
    note: "Steps, reviews and handover",
  },
  {
    id: "examples",
    title: "Where it helps",
    note: "Three example situations",
  },
  {
    id: "investment",
    title: "Price & scope",
    note: "Fees, running costs and limits",
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
      <h3>Who it’s for</h3>
      <p>{offer.audience}</p>
      <h3>What’s included</h3>
      <ul>
        {offer.deliverables.map((item) => (
          <motion.li key={item} variants={itemVariants}>
            {item}
          </motion.li>
        ))}
      </ul>
      <div className="package-takeaway">
        <span>How we agree it’s done</span>
        <p>{offer.acceptance}</p>
      </div>
    </div>,
    <div key="journey">
      <p>
        The proposal sets the dates, dependencies and people involved. These
        steps show how the work moves from the first discussion to handover.
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
      <h3>Who makes the decisions</h3>
      <p>
        I lead technical decisions and release review. AI agents work on
        specific tasks, with tests and human review. The delivery plan names any
        specialist engineers involved.
      </p>
      <h3>After handover</h3>
      <p>
        For implementation work, I propose a 30-day window for reporting
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
          <h2 id="package-explorer-title">Package details.</h2>
        </div>
        <p>Choose a section or follow the steps in order.</p>
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
                  {["Scope", "Process", "Examples", "Price"][index]}
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
                  {["Scope", "Process", "Examples", "Price"][index]}
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
                  href={withBase(packageComparisonPath(offer.slug))}
                >
                  Compare packages
                </a>
              )}
            </nav>
          )}
        </AnimatedChapter>
      ))}
    </section>
  );
}
