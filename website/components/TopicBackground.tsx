"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { TOPIC_META, TOPIC_ORDER, type TopicKey } from "../lib/topics";
import { THEME_EVENT } from "../lib/theme";

/**
 * Folio topic-index background. Mounted once (root layout).
 *
 * Tracks which [data-topic] section is under the viewport centre line
 * (IntersectionObserver band) and shifts a full-bleed accent wash, a sparse
 * hairline field and a corner mono label between the three pillars
 * (strategy / architecture / transformation). One shared spring drives every
 * color; reduced-motion users get the same treatment with the spring bypassed
 * (static snap).
 *
 * Colors resolve against the ACTIVE theme: the topic→token mapping in
 * lib/topics.ts is read through getComputedStyle(documentElement) and
 * re-read whenever the theme changes, so the washes use the light newsprint
 * accent/tech in light and the Forge ember/steel in dark.
 */

type Palette = Record<TopicKey, { accent: string; hair: string }>;

const WASH_ALPHA: Record<TopicKey, number> = {
  folio: 0,
  strategy: 0.08,
  architecture: 0.08,
  transformation: 0.07,
};

const HAIR_ALPHA: Record<TopicKey, number> = {
  folio: 0.9,
  strategy: 0.5,
  architecture: 0.5,
  transformation: 0.5,
};

const GRID_LEFT = [25, 50, 75];

/* SSR fallback — the light newsprint values; replaced on first client render. */
const FALLBACK_PALETTE: Palette = {
  folio: { accent: "#6f6d66", hair: "#d8d3c6" },
  strategy: { accent: "#8f4519", hair: "#d8d3c6" },
  architecture: { accent: "#2c5c82", hair: "#d8d3c6" },
  transformation: { accent: "#b3561f", hair: "#d8d3c6" },
};

function readPalette(): Palette {
  if (typeof document === "undefined") return FALLBACK_PALETTE;
  const styles = getComputedStyle(document.documentElement);
  const read = (v: string) => styles.getPropertyValue(v).trim() || "#000";
  const out = {} as Palette;
  for (const key of TOPIC_ORDER) {
    const meta = TOPIC_META[key];
    out[key] = { accent: read(meta.accentVar), hair: read(meta.hairVar) };
  }
  return out;
}

function rgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function TopicBackground() {
  const reduced = useReducedMotion() ?? true;
  const [topic, setTopic] = useState<TopicKey>("folio");
  const [palette, setPalette] = useState<Palette>(() => readPalette());

  /* The transform callbacks below read the palette through a ref so the
     spring-driven topic transitions keep working; the palette is re-read and
     the spring nudged on theme change (see the effect at the bottom). */
  const paletteRef = useRef(palette);
  paletteRef.current = palette;

  const targetIndex = useMotionValue(0);
  const smoothIndex = useSpring(targetIndex, { stiffness: 90, damping: 22, mass: 1 });
  const index = reduced ? targetIndex : smoothIndex;

  useEffect(() => {
    targetIndex.set(TOPIC_ORDER.indexOf(topic));
  }, [topic, targetIndex]);

  useEffect(() => {
    /* Re-read on mount (the pre-paint script may have set dark before we
       rendered) and on every theme flip. */
    setPalette(readPalette());
    const onThemeChange = () => setPalette(readPalette());
    window.addEventListener(THEME_EVENT, onThemeChange);
    return () => window.removeEventListener(THEME_EVENT, onThemeChange);
  }, []);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-topic]"));
    if (els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        let best: HTMLElement | null = null;
        let bestRatio = 0;
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
            best = entry.target as HTMLElement;
            bestRatio = entry.intersectionRatio;
          }
        }
        if (best) {
          const next = best.dataset.topic as TopicKey | undefined;
          if (next && next in TOPIC_META) setTopic(next);
        }
      },
      // Observe a thin band at the viewport centre (rootMargin shrinks the
      // root by 45% top and bottom) — the section under the centre line is the
      // active one. Works for sections taller than the viewport too.
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.5, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* When the theme changes, nudge the index so the transform callbacks
     re-evaluate against the new palette (the spring resettles instantly to
     the same topic — no visual jump). */
  useEffect(() => {
    const i = index.get();
    targetIndex.set(i + 1e-4);
    targetIndex.set(i);
  }, [palette, index, targetIndex]);

  const washColor = useTransform(index, (i) => {
    const t = TOPIC_ORDER[Math.round(i)];
    return rgba(paletteRef.current[t].accent, WASH_ALPHA[t]);
  });
  const hairColor = useTransform(index, (i) => {
    const t = TOPIC_ORDER[Math.round(i)];
    return rgba(paletteRef.current[t].hair, HAIR_ALPHA[t]);
  });
  const labelColor = useTransform(index, (i) => {
    const t = TOPIC_ORDER[Math.round(i)];
    return paletteRef.current[t].accent;
  });

  return (
    <>
      <div className="topic-bg" aria-hidden="true" data-folio-topic={topic}>
        <motion.div className="topic-bg-wash" style={{ backgroundColor: washColor }} />
        <motion.div className="topic-bg-grid" style={{ color: hairColor }}>
          {GRID_LEFT.map((left) => (
            <span key={left} className="topic-bg-line" style={{ left: `${left}%` }} />
          ))}
        </motion.div>
      </div>
      <motion.span className="topic-bg-label" aria-hidden="true" style={{ color: labelColor, opacity: 0.8 }}>
        <span className="topic-bg-mark" />
        {TOPIC_META[topic].label}
      </motion.span>
    </>
  );
}
