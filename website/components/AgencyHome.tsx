"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { identity, pullQuote } from "../lib/site";
import { packages } from "../lib/agency";
import { withBase } from "../lib/site-config";
import { founderExperience } from "../lib/founder";
import EngagementVisual from "./EngagementVisual";

const situations = [
  {
    label: "Decide",
    question: "Where should we use AI?",
    steps: ["Business priorities", "Options & evidence", "A practical roadmap"],
    result: "A decision your team can act on.",
    package: "leadership",
    action: "Explore AI leadership",
  },
  {
    label: "Build",
    question: "How do we get this shipped?",
    steps: ["A scoped release", "Implementation & tests", "Review & handover"],
    result: "Working software in your own repository.",
    package: "build",
    action: "Explore a focused build",
  },
  {
    label: "Improve",
    question: "What happens after the demo?",
    steps: [
      "Assess the workflow",
      "Compare the options",
      "Scope the next step",
    ],
    result: "A technical brief and a scoped plan for improvement.",
    package: "discovery",
    action: "Explore a discovery sprint",
  },
] as const;
const process = [
  {
    title: "Agree",
    description: "The business objective, scope and evidence of success.",
    output: "A shared brief",
  },
  {
    title: "Build",
    description:
      "Small tasks, AI-assisted implementation and specialist support where needed.",
    output: "Working increments",
  },
  {
    title: "Review",
    description: "Human code review, tests, evaluations and release decisions.",
    output: "Acceptance evidence",
  },
  {
    title: "Hand over",
    description:
      "Your code, your accounts, operating notes and agreed support.",
    output: "A system your team owns",
  },
];

export default function AgencyHome() {
  const [situation, setSituation] = useState(0);
  const [selected, setSelected] =
    useState<(typeof packages)[number]["slug"]>("leadership");
  const [stage, setStage] = useState(0);
  const [ready, setReady] = useState(false);
  const preference = useReducedMotion();
  useEffect(() => setReady(true), []);
  const reduced = !ready || preference !== false;
  const [rotationEnabled, setRotationEnabled] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const update = () => setVisible(document.visibilityState === "visible");
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  const rotating =
    rotationEnabled && !hovered && !focused && visible && !reduced;
  useEffect(() => {
    if (!rotating) return;
    const timer = window.setInterval(
      () => setSituation((index) => (index + 1) % situations.length),
      3000,
    );
    return () => window.clearInterval(timer);
  }, [rotating]);
  useEffect(() => {
    const restoreSelection = () => {
      const slug = new URLSearchParams(window.location.search).get("package");
      const match = packages.find((offer) => offer.slug === slug);
      setSelected(match?.slug ?? "leadership");
    };
    restoreSelection();
    window.addEventListener("popstate", restoreSelection);
    return () => window.removeEventListener("popstate", restoreSelection);
  }, []);
  function selectPackage(slug: (typeof packages)[number]["slug"]) {
    setSelected(slug);
    const url = new URL(window.location.href);
    url.searchParams.set("package", slug);
    window.history.replaceState(
      window.history.state,
      "",
      url.pathname + url.search + url.hash,
    );
  }

  const current = situations[situation];
  const offer = packages.find((p) => p.slug === selected)!;
  const entrance = reduced ? false : { opacity: 0, y: 14 };
  const exit = reduced ? { opacity: 1 } : { opacity: 0, y: -8 };

  return (
    <main id="main" className="v2-main">
      <section className="v2-hero">
        <div className="v2-hero-copy">
          <p className="v2-eyebrow">
            <span className="v2-dot" /> Independent AI & software lead · Berlin
          </p>
          <h1>
            Clear AI decisions.
            <br />
            <span>Working software.</span>
          </h1>
          <p className="v2-hero-description">
            I’m Jurica, a former VP of AI & Data Science with over a decade of
            experience in applied AI. I help B2B teams choose where to invest in
            AI, then lead the engineering to put the right ideas into use.
          </p>
          <div className="v2-actions">
            <a className="v2-button" href="#v2-packages">
              Compare engagements <span aria-hidden="true">↗</span>
            </a>
            <a className="v2-link" href={withBase("/founder/")}>
              More about me <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
        <div
          className="v2-workbench"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocusCapture={() => setFocused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget))
              setFocused(false);
          }}
        >
          <div className="v2-workbench-top">
            <span>A practical starting point</span>
            <button
              type="button"
              className="v2-rotation-control"
              disabled={ready && preference === true}
              onClick={() => setRotationEnabled((value) => !value)}
            >
              {ready && preference === true
                ? "Automatic rotation off"
                : rotationEnabled
                  ? "Pause automatic rotation"
                  : "Start automatic rotation"}
            </button>
          </div>
          <div
            className="v2-situation-picker"
            role="group"
            aria-label="Choose your starting point"
          >
            {situations.map((item, i) => (
              <button
                type="button"
                key={item.label}
                aria-pressed={situation === i}
                onClick={() => {
                  setRotationEnabled(false);
                  setSituation(i);
                }}
              >
                {item.label}
                {situation === i && (
                  <motion.span
                    className="v2-situation-highlight"
                    layoutId={reduced ? undefined : "v2-situation"}
                    transition={{ type: "spring", stiffness: 350, damping: 32 }}
                  />
                )}
              </button>
            ))}
          </div>
          <div
            className="v2-workbench-content"
            aria-live={rotating ? "off" : "polite"}
            aria-atomic="true"
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={situation}
                initial={entrance}
                animate={{ opacity: 1, y: 0 }}
                exit={exit}
                transition={{ duration: reduced ? 0 : 0.22 }}
              >
                <h2>{current.question}</h2>
                <ol className="v2-decision-path">
                  {current.steps.map((step, i) => (
                    <motion.li
                      key={step}
                      initial={false}
                      animate={{ opacity: 1 }}
                      transition={{ delay: reduced ? 0 : i * 0.08 }}
                    >
                      <span className="v2-path-node">0{i + 1}</span>
                      <span>{step}</span>
                      {i < 2 && (
                        <span className="v2-path-arrow" aria-hidden="true">
                          ↓
                        </span>
                      )}
                    </motion.li>
                  ))}
                </ol>
                <div className="v2-workbench-result">
                  <span aria-hidden="true">↳</span>
                  <p>{current.result}</p>
                </div>
                <a
                  className="v2-scenario-action"
                  href={withBase(`/services/${current.package}/`)}
                >
                  {current.action}
                </a>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="v2-human-rail">
            <span className="v2-avatar">JŠ</span>
            <div>
              <strong>I lead the decisions.</strong>
              <span>I use AI tools to help with execution.</span>
            </div>
            <span className="v2-check" aria-hidden="true">
              ✓
            </span>
          </div>
        </div>
      </section>

      <section
        className="v2-services v2-section"
        id="v2-services"
        aria-labelledby="v2-services-title"
      >
        <div className="v2-section-heading">
          <h2 id="v2-services-title">
            Start with what
            <br />
            needs to change.
          </h2>
          <p>
            An investment decision, a product release or a workflow that takes
            too much manual effort.
          </p>
        </div>
        <div className="v2-service-grid">
          {[
            {
              title: "AI strategy & leadership",
              text: "Choose opportunities, compare tools and decide what to fund. Give the roadmap an owner.",
              slug: "leadership",
              symbol: "↗",
              label: "Decide what matters",
            },
            {
              title: "Software development",
              text: "Internal tools, customer-facing features and integrations, with testing and handover.",
              slug: "build",
              symbol: "⌘",
              label: "Build the right release",
            },
            {
              title: "AI workflow automation",
              text: "Document processing, retrieval and agent-assisted workflows with review and cost controls.",
              slug: "discovery",
              symbol: "⇢",
              label: "Improve how work gets done",
            },
          ].map((service, i) => (
            <a
              className="v2-service-card"
              href="#v2-packages"
              key={service.slug}
              onClick={() => selectPackage(service.slug as typeof selected)}
            >
              <div className="v2-service-card-top">
                <span>0{i + 1}</span>
                <span aria-hidden="true">{service.symbol}</span>
              </div>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
              <span className="v2-service-card-link">
                {service.label}
                <span aria-hidden="true">↗</span>
              </span>
            </a>
          ))}
        </div>
      </section>

      <section
        className="v2-section v2-experience"
        id="v2-experience"
        aria-labelledby="experience-title"
      >
        <div className="v2-section-heading">
          <h2 id="experience-title">Work I’ve led.</h2>
          <p>
            Selected projects from my previous leadership and engineering roles,
            across AI leadership, document workflows and product engineering.
          </p>
        </div>
        <div className="v2-evidence-grid">
          {[
            founderExperience[0],
            founderExperience[4],
            founderExperience[5],
          ].map((item) => (
            <article key={item.domain}>
              <h3>{item.domain}</h3>
              <p className="v2-evidence-role">{item.role}</p>
              <p>{item.contribution}</p>
              <p className="v2-evidence-connection">{item.connection}</p>
            </article>
          ))}
        </div>
        <p className="v2-evidence-note">
          These projects come from past employment, separate from agency
          engagements. Employer and client names are omitted.
        </p>
      </section>

      <section
        className="v2-process v2-section"
        id="v2-process"
        aria-labelledby="v2-process-title"
      >
        <div className="v2-section-heading">
          <h2 id="v2-process-title">
            I lead the work.
            <br />
            Your team keeps it.
          </h2>
          <p>
            Clear decisions, reviewed implementation and a handover your team
            can use. Explore each stage.
          </p>
        </div>
        <div
          className="v2-process-steps"
          role="group"
          aria-label="Explore the delivery stages"
        >
          {process.map((step, i) => (
            <button
              type="button"
              key={step.title}
              aria-pressed={stage === i}
              onClick={() => setStage(i)}
            >
              <span>0{i + 1}</span>
              <strong>{step.title}</strong>
              <span className="v2-process-arrow" aria-hidden="true">
                →
              </span>
            </button>
          ))}
        </div>
        <div className="v2-process-detail" aria-live="polite">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={stage}
              initial={entrance}
              animate={{ opacity: 1, y: 0 }}
              exit={exit}
              transition={{ duration: reduced ? 0 : 0.2 }}
            >
              <p>{process[stage].description}</p>
              <span>
                <span aria-hidden="true">↳ </span>
                {process[stage].output}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="v2-ownership">
          <span>Client-owned code</span>
          <span>Human release review</span>
          <span>Agreed usage budgets</span>
          <span>Defined support</span>
        </div>
      </section>

      <section
        className="v2-founder v2-section"
        id="v2-founder"
        aria-labelledby="v2-founder-title"
      >
        <div className="v2-founder-art" aria-hidden="true">
          <span>JŠ</span>
          <div>
            Research.
            <br />
            Engineering.
            <br />
            Leadership.
          </div>
        </div>
        <div>
          <h2 id="v2-founder-title">Hi, I’m Jurica.</h2>
          <p>
            I’ve built language systems, led AI teams and owned platform
            roadmaps. My background spans healthcare, document intelligence,
            speech recognition and GenAI product engineering.
          </p>
          <p>
            I bring that experience to your project directly. You work with me
            on the priorities, architecture and decisions about what ships.
          </p>
          <div className="v2-founder-facts">
            <span>
              <strong>10+ years</strong>Applied AI & software
            </span>
            <span>
              <strong>VP-level</strong>AI platform leadership
            </span>
            <span>
              <strong>PhD</strong>Research background
            </span>
          </div>
          <a className="v2-link" href={withBase("/founder/")}>
            Explore domains, roles & projects <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <section
        className="v2-section v2-recommendation"
        aria-labelledby="recommendation-title"
      >
        <h2 id="recommendation-title">A colleague’s perspective.</h2>
        <figure>
          <blockquote>
            <p>“{pullQuote.quote}”</p>
          </blockquote>
          <figcaption>{pullQuote.author}</figcaption>
        </figure>
      </section>

      <section
        className="v2-section v2-packages"
        id="v2-packages"
        aria-labelledby="v2-packages-title"
      >
        <div className="v2-section-heading">
          <h2 id="v2-packages-title">
            A clear scope.
            <br />A useful outcome.
          </h2>
          <p>
            Choose a package to explore the work, the process and the
            investment. Prices exclude VAT where applicable.
          </p>
        </div>
        <div
          className="v2-package-picker"
          data-v2-package-picker
          role="group"
          aria-label="Choose an engagement"
        >
          {packages.map((p, i) => (
            <button
              type="button"
              key={p.slug}
              aria-pressed={selected === p.slug}
              onClick={() => selectPackage(p.slug)}
            >
              <span className="v2-small-label">
                0{i + 1} / {p.timeline}
              </span>
              <strong>{p.name}</strong>
              <span className="v2-package-fit">{p.fit}</span>
              <span>
                {p.price}
                <span className="v2-picker-unit"> {p.unit}</span>
              </span>
              {selected === p.slug && (
                <motion.span
                  className="v2-package-active"
                  layoutId={reduced ? undefined : "v2-package"}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
        <div
          className="v2-package-stage"
          aria-live="polite"
          aria-atomic="false"
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              className="v2-package-panel"
              key={selected}
              initial={entrance}
              animate={{ opacity: 1, y: 0 }}
              exit={exit}
              transition={{ duration: reduced ? 0 : 0.24 }}
            >
              <div className="v2-package-overview">
                <h3>{offer.name}</h3>
                <p>{offer.summary}</p>
                <ul>
                  {offer.deliverables.map((item) => (
                    <li key={item}>
                      <span aria-hidden="true">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="v2-package-price">
                  <strong>{offer.price}</strong>
                  <span>{offer.unit} · ex VAT where applicable</span>
                </div>
                <a
                  className="v2-button"
                  href={withBase(`/services/${offer.slug}/`)}
                >
                  Explore scope & use cases <span aria-hidden="true">↗</span>
                </a>
              </div>
              <div className="v2-package-visual">
                <EngagementVisual kind={offer.slug} />
                <p className="v2-package-boundary">{offer.exclusions}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <p className="v2-package-footnote">
          Final scope, capacity and dates are agreed in writing. Production
          hosting and model usage are separate.
        </p>
      </section>

      <section className="v2-contact" id="v2-contact">
        <h2>
          What are you
          <br />
          working on?
        </h2>
        <p>
          Bring the business goal, the open questions and the constraints. I’ll
          help you work out a useful next step.
        </p>
        <div className="v2-actions">
          <a
            className="v2-button v2-button-lime"
            href={identity.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Book an introductory call <span aria-hidden="true">↗</span>
          </a>
          <a className="v2-link" href={`mailto:${identity.email}`}>
            Email Jurica <span aria-hidden="true">↗</span>
          </a>
        </div>
        <span className="v2-contact-location">
          Berlin · English, German & Croatian
        </span>
      </section>
    </main>
  );
}
