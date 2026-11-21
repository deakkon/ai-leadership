"use client";

import { motion, stagger } from "motion/react";
import type { ReactNode } from "react";

export const chapterItem = (reducedMotion: boolean) => ({
  open: {
    opacity: 1,
    y: 0,
    transition: { duration: reducedMotion ? 0 : 0.28 },
  },
  closed: {
    opacity: 0,
    y: reducedMotion ? 0 : 12,
    transition: { duration: reducedMotion ? 0 : 0.12 },
  },
});

type Props = {
  id: string;
  index: number;
  title: string;
  note: string;
  expanded: boolean;
  enhanced: boolean;
  reducedMotion: boolean;
  onSelect: () => void;
  onExpanded: () => void;
  sectionRef: (node: HTMLDivElement | null) => void;
  children: ReactNode;
};

export default function AnimatedChapter({
  id,
  index,
  title,
  note,
  expanded,
  enhanced,
  reducedMotion,
  onSelect,
  onExpanded,
  sectionRef,
  children,
}: Props) {
  const heading = (
    <>
      <span className="package-chapter-number" aria-hidden="true">
        0{index + 1}
      </span>
      <span className="package-chapter-label">
        <span>{title}</span>
        <span>{note}</span>
      </span>
      <span className="package-chapter-toggle" aria-hidden="true" />
    </>
  );
  return (
    <div
      id={`explore-${id}`}
      className="package-chapter"
      data-expanded={expanded}
      ref={sectionRef}
    >
      {enhanced ? (
        <>
          <h3 className="package-chapter-heading">
            <button
              className="package-chapter-trigger"
              id={`chapter-${id}-title`}
              type="button"
              aria-expanded={expanded}
              aria-controls={`chapter-${id}-panel`}
              onClick={onSelect}
            >
              {heading}
            </button>
          </h3>
          <motion.div
            id={`chapter-${id}-panel`}
            className="package-chapter-panel"
            role="region"
            aria-labelledby={`chapter-${id}-title`}
            aria-hidden={!expanded}
            inert={!expanded}
            initial={false}
            animate={{ height: expanded ? "auto" : 0 }}
            transition={{
              duration: reducedMotion ? 0 : 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
            onAnimationComplete={() => {
              if (expanded) onExpanded();
            }}
          >
            <motion.div
              className="package-chapter-body"
              initial={false}
              animate={expanded ? "open" : "closed"}
              variants={{
                open: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: reducedMotion ? 0 : 0.25,
                    delayChildren: reducedMotion ? 0 : stagger(0.06),
                  },
                },
                closed: {
                  opacity: 0,
                  y: reducedMotion ? 0 : -8,
                  transition: { duration: reducedMotion ? 0 : 0.15 },
                },
              }}
            >
              {children}
            </motion.div>
          </motion.div>
        </>
      ) : (
        <details open={expanded}>
          <summary>{heading}</summary>
          <div className="package-chapter-body">{children}</div>
        </details>
      )}
    </div>
  );
}
