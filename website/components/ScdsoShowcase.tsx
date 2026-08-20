"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { mandates } from "../lib/mandates";

/**
 * SCDSO index → fixed-slot record detail.
 * Index rows stay put; only the detail slot swaps content (no sibling reflow).
 */
export default function ScdsoShowcase() {
  const [activeId, setActiveId] = useState(mandates[0].id);
  const active = mandates.find((m) => m.id === activeId) ?? mandates[0];
  const reduce = useReducedMotion();

  return (
    <div className="scdso">
      <div className="scdso-grid">
        <div className="scdso-index">
          {mandates.map((m) => {
            const isActive = m.id === activeId;
            return (
              <button
                key={m.id}
                type="button"
                className={`scdso-row${isActive ? " is-active" : ""}`}
                onClick={() => setActiveId(m.id)}
                aria-expanded={isActive}
                aria-controls="scdso-record"
              >
                <span className="idx">{m.num}</span>
                <span>
                  <span className="co">
                    {m.company}
                    {m.featured ? <span className="tag is-accent"> Selected</span> : null}
                  </span>
                  <span className="one-line" style={{ display: "block" }}>
                    {m.role} · {m.sector}
                  </span>
                </span>
                <span className="pd">{m.period}</span>
              </button>
            );
          })}
        </div>

        <div id="scdso-record" className="scdso-slot" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.id}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="scdso-record-head">
                <div>
                  <span className="scdso-record-title">{active.company}</span>
                  <div className="scdso-record-meta" style={{ marginTop: 6 }}>
                    <span>{active.role}</span>
                    <span>{active.sector}</span>
                    <span>{active.period}</span>
                  </div>
                </div>
                <span className="meta" style={{ textTransform: "uppercase", letterSpacing: "0.12em", fontSize: "0.6875rem" }}>
                  Constraint · {active.constraintClass}
                </span>
              </div>

              <div className="scdso-field">
                <span className="k">Situation</span>
                <p className="v">{active.situation}</p>
              </div>
              <div className="scdso-field">
                <span className="k">Constraint</span>
                <p className="v scdso-constraint">{active.constraint}</p>
              </div>
              <div className="scdso-field">
                <span className="k">Decision</span>
                <p className="v">{active.decision}</p>
              </div>
              <div className="scdso-field">
                <span className="k">System</span>
                <ul className="v">
                  {active.system.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
              <div className="scdso-field">
                <span className="k">Outcome</span>
                <p className="v">{active.outcome}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
