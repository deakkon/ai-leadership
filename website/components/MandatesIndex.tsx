"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { getMandate, indexMandates } from "../lib/mandates";
import SCDSORecord from "./SCDSORecord";

export default function MandatesIndex() {
  const [activeId, setActiveId] = useState(indexMandates[0].id);
  const [slotHeight, setSlotHeight] = useState<number | null>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const active = getMandate(activeId);

  useEffect(() => {
    const measure = () => {
      const el = measureRef.current;
      if (!el) return;
      const heights = Array.from(el.children).map((c) => (c as HTMLElement).offsetHeight);
      if (heights.length) setSlotHeight(Math.max(...heights));
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
    };
  }, []);

  return (
    <div className="mandates-grid">
      <div className="mandate-index">
        <h3 className="micro" style={{ padding: "0 0 var(--sp-3)", color: "var(--muted)" }}>
          Further mandates
        </h3>
        {indexMandates.map((m) => {
          const isActive = m.id === activeId;
          return (
            <button
              key={m.id}
              type="button"
              className={`mandate-row${isActive ? " is-active" : ""}`}
              aria-expanded={isActive}
              aria-controls="mandate-detail"
              onClick={() => setActiveId(m.id)}
            >
              <span className="mandate-row-top">
                <span className="num">{m.num}</span>
                <span className="dot-leader" aria-hidden="true" />
                <span className="mandate-company">{m.company}</span>
                <span className="mandate-period">{m.period}</span>
              </span>
              <p className="mandate-one-line">{m.headline}</p>
            </button>
          );
        })}
      </div>
      <div
        id="mandate-detail"
        className="mandate-detail"
        aria-live="polite"
        style={slotHeight ? { height: slotHeight } : undefined}
      >
        <div className="mandate-measure" ref={measureRef} aria-hidden="true">
          {indexMandates.map((m) => (
            <div key={m.id} className="mandate-detail-inner">
              <div className="plate-head" style={{ marginBottom: "var(--sp-4)" }}>
                <div className="plate-head-main">
                  <span className="idx plate-index">{m.num}</span>
                  <h3>{m.company}</h3>
                  <p className="plate-headline">{m.headline}</p>
                </div>
                <div className="plate-meta">
                  <span>
                    {m.role} · {m.sector}
                  </span>
                  <span>{m.period}</span>
                  <span className="constraint">{m.constraintClass}</span>
                </div>
              </div>
              <SCDSORecord record={m} />
            </div>
          ))}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active.id}
            className="mandate-detail-inner"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="plate-head" style={{ marginBottom: "var(--sp-4)" }}>
              <div className="plate-head-main">
                <span className="idx plate-index">{active.num}</span>
                <h3>{active.company}</h3>
                <p className="plate-headline">{active.headline}</p>
              </div>
              <div className="plate-meta">
                <span>
                  {active.role} · {active.sector}
                </span>
                <span>{active.period}</span>
                <span className="constraint">{active.constraintClass}</span>
              </div>
            </div>
            <SCDSORecord record={active} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
