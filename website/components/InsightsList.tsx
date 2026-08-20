"use client";

import { motion } from "motion/react";
import { insights } from "../lib/insights";
import { withBase } from "../lib/site";

export default function InsightsList() {
  return (
    <div>
      {insights.map((insight, i) => (
        <motion.a
          key={insight.slug}
          href={withBase(`/insights/${insight.slug}`)}
          className="insight-row"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="idx">{String(i + 1).padStart(2, "0")}</span>
          <span className="insight-main">
            <span className="insight-line">
              <h3>{insight.title}</h3>
              <span className="dot-leader" aria-hidden="true" />
              <span className="insight-desc">{insight.oneLine}</span>
            </span>
            <span className="insight-tags">
              {insight.tags.map((tag) => (
                <span key={tag}>
                  [{tag}]
                </span>
              ))}
            </span>
          </span>
        </motion.a>
      ))}
    </div>
  );
}
