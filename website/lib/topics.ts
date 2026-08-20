/**
 * Topic → background treatment mapping (folio index signal).
 *
 * One axis, three pillars. The accent/hair colors are CSS custom-property
 * names so they resolve against the ACTIVE theme (light newsprint or dark
 * Forge) at runtime:
 * - strategy       → --accent        (deep ember / forge ember)
 * - architecture   → --tech          (steel)
 * - transformation → --accent-bright (bright ember)
 * - folio          → --muted         neutral index / rest state
 * - hairlines      → --line          the theme's hairline color
 *
 * TopicBackground reads the computed values and rebuilds the wash on theme
 * change. The article pages map their taxonomy pillar (insight.theme)
 * straight onto these keys.
 */

export type TopicKey = "folio" | "strategy" | "architecture" | "transformation";

export const TOPIC_ORDER: TopicKey[] = ["folio", "strategy", "architecture", "transformation"];

export const TOPIC_META: Record<TopicKey, { label: string; accentVar: string; hairVar: string }> = {
  folio: { label: "folio", accentVar: "--muted", hairVar: "--line" },
  strategy: { label: "strategy", accentVar: "--accent", hairVar: "--line" },
  architecture: { label: "architecture", accentVar: "--tech", hairVar: "--line" },
  transformation: { label: "transformation", accentVar: "--accent-bright", hairVar: "--line" },
};
