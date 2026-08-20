"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

/**
 * Signature micro-interaction: a hairline grows 0 → 100% across a row
 * once it scrolls into view. 400ms, plays once. Reveals stay section-header
 * scoped only. Reduced-motion falls back to a static full rule via CSS.
 */
export default function HairlineDraw() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  return (
    <motion.div
      ref={ref}
      className="hairline-draw"
      style={{ marginTop: "var(--sp-6)" }}
      initial={{ scaleX: 0 }}
      animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      aria-hidden="true"
    />
  );
}
