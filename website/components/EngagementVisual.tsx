"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

export type EngagementKind =
  | "discovery"
  | "build"
  | "partnership"
  | "leadership"
  | "approach";
const visuals = {
  discovery: {
    title: "Compare the options before building.",
    description:
      "Compare the alternatives against real workflow evidence before choosing the next step.",
    labels: [
      "Buy an existing tool",
      "Automate with rules",
      "Build a custom solution",
    ],
    legend: [
      "Explore the options",
      "Check evidence and feasibility",
      "Recommend a next step",
    ],
  },
  build: {
    title: "From a brief to a release.",
    description:
      "Implementation moves through tests and human review before it reaches your production environment.",
    labels: ["Define", "Implement", "Review", "Release"],
    legend: [
      "Agree the release",
      "Build and test",
      "Review the evidence",
      "Deploy and hand over",
    ],
  },
  partnership: {
    title: "Plan and review ongoing work.",
    description:
      "Plan the work, deliver in small increments and use regular reviews to choose what comes next.",
    labels: ["Plan", "Build & test", "Demo & review"],
    legend: [
      "Monthly priorities",
      "Weekly delivery and review",
      "Next-month decisions",
    ],
  },
  leadership: {
    title: "Keep AI decisions tied to business priorities.",
    description:
      "Decide what to fund, how it will work, who owns it and how people will use it.",
    labels: ["Investment", "Technology", "Governance", "Adoption"],
    legend: [
      "Allocate investment",
      "Choose the technology",
      "Define ownership",
      "Support adoption",
    ],
  },
  approach: {
    title: "Five stages. Clear checkpoints.",
    description:
      "I lead planning and review throughout. Your team stays involved in the decisions and takes ownership at handover.",
    labels: ["Agree", "Plan", "Build", "Review", "Hand over"],
    legend: [
      "Agree the outcome",
      "Plan the implementation",
      "Build and test",
      "Approve the release",
      "Hand over the work",
    ],
  },
} as const;

export default function EngagementVisual({ kind }: { kind: EngagementKind }) {
  const visual = visuals[kind];
  const reduced = useReducedMotion() !== false;
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  // Keep the first browser render identical to the static export.
  const animate = ready && !reduced;
  const line = (d: string, delay = 0) => (
    <g key={d}>
      <path d={d} className="engagement-wire" />
      {animate && (
        <motion.path
          d={d}
          className="engagement-wire engagement-wire-draw"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay, ease: "easeInOut" }}
        />
      )}
    </g>
  );
  const node = (
    x: number,
    y: number,
    label: string,
    width = 136,
    accent = false,
  ) => (
    <g key={label}>
      <rect
        x={x - width / 2}
        y={y - 26}
        width={width}
        height={52}
        rx={14}
        className={
          accent ? "engagement-node engagement-node-accent" : "engagement-node"
        }
      />
      <text
        x={x}
        y={y + 5}
        textAnchor="middle"
        className={
          accent
            ? "engagement-node-label engagement-label-accent"
            : "engagement-node-label"
        }
      >
        {label}
      </text>
    </g>
  );

  return (
    <figure
      className="engagement-visual"
      data-engagement-visual={kind}
      aria-labelledby="engagement-visual-title"
    >
      <figcaption>
        <h2 id="engagement-visual-title">{visual.title}</h2>
        <p>{visual.description}</p>
      </figcaption>
      <svg
        className={`engagement-diagram engagement-diagram-${kind}`}
        viewBox="0 0 640 240"
        aria-hidden="true"
        focusable="false"
      >
        {kind === "discovery" && (
          <>
            {[48, 120, 192].map((y, i) =>
              line(`M216 ${y} C275 ${y} 255 120 308 120`, i * 0.15),
            )}
            {line("M408 120 H478", 0.45)}
            {visuals.discovery.labels.map((label, i) =>
              node(120, 48 + i * 72, label, 192),
            )}
            <circle cx="358" cy="120" r="50" className="engagement-evidence" />
            <text
              x="358"
              y="116"
              textAnchor="middle"
              className="engagement-node-label"
            >
              Evidence
            </text>
            <text
              x="358"
              y="137"
              textAnchor="middle"
              className="engagement-small-label"
            >
              value · risk · fit
            </text>
            {node(550, 120, "Decision", 140, true)}
          </>
        )}
        {(kind === "build" || kind === "approach") && (
          <>
            {line("M65 105 H575")}
            {(kind === "build"
              ? visuals.build.labels
              : visuals.approach.labels
            ).map((label, i, all) => {
              const x = 65 + i * (510 / (all.length - 1));
              return (
                <g key={label}>
                  <circle
                    cx={x}
                    cy="105"
                    r="25"
                    className={
                      i === all.length - 1
                        ? "engagement-node engagement-node-accent"
                        : "engagement-node"
                    }
                  />
                  <text
                    x={x}
                    y="110"
                    textAnchor="middle"
                    className={
                      i === all.length - 1
                        ? "engagement-node-label engagement-label-accent"
                        : "engagement-node-label"
                    }
                  >
                    0{i + 1}
                  </text>
                  <text
                    x={x}
                    y="162"
                    textAnchor="middle"
                    className="engagement-node-label"
                  >
                    {label}
                  </text>
                </g>
              );
            })}
            <path d="M65 190 H575" className="engagement-review-rail" />
            <text
              x="320"
              y="218"
              textAnchor="middle"
              className="engagement-small-label"
            >
              Human direction and review throughout
            </text>
          </>
        )}
        {kind === "partnership" && (
          <>
            {[0, 1, 2, 3].map((i) => (
              <g key={i}>
                <rect
                  x={160 + i * 108}
                  y="28"
                  width="94"
                  height="180"
                  rx="10"
                  className="engagement-week"
                />
                <text
                  x={207 + i * 108}
                  y="50"
                  textAnchor="middle"
                  className="engagement-small-label"
                >
                  Week {i + 1}
                </text>
              </g>
            ))}
            {visuals.partnership.labels.map((label, i) => (
              <text
                key={label}
                x="20"
                y={86 + i * 48}
                className="engagement-node-label"
              >
                {label}
              </text>
            ))}
            {[
              { x: 170, y: 68, width: 66 },
              { x: 192, y: 116, width: 360 },
              { x: 214, y: 164, width: 22 },
              { x: 322, y: 164, width: 22 },
              { x: 430, y: 164, width: 22 },
              { x: 538, y: 164, width: 22 },
            ].map((bar, i) => (
              <motion.rect
                key={i}
                {...bar}
                height="22"
                rx="6"
                className={
                  i > 1 ? "engagement-cadence-review" : "engagement-cadence-bar"
                }
                initial={false}
                whileInView={!animate ? undefined : { opacity: [0.45, 1] }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
              />
            ))}
          </>
        )}
        {kind === "leadership" && (
          <>
            {[
              [130, 55],
              [510, 55],
              [130, 185],
              [510, 185],
            ].map(([x, y], i) => line(`M${x} ${y} L320 120`, i * 0.12))}
            {node(320, 120, "Business priorities", 180, true)}
            {visuals.leadership.labels.map((label, i) =>
              node(i % 2 === 0 ? 130 : 510, i < 2 ? 55 : 185, label, 170),
            )}
          </>
        )}
      </svg>
      <ol className="engagement-legend">
        {visual.legend.map((label, i) => (
          <li key={label}>
            <span aria-hidden="true">0{i + 1}</span>
            {label}
          </li>
        ))}
      </ol>
    </figure>
  );
}
